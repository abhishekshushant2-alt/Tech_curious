# ⚡ Tech Curious — Project Portfolio & Creator CMS

A state-of-the-art project portfolio and content management system designed for **Electronics, Robotics, and IoT YouTube creators**. Features rich tutorial case studies, interactive step-by-step assemblies, complete Bill of Materials (BOM) parts lists, copyable syntax-highlighted source code, and a secure passwordless Admin CMS backend with Gmail OTP authentication.

---

## 🎨 Design & Theme Palette

The visual design is curated for hardware engineering and robotics aesthetics:
- **Obsidian Dark Canvas**: Deep `#0A0E17` slate background with subtle circuit traces and ambient glows.
- **Electric Cyan (`#00F2FE` / `#06B6D4`)**: High-tech hardware logic and active signal traces.
- **Cyber Mint (`#10B981`)**: Low-power status indicators and published build tags.
- **Signal Amber (`#F59E0B`)**: LED indicators and interactive rating badges.
- **Clean Light Mode**: High-contrast slate and frosted glass surfaces with smooth theme transitions.

---

## 🏗️ Architecture

```
Tech-curious/
├── client/                     # Vite + React 19 + TypeScript + Tailwind CSS
│   ├── public/                 # Favicon.svg, manifest, assets
│   └── src/
│       ├── assets/             # Themed SVG brand logos (logo-light.svg & logo-dark.svg)
│       ├── components/
│       │   ├── layout/         # Navbar, Footer (Contact Form), SearchModal (⌘K)
│       │   ├── projects/       # ProjectCard, StepList, ComponentList, CodeBlock, LikeButton, Feedback
│       │   └── admin/          # OtpLoginForm, ProjectTable, ProjectEditor, FeedbackModeration
│       ├── context/            # ThemeContext (dark/light) & AuthContext (Admin session)
│       └── pages/              # Home, Projects, ProjectDetail, AdminLogin, AdminDashboard
└── server/                     # Node.js + Express + TypeScript + Mongoose
    ├── src/
    │   ├── config/             # MongoDB connection & Cloudinary v2 setup
    │   ├── models/             # Category, Project, Feedback, ContactMessage, OtpSession
    │   ├── controllers/        # Auth, Project, Category, Feedback, Contact
    │   ├── middleware/         # requireAdmin, rateLimiter, upload, errorHandler
    │   ├── routes/             # REST API routers
    │   ├── services/           # Unified store (Mongoose + in-memory dev fallback)
    │   └── utils/              # 6-digit OTP generator, Nodemailer & JWT signing
```

---

## 🚀 Quick Start

### 1. Install Dependencies
From the root directory:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy the server example `.env`:
```bash
cp server/.env.example server/.env
```

| Variable | Description | Default / Local Behavior |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | Connects to local/Atlas. If offline, gracefully uses built-in in-memory fallback! |
| `ADMIN_EMAIL` | Authorized admin email (or comma-separated) | `admin@techcurious.com` |
| `JWT_SECRET` | Secret key for admin session cookies | Built-in dev secret |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Optional Gmail credentials for OTP dispatch | When empty, OTP code is printed directly to the server terminal! |
| `CLOUDINARY_*` | Optional Cloudinary API credentials | Direct image URLs and fallbacks supported |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:5173` |

### 3. Run Development Servers
Start both backend API and frontend Vite dev servers concurrently:
```bash
npm run dev
```
- **Public Website:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Admin Portal:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

### 4. Run Automated E2E Verification Suite
```bash
npm run test:api
```

---

## 🔑 Admin Login Flow

1. Navigate to `/admin/login` (or click the shield icon in the Navbar).
2. Enter the admin email (`admin@techcurious.com`).
3. Click **"Request Verification Code"**.
4. Check your Gmail inbox (or look in the backend terminal if testing locally).
5. Enter the 6-digit OTP code to receive a secure `httpOnly` JWT session cookie and access the **Admin Dashboard**.
