# Hosting Your Privacy Policy

Google Play Store **requires** a publicly accessible privacy policy URL. Here are your options:

---

## Option 1: GitHub Pages (FREE - Recommended) 🌟

GitHub Pages lets you host the privacy policy for free with a custom domain option.

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New Repository"
3. Name it: `heka-calendar-privacy`
4. Make it **Public**
5. Click "Create repository"

### Step 2: Upload Privacy Policy
1. In your new repo, click "Add file" → "Upload files"
2. Upload the `privacy-policy.html` file from this folder
3. Rename it to `index.html` when uploading
4. Click "Commit changes"

### Step 3: Enable GitHub Pages
1. Go to **Settings** tab
2. Scroll down to **Pages** section (left sidebar)
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**
6. Wait 2-3 minutes for the site to deploy

### Step 4: Get Your URL
Your privacy policy will be available at:
```
https://YOUR_USERNAME.github.io/heka-calendar-privacy
```

**Example:**
```
https://mxrti.github.io/heka-calendar-privacy
```

### Step 5: Add to Play Store
Copy this URL and paste it in Google Play Console:
- **App Content → Privacy Policy → Privacy Policy URL**

---

## Option 2: Your Own Website

If you have an existing website, simply upload `privacy-policy.html` to:
```
https://yourdomain.com/privacy-policy
```

Or use the markdown version (`PRIVACY_POLICY.md`) if your site supports markdown.

---

## Option 3: Free Static Hosting Alternatives

### Netlify Drop (Free)
1. Go to [netlify.com/drop](https://netlify.com/drop)
2. Drag and drop the `privacy-policy.html` file
3. Get instant URL like `https://random-name.netlify.app`
4. **Pro:** Can set custom domain later

### Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Deploys automatically

### Surge.sh (Free)
```bash
npm install -g surge
surge privacy-policy.html heka-privacy.surge.sh
```

---

## What URL to Use in Play Store

### For GitHub Pages:
```
https://YOUR_USERNAME.github.io/heka-calendar-privacy
```

### For Custom Domain:
```
https://yourdomain.com/privacy-policy
```

### For Netlify:
```
https://your-site-name.netlify.app
```

---

## Customizing the Privacy Policy

### Update Contact Information
Before uploading, edit these placeholders in the HTML:

```html
<!-- Line 168 -->
<p><strong>Email:</strong> your-email@example.com</p>

<!-- Line 169 -->
<p><strong>Website:</strong> your-website.com</p>
```

### Add Your Business Address (Optional)
If you have a business address, add it after the website line.

---

## Testing Your Privacy Policy URL

Before submitting to Play Store:

1. **Open the URL in browser** - Should display the privacy policy
2. **Test on mobile** - Should be readable on phones
3. **Check all links work** - Email links should open mail app
4. **No login required** - Must be publicly accessible

---

## Play Store Requirements Checklist

| Requirement | Status |
|-------------|--------|
| Publicly accessible URL | ✅ |
| No login required | ✅ |
| Mentions data collected | ✅ |
| Explains how data is used | ✅ |
| Lists third-party services | ✅ |
| Includes contact information | ✅ |
| Dated (Last Updated) | ✅ |

---

## Quick Start Commands

Want to do it all in terminal?

```bash
# 1. Create a new folder for privacy policy
mkdir heka-privacy
cd heka-privacy

# 2. Copy the HTML file
cp ../privacy-policy.html index.html

# 3. Edit with your contact info
nano index.html  # or use any text editor

# 4. Initialize git repo
git init
git add index.html
git commit -m "Initial privacy policy"

# 5. Create GitHub repo (manually on github.com)
# 6. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/heka-calendar-privacy.git
git push -u origin main
```

---

## Troubleshooting

### GitHub Pages not loading?
- Make sure repo is **Public** (not Private)
- Check Settings → Pages shows green checkmark
- URL is case-sensitive: `GitHub.io` ≠ `github.io`

### Formatting looks wrong?
- Make sure file is named `index.html`
- Don't rename the `.html` extension
- CSS is embedded in the file (no external dependencies)

### Need to update the policy?
1. Edit `index.html` in your GitHub repo
2. Commit changes
3. Changes reflect in ~1 minute automatically

---

## Time Estimate

| Task | Time |
|------|------|
| Create GitHub account | 5 min |
| Create repository | 3 min |
| Upload privacy policy | 2 min |
| Enable GitHub Pages | 2 min |
| Test URL | 1 min |
| Add to Play Store | 1 min |
| **Total** | **~15 minutes** |

---

**Need help?** The `privacy-policy.html` file is ready to upload as-is. Just update the contact email and you're good to go! 🚀
