# 🚀 Production Deployment Guide: Tech Curious

This guide provides the complete, step-by-step instructions for deploying **Tech Curious**:
- **Frontend (Vite + React 19 + Tailwind CSS)**: Deployed on **Vercel**
- **Backend (Node.js + Express + TypeScript)**: Deployed on **Render**

---

## 📌 Architecture & Overview

```
                          ┌─────────────────────────────┐
                          │   Visitor / Browser Client  │
                          └──────────────┬──────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │       Vercel (Edge)       │                   │       Render (Web)        │
   │      Frontend Client      │                   │        Backend API        │
   │  https://<app>.vercel.app │                   │ https://<api>.onrender.com│
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
                 │   API Calls (CORS + Bearer / Cookie)          │
                 └───────────────────────────────────────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   MongoDB Atlas (Optional) │
                           │  or In-Memory Dev Store   │
                           └───────────────────────────┘
```

---

## 1. Deploy the Backend on Render

Deploy the backend first so you have the Render API URL to supply to the frontend.

### Option A: Manual Web Service Setup (Recommended)

1. Sign up / Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your GitHub / GitLab repository containing this code.
4. Configure the service settings:
   - **Name:** `tech-curious-api` (or your chosen name)
   - **Region:** Choose the region closest to your audience (e.g. `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch:** `main` (or your working branch)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `node dist/server.js`
   - **Instance Type:** `Free` (or higher)
5. Scroll down to **Environment Variables** and add:

| Key | Recommended Value | Note |
|---|---|---|
| `NODE_ENV` | `production` | Enables production security optimizations |
| `PORT` | `5000` (or leave empty) | Render automatically injects `PORT` |
| `JWT_SECRET` | *(Generate a 32+ char random string)* | Used for admin session authentication |
| `ADMIN_EMAIL` | `your-email@example.com` | Authorized admin email for OTP access |
| `CONTACT_RECEIVER_EMAIL` | `your-email@example.com` | Email address where Contact Us form messages are sent |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` | Resend API key for OTP and Contact Form emails |
| `RESEND_FROM_EMAIL` | `Tech Curious <onboarding@resend.dev>` | From address (use onboarding@resend.dev or verified custom domain) |
| `CLIENT_URL` | `https://<your-project>.vercel.app` | Vercel production frontend URL |
| `MONGO_URI` | `mongodb+srv://...` *(Optional)* | If omitted, uses built-in in-memory store |
| `GMAIL_USER` | `your-gmail@gmail.com` *(Optional)* | For Gmail fallback if Resend is omitted |
| `GMAIL_APP_PASSWORD` | *(16-char App Password)* *(Optional)* | Generated in Google Account Security |
| `CLOUDINARY_CLOUD_NAME` | *(Optional)* | For persistent custom thumbnail uploads |
| `CLOUDINARY_API_KEY` | *(Optional)* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | *(Optional)* | Cloudinary API secret |

6. Click **Create Web Service**.
7. Once deployed, note down your Render service URL (e.g. `https://tech-curious-api.onrender.com`).
8. Test the live health endpoint:
   ```bash
   curl https://<your-api>.onrender.com/api/health
   ```
   Expected response:
   ```json
   { "status": "ok", "service": "Tech Curious API" }
   ```

### Option B: Render Blueprint (`render.yaml`)

This repository includes a production-ready [`render.yaml`](file:///e:/myprojects/render.yaml). You can simply click **New +** → **Blueprint** on Render, point it to your repo, and Render will automatically configure the web service with all required parameters.

---

## 2. Deploy the Frontend on Vercel

### Step-by-Step Setup

1. Sign up / Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New…** → **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `client`
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `dist` (or leave default)
   - **Install Command:** `npm install` (or leave default)
5. Expand **Environment Variables** and add:

| Key | Value | Note |
|---|---|---|
| `VITE_API_URL` | `https://<your-api>.onrender.com/api` | Your live Render backend API URL |

6. Click **Deploy**.
7. Vercel will build and assign your production domain (e.g. `https://tech-curious.vercel.app`).
8. Return to your **Render Dashboard** and ensure `CLIENT_URL` is set to your new Vercel domain:
   ```
   CLIENT_URL=https://<your-project>.vercel.app
   ```

---

## 3. Social Redirects & Quick Links

The application includes built-in redirects configured on both the client (Vercel & React Router) and the backend (Express API):

| Route / Shortcut | Target Redirect URL |
|---|---|
| `/youtube` or `/yt` | [`https://www.youtube.com/@TechCuriousYT`](https://www.youtube.com/@TechCuriousYT) |
| `/instagram` or `/insta` | [`https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp`](https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp) |

These channels are also integrated directly into:
- Floating Navbar (desktop icons and mobile navigation menu)
- Footer social links
- Homepage Hero CTA ("Watch on YouTube")
- Community & Channel Callout banner ("Subscribe to Channel" & "Follow on Instagram")

---

## 4. Key Deployment Features Configured

1. **SPA Client Routing ([`client/vercel.json`](file:///e:/myprojects/client/vercel.json)):**
   Rewrites all incoming requests (e.g. `/projects/...`, `/admin/dashboard`) to `/index.html` preventing 404 errors on page refreshes.
2. **Monorepo Fallback ([`vercel.json`](file:///e:/myprojects/vercel.json)):**
   Allows deploying directly from the root repository without manual configuration.
3. **Cross-Origin Security & Cookies:**
   - Express server enables CORS for all `*.vercel.app` domains automatically.
   - Dual authentication support: supports `httpOnly` cross-site cookies (`sameSite: 'none'`, `secure: true`) and Bearer token fallback in `localStorage`.
4. **Fast Zero-Downtime Fallback Store:**
   The backend boots with zero delay whether MongoDB Atlas is connected or using the built-in in-memory fallback store.
5. **Render Root Status:**
   Visiting the raw Render backend URL directly in a browser returns a friendly API status JSON instead of a 404 page.

---

## 5. Post-Deployment Verification Checklist

- [ ] Visit your Vercel URL (`https://<app>.vercel.app`). Verify homepage loads with projects and themes.
- [ ] Test the redirect by visiting `https://<app>.vercel.app/youtube` (should redirect to YouTube channel).
- [ ] Test the redirect by visiting `https://<app>.vercel.app/instagram` (should redirect to Instagram profile).
- [ ] Click a tutorial card and test adding a Like.
- [ ] Navigate to `/admin/login` and request an OTP code with your configured `ADMIN_EMAIL`.
