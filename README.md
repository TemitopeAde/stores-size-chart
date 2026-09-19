# Stores Size Chart & Fit Guide

[![Wix App Market Ready](https://img.shields.io/badge/Wix_App_Market-Certified-blue.svg)](https://wix.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-black.svg)](https://ui.shadcn.com/)
[![Locales](https://img.shields.io/badge/Languages-20%20Fully%20Localized-brightgreen.svg)](docs/LOCALIZATION.md)

**Stores Size Chart & Fit Guide** is an enterprise-grade Wix CLI App Market application designed for Wix Stores merchants. It empowers merchants to create custom, interactive size charts and measurement guides, assign them intelligently to products or categories, display them seamlessly on Wix Stores Product Pages, and guide shoppers to their ideal size using a deterministic Smart Fit Finder.

---

## 🌟 Key Highlights

* **Dual Wix Stores Catalog Support**: Native seamless support for both **Wix Stores V1** (Collections + `products`) and **Wix Stores V3** (Categories + `productsV3` + `catalogVersioning`).
* **Modern Dashboard UI**: Built strictly with **Tailwind CSS**, **shadcn/ui**, **Lucide React**, and **Sonner** notifications (Zero WDS in dashboard for clean, fast modern UX).
* **Wix Widget Settings Panel**: Built with `@wix/design-system` and `@wix/editor` widget API (`widget.getProp` / `widget.setProp`) for live real-time visual customizer in the Wix Studio / Editor.
* **Deterministic Smart Fit Finder**: Rule-based body measurement calculations (Chest, Waist, Hips, Inseam, Foot Length, Height, Weight) with merchant custom weighting, fit preferences (Slim, Regular, Relaxed), and between-sizes arbitration.
* **High-Precision Unit Conversion**: Intelligent conversion engine between Centimeters (CM) and Inches (IN) handling numbers, decimals, ranges (`91–97 cm` ↔ `35.8–38.2 in`), and international sizes.
* **Server-Side Search, Sort & Pagination**: 100% backend-driven cursor and offset querying across size charts, assignments, products, categories, and analytics.
* **Complete Billing Lifecycle Management**: Multi-state entitlement model with server-side protection on public storefront endpoints ensuring smooth operation and fail-safe zero error leakage.
* **20 Native Languages & RTL**: Full localization for 20 languages (`en`, `es`, `fr`, `de`, `pt`, `it`, `nl`, `pl`, `sv`, `da`, `no`, `fi`, `ja`, `ko`, `zh-CN`, `zh-TW`, `ar`, `tr`, `id`, `hi`) with bidirectional (RTL) layout for Arabic.

---

## 🏗️ Architecture & Technology Stack

```
                               ┌──────────────────────────────────────────────┐
                               │             Wix Stores Storefront            │
                               │  (Product Page Details Slot / Custom Element)│
                               └──────────────────────┬───────────────────────┘
                                                      │ fetchWithAuth()
                                                      ▼
┌──────────────────────────────────────┐       ┌──────────────────────────────┐
│        Wix Merchant Dashboard        │       │    Protected API Endpoints   │
│ (shadcn/ui + Tailwind + Lucide Icons)│──────▶│  /api/charts/product         │
└──────────────────────────────────────┘       │  /api/fit/calculate          │
                   │                           │  /api/catalog/products       │
                   │                           │  /api/settings/widget        │
                   ▼                           └──────────────┬───────────────┘
┌──────────────────────────────────────┐                      │
│      Wix Editor Settings Panel       │                      ▼
│    (@wix/design-system + WDS Tabs)   │       ┌──────────────────────────────┐
└──────────────────────────────────────┘       │     Core Services Layer      │
                                               │  * Entitlement & Billing     │
                                               │  * Dual Catalog (V1 & V3)    │
                                               │  * Assignment Resolver       │
                                               │  * Fit Scoring Engine        │
                                               └──────────────────────────────┘
```

---

## 📁 Directory Structure

```
stores-size-chart/
├── src/
│   ├── api/                     # Type-safe API clients (dashboard & storefront)
│   │   ├── dashboard-client.ts
│   │   └── widget-client.ts
│   ├── components/              # Modular dashboard & panel UI components
│   │   ├── analytics/           # Analytics visual dashboard
│   │   ├── assignments/         # Assignment manager with search & sorting
│   │   ├── billing/             # Billing status alerts & plan tiers
│   │   ├── charts/              # Spreadsheet chart editor & templates
│   │   ├── dashboard/           # Main SaaS dashboard overview
│   │   ├── fit-finder/          # Smart fit finder weight & rule configurator
│   │   ├── plugin-status/       # Site plugin installation status & 1-click add
│   │   ├── settings/            # Appearance, general, & localization views
│   │   └── ui/                  # Reusable shadcn/ui Tailwind components
│   ├── dashboard/               # Wix Dashboard Page extension
│   │   └── pages/
│   │       ├── page.extension.ts
│   │       └── page.tsx
│   ├── i18n/                    # Complete 20-language translation engine
│   │   ├── config.ts
│   │   ├── types.ts
│   │   └── locales/*.json       # 20 identical structured locale files
│   ├── lib/                     # Algorithmic engines & core logic
│   │   ├── fit-scoring.ts       # Deterministic fit recommendation engine
│   │   ├── templates.ts         # 13 industry standard size chart presets
│   │   ├── units.ts             # Precision CM/IN conversion & parsing
│   │   └── validation.ts        # Comprehensive Zod schemas
│   ├── pages/api/               # Backend Astro API route endpoints
│   │   ├── analytics/
│   │   ├── assignments/
│   │   ├── billing/
│   │   ├── catalog/
│   │   ├── charts/
│   │   ├── fit/
│   │   ├── plugin-status/
│   │   └── settings/
│   ├── services/                # Business logic & Wix SDK integrations
│   │   ├── analytics-service.ts
│   │   ├── assignment-service.ts
│   │   ├── chart-service.ts
│   │   ├── entitlement-service.ts
│   │   ├── plugin-status-service.ts
│   │   ├── product-service.ts   # Dual V1/V3 catalog engine
│   │   └── widget-settings-service.ts
│   ├── site-plugins/            # Storefront Product Page Custom Element
│   │   └── size-chart/
│   │       ├── size-chart.extension.ts
│   │       ├── size-chart.panel.tsx   # WDS Editor Settings Panel
│   │       └── size-chart.tsx         # Storefront Web Component
│   ├── types/                   # Unified TypeScript schemas & models
│   └── extensions.ts            # Wix CLI app extension registry
├── docs/                        # Complete technical documentation suite
│   ├── ARCHITECTURE.md
│   ├── BILLING_LIFECYCLE.md
│   ├── LOCALIZATION.md
│   ├── WIX_APP_SETUP.md
│   ├── WIX_EVENTS.md
│   └── WIX_PERMISSIONS.md
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js **18.x**, **20.x**, or **22+**
* Wix CLI (`@wix/cli`)

### Installation & Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Select or create a development site**:
   ```bash
   npx wix dev-site select <your-site-id>
   ```

3. **Start local development**:
   ```bash
   npm run dev
   ```

4. **Verify TypeScript compilation**:
   ```bash
   npx tsc --noEmit
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📖 Detailed Documentation

* [Architecture & System Design](docs/ARCHITECTURE.md)
* [Wix App Setup & Installation](docs/WIX_APP_SETUP.md)
* [Wix Scopes & Permissions Audit](docs/WIX_PERMISSIONS.md)
* [Wix Webhooks & Events](docs/WIX_EVENTS.md)
* [Billing Lifecycle & Entitlements](docs/BILLING_LIFECYCLE.md)
* [Localization & Multi-Language Guide](docs/LOCALIZATION.md)

---

## 🔒 Security & Privacy

* **Zero Leaked Errors**: Public storefront endpoints fail quietly with empty payload if unentitled or chart is missing, ensuring zero interference with Wix Stores native checkout flow.
* **Server-Side Token Verification**: All merchant operations validate permissions and signed instance tokens server-side.
* **Sanitized Inputs**: All user inputs, CSV imports, and JSON payloads are validated via Zod schemas before persistence.

