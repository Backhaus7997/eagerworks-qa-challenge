# Test Report — Swag Labs (SauceDemo)

**Project:** eagerworks QA Engineer Challenge — Part 1: Functional Testing & Reporting
**Application under test:** https://www.saucedemo.com/
**Build:** `static/js/main.bcf4bc5f.js`
**Date of testing:** 2026-06-18
**Tester:** Martín Backhaus
**Test type:** Manual + browser-assisted exploratory functional testing (Playwright/Chromium)

---

## 1. Introduction — What is the product?

**Swag Labs (SauceDemo)** is a demo e-commerce web application built by Sauce Labs. It simulates a small online store that sells branded merchandise ("swag") such as backpacks, t-shirts, and bike lights. It is intentionally designed as a **practice/sandbox application for QA engineers**: it exposes a complete, realistic purchase flow (login → browse → cart → checkout → confirmation) and ships with several pre-built users that deliberately trigger different behaviors and bugs.

The application is a **Single Page Application (SPA)** (React) with no real backend persistence — state (session, cart) is kept client-side in `localStorage`. Authentication is simulated through a fixed list of accepted usernames sharing the password `secret_sauce`.

### Accepted users (and their purpose)

| User | Purpose / expected behavior |
|------|------------------------------|
| `standard_user` | Happy path. Everything works correctly. Used as the **baseline / oracle**. |
| `locked_out_user` | Cannot log in — should display a "locked out" message. |
| `problem_user` | Intentionally buggy UI (images, sorting, cart, form fields). |
| `performance_glitch_user` | Logs in correctly but with artificially slow page loads. |
| `error_user` | Triggers errors during specific flows (e.g. checkout). |
| `visual_user` | Intentional visual/layout defects. |

### Most important feature — and why

> **The checkout flow (cart → checkout information → overview → completion) is the most important feature of this application.**

**Why:** For any e-commerce product, the checkout is where **business value is realized** — it is the conversion point. A user can tolerate a slightly slow catalog or a cosmetic glitch, but if they cannot complete a purchase, or if the **totals are wrong**, the business loses money and trust directly. The checkout also concentrates the highest-risk logic in the app:

- **Money math** (item total, tax, grand total) — must be exact.
- **Data entry & validation** (first name, last name, postal code).
- **State integrity** (the items and prices in the overview must match the cart).
- **Irreversible outcome** (order confirmation).

For these reasons the checkout received the deepest testing in this report, with the inventory/catalog as the second priority (it feeds the cart).

---

## 2. Scope

**In scope**
- Authentication (valid, invalid, locked-out users).
- Product catalog / inventory (listing, images, sorting, add/remove to cart).
- Shopping cart.
- Checkout (information form, validation, totals calculation, confirmation).
- Cross-user behavior comparison (`standard_user` as oracle vs `problem_user`, `locked_out_user`).
- Basic technical health (browser console errors).

**Out of scope**
- Backend/API testing (covered in Part 2).
- Load/performance benchmarking of `performance_glitch_user` (only qualitative note).
- Pixel-perfect visual regression of `visual_user`.
- Security/penetration testing.

---

## 3. Test environment

| Item | Value |
|------|-------|
| URL | https://www.saucedemo.com/ |
| Browser | Chromium (Playwright-driven) |
| OS | macOS (darwin 25.5.0) |
| Viewport | Desktop |
| Network | Standard broadband |
| Data | Default seeded users/products |

---

## 4. Approach

1. Built a **baseline** of correct behavior using `standard_user` (the oracle): full happy-path purchase, verifying the price math.
2. Ran **exploratory functional tests** on the catalog, cart and checkout.
3. Compared `problem_user` and `locked_out_user` against the baseline to surface defects.
4. Captured **evidence** (DOM values, screenshots, console logs).
5. Prioritized **variety and severity** over exhaustiveness, per the challenge guidance ("quality over quantity").

The full set of executed scenarios is in [`03-Test-Scenarios.md`](./03-Test-Scenarios.md); the feature map is in [`02-Feature-Inventory.md`](./02-Feature-Inventory.md); defects are detailed in [`04-Reported-Issues.md`](./04-Reported-Issues.md).

---

## 5. Summary of results

### 5.1 Baseline (`standard_user`) — PASS
- Login, catalog (6 products, all distinct images), add/remove to cart, sorting (A–Z, Z–A, price low/high), and the **complete checkout** all work as expected.
- **Price math verified correct:** item total `$47.97` + tax `$3.84` (≈ 8%) = total `$51.81`.
- Order confirmation ("Thank you for your order!") displayed and cart emptied.

### 5.2 Access control (`locked_out_user`) — PASS (expected behavior)
- Login correctly blocked with message: *"Epic sadface: Sorry, this user has been locked out."*

### 5.3 Defects found (`problem_user` & global)

| ID | Severity | Area | Summary |
|----|----------|------|---------|
| [BUG-01](./04-Reported-Issues.md#bug-01) | High | Catalog / Visual | All 6 product images render the same `sl-404.jpg` placeholder. |
| [BUG-02](./04-Reported-Issues.md#bug-02) | High | Catalog / Logic | Product sort dropdown does not reorder the products. |
| [BUG-03](./04-Reported-Issues.md#bug-03) | High | Cart | "Remove" button on inventory does not remove the item from the cart. |
| [BUG-04](./04-Reported-Issues.md#bug-04) | Critical | Checkout | "Last Name" field writes its input into the "First Name" field; checkout data is corrupted. |
| [OBS-01](./04-Reported-Issues.md#obs-01) | Low | Technical | Repeated 401 errors from third-party telemetry (`events.backtrace.io`) on every page. |
| [OBS-02](./04-Reported-Issues.md#obs-02) | Low | Accessibility | Login inputs lack `autocomplete` attributes (browser console warning). |

### 5.4 Metrics

| Metric | Value |
|--------|-------|
| Test scenarios designed | 14 |
| Scenarios executed | 14 |
| Passed | 9 |
| Failed (defects) | 4 |
| Observations (non-blocking) | 2 |
| Severity breakdown | 1 Critical · 3 High · 2 Low |

---

## 6. Risk assessment & conclusion

The **baseline experience (`standard_user`) is solid**: the critical checkout flow works and the money math is correct, which is the most important guarantee for an e-commerce product.

However, the `problem_user` profile reveals a **cluster of high-impact defects concentrated exactly in the conversion path** — most notably **BUG-04**, where the checkout form silently corrupts the customer's name. In a real product this is a release blocker: it produces wrong shipping data without any error shown to the user.

**Recommendation:** Treat BUG-04 as a release blocker, BUG-01/02/03 as high-priority fixes for the catalog/cart, and address the console/telemetry and accessibility observations as part of technical hygiene. Re-test the full checkout flow across **all** user profiles before any release, since defects here directly affect revenue and trust.

---

## 7. Deliverables index

| Document | Description |
|----------|-------------|
| `01-Test-Report.md` | This report. |
| [`02-Feature-Inventory.md`](./02-Feature-Inventory.md) | Inventory of features/functionalities. |
| [`03-Test-Scenarios.md`](./03-Test-Scenarios.md) | Key test scenarios executed. |
| [`04-Reported-Issues.md`](./04-Reported-Issues.md) | Detailed bug reports with evidence. |
| `evidence/` | Screenshots and supporting artifacts. |
