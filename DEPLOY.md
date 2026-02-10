# UpwrdFin — Deploy on Render (Free) with Custom Domain & Free SSL

## Prerequisites

- A GitHub account with this repo pushed to it
- A Render account (free at https://render.com)
- Your Supabase project URL and anon key (already in your `.env`)

---

## Step 1: Push Code to GitHub

If not already done:

```bash
git init
git add .
git commit -m "Initial commit - detached from Lovable"
git remote add origin https://github.com/YOUR_USERNAME/upwrdfin.git
git push -u origin main
```

---

## Step 2: Deploy on Render (Free Static Site)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub account and select the `upwrdfin` repo
4. Configure the settings:
   - **Name:** `upwrdfin` (or whatever you want)
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Click **"Advanced"** and add these **Environment Variables:**
   - `VITE_SUPABASE_URL` → your Supabase URL (e.g., `https://ktqybdvxvkalmiwugatr.supabase.co`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` → your Supabase anon key
6. Click **"Create Static Site"**

Render will build and deploy your site. You'll get a free URL like `upwrdfin.onrender.com`.

---

## Step 3: Add SPA Rewrite Rule (Critical for React Router)

After deployment:

1. Go to your static site's dashboard on Render
2. Click **"Redirects/Rewrites"** in the left sidebar
3. Add this rule:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** **Rewrite**
4. Click **Save Changes**

This ensures all routes (like `/stock/OGDC` or `/about`) work correctly instead of showing 404.

---

## Step 4: Connect Your Custom Domain (Free)

1. In Render dashboard → your static site → **"Settings"**
2. Scroll to **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `upwrdfin.com` or `www.upwrdfin.com`)
5. Render will show you the DNS records to add

### DNS Configuration at Your Domain Registrar

Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add:

**For root domain (upwrdfin.com):**
- Type: `A`
- Name: `@`
- Value: (Render will provide the IP address)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `upwrdfin.onrender.com`

DNS propagation takes 5 minutes to 48 hours (usually under 30 minutes).

---

## Step 5: Free SSL (Automatic!)

Render provides **free SSL certificates automatically** via Let's Encrypt for all custom domains. Once your DNS records propagate:

1. Render automatically detects the domain is pointing to it
2. It issues a free Let's Encrypt SSL certificate
3. HTTPS is enabled automatically — no action needed from you
4. Certificates auto-renew before expiration

Your site will be accessible at `https://yourdomain.com` with a valid SSL certificate at zero cost.

---

## Summary of Costs

| Item | Cost |
|------|------|
| Render Static Site hosting | **Free** |
| Custom domain connection | **Free** |
| SSL certificate (Let's Encrypt) | **Free** |
| Supabase (free tier) | **Free** |
| Domain name purchase | ~$10-15/year (only cost) |

---

## Troubleshooting

**Build fails on Render?**
- Check that environment variables are set correctly in Render dashboard
- Make sure the build command is `npm install && npm run build`
- Check the publish directory is `dist`

**Routes show 404?**
- Make sure you added the rewrite rule: `/*` → `/index.html` (Rewrite, not Redirect)

**SSL not working?**
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct in your registrar
- Check Render dashboard — it shows SSL status

**Supabase not connecting?**
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set in Render env vars
- These must be set BEFORE building (they get baked into the JS bundle at build time)
- After changing env vars, trigger a manual deploy in Render
