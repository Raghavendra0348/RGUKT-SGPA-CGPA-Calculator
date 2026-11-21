# 🎓 RGUKT SGPA & CGPA Calculator

A free, responsive web-based tool designed for **RGUKT students** to calculate their **SGPA (Semester Grade Point Average)** and **CGPA (Cumulative Grade Point Average)** easily and accurately.

---

## 🌐 Live Website
👉 **[https://www.rgukt-sgpa-cgpa-calculator.tech](https://www.rgukt-sgpa-cgpa-calculator.tech)**

---


## 🚀 Features

- 🧮 Calculate **SGPA & CGPA** for all branches — *CSE, ECE, EEE, CIVIL, MECH, PUC, etc.*
- 📱 Fully **responsive** for mobile, tablet, and desktop users
- 🎓 Supports **PUC & Engineering semesters**
- 🎨 Consistent **UI/UX** with responsive navigation and accessible controls
- 📰 **Blog & Info Section** for GPA tips, FAQs, and guides
- ⚡ **Fast-loading**, SEO optimized, and performance tested

---

## 🧩 Tech Stack

| Frontend | Backend | Hosting | Database |
|-----------|----------|----------|-----------|
| React, Vite, CSS | — | Vercel | subjects.json

---


---

## 🖼️ Website Preview

### 🌟 Homepage  
*(Screenshot coming soon)*

### 🧮 SGPA Calculator  
*(Screenshot coming soon)*

### 📰 Blog Section  
*(Screenshot coming soon)*

---

## Development

Requires Node.js 22.12+ (or 24+) and npm.

```sh
npm ci
npm run dev
```

Run `npm test` for calculator tests and `npm run build` for production output in `dist/`. Deploy `dist/` as a static site. Use `npm run preview` to check the production build locally.

The React single-page app uses `subjects.json` and preserves existing HTML URLs. Internal links use browser-history routing without page reloads; Back/Forward and direct URL loads remain supported. Original guide/legal files supply the article content and metadata at build time. Calculations run in the browser; feedback drafts are copied locally rather than emailed.
