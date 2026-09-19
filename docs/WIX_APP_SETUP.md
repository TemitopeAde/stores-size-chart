# Wix App Setup & Deployment Guide

This guide walks through configuring, developing, previewing, and releasing the **Stores Size Chart & Fit Guide** application using the Wix CLI.

---

## 1. App Configuration

* **App ID**: `75e79d8b-f226-43d6-a8ea-caa526604417`
* **Package Name**: `@admin14744/stores-size-chart`
* **Framework**: Astro 5.x + React 18.x + Tailwind CSS
* **Build System**: `@wix/astro`

---

## 2. CLI Development Workflow

### Step 1: Authentication

Log into your Wix Developer account:

```bash
npx wix login
```

### Step 2: Configure Development Site

List and select your target Wix development store:

```bash
# List available sites
npx wix dev-site list

# Select a site
npx wix dev-site select <WIX_SITE_ID>
```

Alternatively, create a fresh development store:

```bash
npx wix dev-site create --template dev --select
```

### Step 3: Run Local Development Server

```bash
npm run dev
```

The CLI will spin up the local development proxy (default port 4321), proxying Wix SDK auth and rendering the dashboard page directly inside the Wix Dashboard iframe.

---

## 3. Extension Placements & Slots

The application registers two primary extension points in `src/extensions.ts`:

### 3.1 Dashboard Page Extension (`src/dashboard/pages/page.extension.ts`)

* **Type**: `DASHBOARD_PAGE`
* **Route**: `/size-charts`
* **Purpose**: Central merchant control center (spreadsheet builder, product assignments, fit finder settings, billing, analytics).

### 3.2 Site Plugin Extension (`src/site-plugins/size-chart/size-chart.extension.ts`)

* **Type**: `SITE_PLUGIN`
* **Tag Name**: `<stores-size-chart>`
* **Auto-Add**: `true`
* **Placements**:
  1. **Wix Stores V1**:
     * `appDefinitionId`: `1380b703-ce81-ff05-f115-39571d94dfcd`
     * `widgetId`: `13a94f09-2766-3c40-4a32-8edb5acdd8bc`
     * `slotId`: `product-page-details-2`
  2. **Wix Stores V3 (New Ecom)**:
     * `appDefinitionId`: `a0c68605-c2e7-4c8d-9ea1-767f9770e087`
     * `widgetId`: `6a25b678-53ec-4b37-a190-65fcd1ca1a63`
     * `slotId`: `product-page-details-2`

---

## 4. Building & Publishing

### Step 1: Type Checking & Static Analysis

```bash
npx tsc --noEmit
```

### Step 2: Build App Bundle

```bash
npm run build
```

### Step 3: Create Preview Deployment

```bash
npm run preview
```

### Step 4: Publish Release

```bash
# Minor version release
npm run release -- -t minor -c "Production release: Stores Size Chart & Fit Guide"

# Major version release
npm run release -- -t major -c "Major release with dual V1/V3 catalog support"
```

---

## 5. Environment Variables

Environment variables can be pulled and synced with Wix Dev Center using:

```bash
npx wix env pull
```

