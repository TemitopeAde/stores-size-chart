# Wix Permissions & OAuth Scopes Audit

This document provides a comprehensive audit of all required Wix permissions, OAuth scopes, and rationale for the **Stores Size Chart & Fit Guide** application.

---

## 1. Required OAuth Scopes Summary

| Scope ID | Scope Name | Required For | Read / Write | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| `wix.stores.read_products` | `SCOPE.STORES.PRODUCT_READ` | Reading product details, SKUs, options, and choices | Read | Low |
| `wix.stores.read_catalog` | `SCOPE.STORES.CATALOG_READ_LIMITED` | Querying products and collections in Stores V1 | Read | Low |
| `wix.stores.v3.read_products` | `SCOPE.DC-STORES.READ-PRODUCTS` | Querying products in Stores V3 Catalog | Read | Low |
| `wix.stores.read_collections` | `SCOPE.STORES.READ_COLLECTIONS` | Reading category & collection lists for assignments | Read | Low |
| `wix.categories.read` | `SCOPE.CATEGORIES.CATEGORY_READ` | Reading taxonomy categories in V3 catalog | Read | Low |
| `wix.app-management.read` | `SCOPE.APP_MANAGEMENT.READ` | Verifying app instance billing status & plan tier | Read | Low |

---

## 2. Detailed Scope Justifications

### 2.1 Stores Product Read (`wix.stores.read_products`, `wix.stores.v3.read_products`)
* **Usage**: Used in `src/services/product-service.ts` to fetch product names, SKUs, options (e.g. Size, Color), choices, and category memberships.
* **Why Necessary**: Needed to dynamically evaluate assignment rules (e.g., matching garment type from title or tags) and to automatically highlight the corresponding size chart row when a shopper selects a size option.
* **Access Level**: Read-only. The app never modifies, updates, or deletes merchant products.

### 2.2 Stores Catalog Read (`wix.stores.read_catalog`, `wix.stores.read_collections`, `wix.categories.read`)
* **Usage**: Used in `queryStoreCategories()` and `queryStoreProducts()` in `src/services/product-service.ts`.
* **Why Necessary**: Allows merchants to browse their store categories when setting up category-level size chart assignments in the dashboard.
* **Access Level**: Read-only.

### 2.3 App Management (`wix.app-management.read`)
* **Usage**: Used in `src/services/entitlement-service.ts` to read the signed App Instance token and query active subscriptions.
* **Why Necessary**: Strictly gates premium features (Smart Fit Finder, unlimited charts, custom branding removal) and ensures unentitled storefronts fail quietly without disrupting merchant stores.
* **Access Level**: Read-only.

---

## 3. Principle of Least Privilege

1. **No Write Permissions to Catalog**: The app does not request or require write access to Wix Stores products, inventory, orders, or pricing.
2. **No Access to Customer Personal Data (PII)**: Shopper measurements entered in the Fit Finder are processed ephemerally in memory and are never linked to customer identities or stored in persistent customer records.
3. **No Financial / Payment Modification**: The app does not interact with or modify checkout payments, taxes, or shipping rates.

