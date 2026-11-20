/*
 * Dhirubhai Estates: a small rendering runtime for the site's pages.
 * Each page keeps its markup in <template id="dc-tpl"> and its logic in a
 * `Component` class. This file fills in {{ ... }} values, repeats <sc-for>
 * blocks, shows or hides <sc-if> blocks, and wires up onClick handlers.
 */
(function () {
  'use strict';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var cache = {};

  function compile(expr) {
    if (!cache[expr]) {
      cache[expr] = new Function('__s', 'with (__s) { return (' + expr + '); }');
    }
    return cache[expr];
  }

  function evaluate(expr, scope) {
    try { return compile(expr)(scope); } catch (e) { return undefined; }
  }

  var WHOLE = /^\s*\{\{([\s\S]+?)\}\}\s*$/;
  var PART = /\{\{([\s\S]+?)\}\}/g;

  function value(str, scope) {
    var m = str.match(WHOLE);
    if (m) return evaluate(m[1], scope);
    return text(str, scope);
  }

  function text(str, scope) {
    if (str.indexOf('{{') === -1) return str;
    return str.replace(PART, function (_, e) {
      var v = evaluate(e, scope);
      return v === null || v === undefined ? '' : String(v);
    });
  }

  function build(node, scope, parent) {
    if (node.nodeType === 3) {
      parent.appendChild(document.createTextNode(text(node.nodeValue, scope)));
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    var i;

    if (tag === 'sc-for') {
      var list = value(node.getAttribute('list') || '', scope) || [];
      var as = node.getAttribute('as') || 'item';
      for (i = 0; i < list.length; i++) {
        var child = Object.create(scope);
        child[as] = list[i];
        buildChildren(node, child, parent);
      }
      return;
    }
    if (tag === 'sc-if') {
      if (value(node.getAttribute('value') || '', scope)) buildChildren(node, scope, parent);
      return;
    }

    var el = node.namespaceURI === SVG_NS
      ? document.createElementNS(SVG_NS, tag)
      : document.createElement(tag);

    for (i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i];
      var name = a.name;
      if (name.indexOf('hint-') === 0) continue;
      if (name.length > 2 && name.indexOf('on') === 0 && a.value.indexOf('{{') !== -1) {
        var fn = value(a.value, scope);
        if (typeof fn === 'function') el.addEventListener(name.slice(2).toLowerCase(), fn);
        continue;
      }
      var v = a.value.indexOf('{{') === -1 ? a.value : value(a.value, scope);
      if (v === null || v === undefined || v === false) continue;
      el.setAttribute(name, String(v));
    }
    buildChildren(node, scope, el);
    parent.appendChild(el);
  }

  function buildChildren(node, scope, parent) {
    var kids = node.content ? node.content.childNodes : node.childNodes;
    for (var i = 0; i < kids.length; i++) build(kids[i], scope, parent);
  }

  function DCLogic(props) {
    this.props = props || {};
    this.state = {};
  }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, next);
    if (this.__schedule) this.__schedule();
  };
  DCLogic.prototype.renderVals = function () { return {}; };
  window.DCLogic = DCLogic;

  window.DC = {
    mount: function (Component) {
      var tpl = document.getElementById('dc-tpl');
      var app = document.getElementById('app');
      var comp = new Component({});
      var pending = false;

      function render() {
        pending = false;
        var frag = document.createDocumentFragment();
        buildChildren(tpl, comp.renderVals(), frag);
        app.replaceChildren(frag);
      }
      comp.__schedule = function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(render);
      };

      render();
      if (typeof comp.componentDidMount === 'function') comp.componentDidMount();
      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
      }
    }
  };
})();
