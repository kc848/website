# Dhirubhai Estates website

The website for dhirubhaiestates.com. It's a static site: plain HTML pages, images and one small script. It needs no server, database or build step, so it is fast, free to host on Vercel, and has nothing to maintain.

## What's in this folder

| File | Page |
|---|---|
| `index.html` | Home |
| `residences.html` | Residences (listings with filters) |
| `services.html` | Services |
| `invest.html` | Investment advisory |
| `sell.html` | Sell or lease |
| `locations.html` | Neighbourhood guides and maps |
| `journal.html` | Journal (Instagram reels) |
| `privacy.html`, `terms.html` | Privacy Policy and Terms of Use |
| `assets/` | Images, logos and `dc.js`, which runs the interactive parts |
| `vercel.json` | Vercel settings: clean URLs (`/residences`), caching, security headers |
| `sitemap.xml`, `robots.txt` | Help Google find and index every page |

## Putting it live

### 1. Upload to GitHub
1. Create a new repository on github.com, for example `dhirubhai-estates-website`. Private is fine.
2. Click **uploading an existing file**, drag in **everything inside this folder** (not the folder itself), and click **Commit changes**.

### 2. Deploy on Vercel
1. On vercel.com, click **Add New → Project** and import the GitHub repository.
2. Set **Framework Preset** to **Other**. Leave Build Command and Output Directory empty.
3. Click **Deploy**. You will get a preview link like `dhirubhai-estates-website.vercel.app`. Check it.

### 3. Connect dhirubhaiestates.com (GoDaddy)
1. In Vercel, open the project, go to **Settings → Domains**, and add `dhirubhaiestates.com` and `www.dhirubhaiestates.com`.
2. Vercel will show the DNS records to add, usually an **A record** for `@` and a **CNAME** for `www`.
3. In GoDaddy, go to **My Products → dhirubhaiestates.com → DNS**. Delete the old A and CNAME records that point to the old Realiti site, then add the records Vercel showed you. **Do not touch MX or TXT records.**
4. Changes usually take effect within an hour. Vercel adds the https padlock automatically.

## Making changes later
Edit a file on GitHub (open it and click the pencil icon) and commit. Vercel redeploys automatically within a minute.

- **Text** is in the page's HTML file. Text for cards and lists is near the bottom of each file, inside the `<script>` section (for example, listings are in `residences.html`, in the list that starts `const all = [`).
- **Images**: upload the new image into `assets/`, then change the file name where it is used.
- **WhatsApp number**: search for `wa.me/919757303000` and replace it in every page.

## Before launch, confirm
- The MahaRERA agent registration number in the footer of every page.
- The project MahaRERA numbers on the listing cards. Check them on maharera.maharashtra.gov.in.
- The placeholders in `privacy.html` and `terms.html` ([DATE], [NAME], [EMAIL ADDRESS]), and the lawyer's review.
