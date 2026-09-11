# 🌐 dap.gal & davidalvarezp.com

> High-performance technical documentation, engineering handbook, and personal portfolio powered by **Astro 5**, **Tailwind CSS**, and **Cloudflare Pages**. Features an edge-native, zero-redirect multi-domain architecture serving localized content across international domains.

[![Built with Astro](https://img.shields.io/badge/Astro-5.x-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Edge_Functions-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![License: Dual / Proprietary](https://img.shields.io/badge/License-Dual%20%7C%20All%20Rights%20Reserved-amber?style=flat-square)](#-license--intellectual-property)

---

## 🧭 Live Deployments

| Region / Locale | Primary Hostname | Scope & Content |
| :--- | :--- | :--- |
| 🇪🇸 **Spanish (Spain / Galicia)** | [**dap.gal**](https://dap.gal) | Systems administration guides, Linux manual, Homelab specs, and technical blog |
| 🇬🇧 **English (International)** | [**davidalvarezp.com**](https://davidalvarezp.com) | English translation of all modules, research articles, and cloud engineering projects |

---

## ⚡ Overview & Architectural Migration

This repository represents the full modernization of an extensive technical handbook and blog originally built with **MkDocs Material** (Python), re-architected into a modern static-site generator using **Astro**:

- **Sub-millisecond Edge Delivery**: Pre-rendered SSG outputs distributed globally across Cloudflare's Anycast network.
- **Type-Safe Content Schema**: Content collections validated at build-time using **Zod** (`astro:content`).
- **Material MkDocs Visual Parity**: Bespoke Tailwind layout replicating Material MkDocs' 3-column navigation (sticky collapsible sidebar, responsive typography, and active scrollspy table of contents).
- **Zero-Redirect Multi-Domain i18n**: A single build pipeline produces both language trees while an edge middleware rewrites incoming hostnames seamlessly without visible 301/302 browser redirects.

---

## 🏗️ Multi-Domain Routing Topology

```
                  ┌─────────────────────────────────────┐
                  │          Incoming Request           │
                  └──────────────────┬──────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        Host: davidalvarezp.com                     Host: dap.gal
                 │                                       │
      [Cloudflare Middleware]                 [Cloudflare Middleware]
   Transparent URL Rewrite to:                         Pass-through to:
            /en/*                                     /* (Default ES)
                 │                                       │
                 ▼                                       ▼
        English Static Assets                   Spanish Static Assets
```

### Edge Middleware (`functions/_middleware.ts`)
Cloudflare Pages evaluates incoming requests at the nearest Point of Presence (PoP):
1. **`davidalvarezp.com`**: Automatically maps root traffic `/` to `/en/` and preserves trailing paths without altering the browser address bar or incurring latency penalties.
2. **`dap.gal`**: Serves the default Spanish root routes directly (`/man-linux/`, `/blog/`, `/homelab/`).

---

## 📂 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Node 22 LTS CI pipeline & orphan deployment branch
├── functions/
│   └── _middleware.ts          # Edge URL rewrite middleware for Cloudflare Pages
├── src/
│   ├── components/
│   │   ├── Header.astro        # Top navigation with localized links & language toggle
│   │   ├── Sidebar.astro       # Collapsible navigation tree with active path awareness
│   │   ├── TableOfContents.astro # Headings index with dynamic scrollspy
│   │   └── Admonition.astro    # MkDocs callout compatibility (tip, note, warning, danger)
│   ├── content/
│   │   ├── config.ts           # Strict Zod schema declarations
│   │   ├── man-linux/          # Comprehensive 12-module Linux SysAdmin manual (ES & EN)
│   │   └── blog/               # Technical writeups, cybersecurity, and DevOps
│   ├── data/
│   │   ├── homelabNodes.json   # Proxmox VE hypervisor specs & LXC/VM topology
│   │   └── cheatsheets.json    # Essential CLI syntax & cheat sheets
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Universal layout: SEO, meta tags, and fonts
│   │   └── DocLayout.astro     # 3-column documentation engine
│   ├── pages/
│   │   ├── index.astro         # dap.gal landing view (ES)
│   │   ├── en/index.astro      # davidalvarezp.com landing view (EN)
│   │   ├── man-linux/          # Linux handbook route handlers
│   │   ├── blog/               # Engineering blog route handlers
│   │   └── homelab.astro       # Homelab hardware dashboard
│   └── styles/
│       └── material-theme.css  # Dark Palenight theme & typography tokens
├── astro.config.mjs            # Astro engine configuration (i18n & Tailwind)
├── package.json
└── tsconfig.json               # Strict TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DavidAlvarezPampillon/test-astro.git
   cd test-astro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify types and build artifacts:**
   ```bash
   # Run strict type checking across all collections and components
   npm run check

   # Generate full production static build into /dist
   npm run build
   ```

---

## 🚢 Continuous Deployment (Cloudflare Pages)

The project uses an automated GitOps deployment workflow:

1. **GitHub Actions (`.github/workflows/deploy.yml`)**:
   - Triggers on every push to the `main` branch.
   - Sets up **Node.js 22 LTS**.
   - Runs `npm ci`, verifies code standards via `npm run check`, and compiles the static site via `npm run build`.
   - Automatically commits and force-pushes the generated `dist/` directory to the isolated `deploy` branch.

2. **Cloudflare Pages Configuration**:
   - **Production Branch**: `deploy`
   - **Build Command**: *(None — pre-compiled by GitHub Actions)*
   - **Build Output Directory**: `/`
   - **Custom Domains**: Bind both `dap.gal` and `davidalvarezp.com` to the same Cloudflare Pages project.

---

## ⚖️ License & Intellectual Property

This repository operates under a **dual-licensing model**:

1. **Software & Infrastructure Code (MIT License)**:
   The underlying website engine, Astro templates, components, utility scripts, configuration files, and edge functions are open-source and licensed under the [MIT License](LICENSE). You are free to inspect, adapt, or reuse the codebase architecture for your own projects.

2. **Written Content & Technical Documentation (Copyright — All Rights Reserved)**:
   All written articles, guides, Linux manual modules, cheatsheets, original diagrams, personal Homelab topologies, and proprietary editorial content published across **dap.gal** and **davidalvarezp.com** are **Copyright © David Álvarez Pampillón. All Rights Reserved.**
   - No reproduction, redistribution, republication, or unauthorized commercial exploitation of the written material is permitted without explicit prior written authorization from the author.
