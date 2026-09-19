# Wix Events & Lifecycle Webhooks

This document outlines the lifecycle events, billing webhooks, and analytics tracking handled by the **Stores Size Chart & Fit Guide** application.

---

## 1. App Lifecycle Webhooks

The application listens to and handles key Wix App lifecycle events:

### 1.1 `wix.app_market.app_installed`
* **Triggered**: When a merchant adds the Size Chart app to their Wix site.
* **Handler Actions**:
  1. Creates default starter size charts (Men's Tops, Women's Dresses, Shoes).
  2. Sets up default fallback assignment.
  3. Initializes default widget display settings (Modal mode, CM default).
  4. Automatically activates the Site Plugin on Wix Stores Product Pages.

### 1.2 `wix.app_market.app_removed`
* **Triggered**: When a merchant uninstalls the app.
* **Handler Actions**:
  1. Marks account state as `UNINSTALLED`.
  2. Cleans up cached instance tokens.
  3. Preserves merchant data for grace period in accordance with Wix privacy policies.

### 1.3 `wix.billing.plan_purchased` / `wix.billing.plan_upgraded`
* **Triggered**: When a merchant upgrades from Free to Pro or enterprise tier.
* **Handler Actions**:
  1. Instantly unlocks unlimited size charts and Smart Fit Finder.
  2. Clears entitlement caches.

### 1.4 `wix.billing.plan_canceled` / `wix.billing.subscription_expired`
* **Triggered**: When a subscription lapses or is canceled.
* **Handler Actions**:
  1. Updates normalized state to `EXPIRED` or `CANCEL_PENDING_EXPIRATION`.
  2. Public storefront endpoints fail quietly with zero error leakage.

---

## 2. Storefront Analytics & Engagement Events

The storefront site plugin tracks shopper interactions via `/api/analytics/track` to provide merchants with conversion and usage insights:

| Event Name | Trigger | Payload |
| :--- | :--- | :--- |
| `SIZE_GUIDE_OPENED` | Shopper clicks Size Guide button | `productId`, `chartId`, `displayMode` |
| `FIT_FINDER_STARTED` | Shopper starts Fit Finder questionnaire | `productId`, `chartId` |
| `FIT_FINDER_COMPLETED` | Shopper completes Fit Finder | `productId`, `chartId`, `recommendedSize`, `confidence` |
| `SIZE_SELECTED` | Shopper selects recommended size | `productId`, `chartId`, `size` |
| `UNIT_TOGGLED` | Shopper switches between CM and IN | `unit` (`'cm'` or `'in'`) |

---

## 3. Product Page Variant & Choice Events

The custom element listens to native Wix Stores Product Page variant events:
* `selected-choices`: Triggered when shopper picks a variant dropdown (e.g. Size: M). The size chart automatically highlights the corresponding row in real time.
* `product-id`: Triggered during client-side navigation between product pages. The site plugin re-queries the matching chart for the new product.

