# Reported Issues — Swag Labs (SauceDemo)

Defects and observations found during Part 1. Reports follow a standard bug-report template (ID, severity, priority, environment, steps, expected vs actual, evidence, notes).

> **Severity scale:** Critical (blocks core business / data corruption) · High (major feature broken) · Medium (feature impaired, workaround exists) · Low (cosmetic / non-blocking).
> All defects reproduce on Chromium, build `main.bcf4bc5f.js`, 2026-06-18.

---

<a id="bug-01"></a>
## BUG-01 — All product images render the same `sl-404` placeholder

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Priority** | P1 |
| **Area** | Catalog / Inventory (Visual) |
| **Affected user** | `problem_user` |
| **Status** | Open |

**Description**
On the inventory page, every product displays the **same** image, which is the `sl-404.jpg` error/placeholder asset, instead of each product's real photo.

**Steps to reproduce**
1. Log in as `problem_user` / `secret_sauce`.
2. Observe the 6 product cards on `/inventory.html`.

**Expected result**
Each of the 6 products shows its own distinct, correct image.

**Actual result**
All 6 `<img>` elements point to `/static/media/sl-404.168b1cce10384b857a6f.jpg` (1 distinct image for 6 products).

**Evidence**
- `evidence/problem_user-inventory-same-images.png`
- Extracted `src` of all 6 images = identical `sl-404…jpg`.

**Impact / notes**
Breaks the visual catalog; customers cannot distinguish products, directly hurting conversion. `standard_user` shows 6 correct distinct images, confirming this is a data/binding defect, not a missing asset.

---

<a id="bug-02"></a>
## BUG-02 — Product sort dropdown does not reorder products

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Priority** | P1 |
| **Area** | Catalog / Inventory (Logic) |
| **Affected user** | `problem_user` |
| **Status** | Open |

**Description**
Selecting any option in the "Sort" dropdown does not change the order of the products.

**Steps to reproduce**
1. Log in as `problem_user`.
2. On `/inventory.html`, select **Name (Z to A)**.
3. Then select **Price (low to high)**.

**Expected result**
- Z→A: products in reverse alphabetical order.
- Price low→high: products ordered by ascending price.

**Actual result**
Order is unchanged in both cases. After "Price (low to high)" the prices are still `$29.99, $9.99, $15.99, $49.99, $7.99, $15.99` (not ascending).

**Evidence**
DOM names/prices before and after sorting are identical (captured via page evaluation).

**Impact / notes**
Sorting is a primary tool for product discovery; a broken sort frustrates users and hides cheaper/relevant items. Baseline `standard_user` sorts correctly.

---

<a id="bug-03"></a>
## BUG-03 — "Remove" button on inventory does not remove the item from the cart

| Field | Value |
|-------|-------|
| **Severity** | High |
| **Priority** | P1 |
| **Area** | Shopping Cart |
| **Affected user** | `problem_user` |
| **Status** | Open |

**Description**
After adding a product, the button correctly toggles to "Remove", but clicking "Remove" does **not** remove the item — the cart badge does not decrement.

**Steps to reproduce**
1. Log in as `problem_user`.
2. On a product, click **Add to cart** → badge shows `1`, button shows "Remove".
3. Click **Remove**.

**Expected result**
Item removed from cart; badge decrements to `0` (badge disappears); button returns to "Add to cart".

**Actual result**
Badge stays at `1`; the item remains in the cart.

**Evidence**
`badgeAfterRemove = "1"` captured after clicking Remove.

**Impact / notes**
Users cannot correct their cart from the catalog, leading to unintended purchases. Combine with BUG-04 and the entire `problem_user` purchase path is unreliable.

---

<a id="bug-04"></a>
## BUG-04 — Checkout "Last Name" field writes its input into "First Name"

| Field | Value |
|-------|-------|
| **Severity** | Critical |
| **Priority** | P1 |
| **Area** | Checkout — Step One (Your Information) |
| **Affected user** | `problem_user` |
| **Status** | Open |

**Description**
On the checkout information form, text typed into the **Last Name** field is captured by the **First Name** field instead. The Last Name field ends up empty, silently corrupting the customer's data — with no error shown.

**Steps to reproduce**
1. Log in as `problem_user`; add any product to the cart.
2. Cart → **Checkout**.
3. Type into the fields (real keyboard input):
   - First Name → `John`
   - Last Name → `Doe`
   - Postal Code → `12345`
4. Inspect the field values.

**Expected result**
First Name = `John`, Last Name = `Doe`, Postal Code = `12345`.

**Actual result**
First Name = `Doe`, Last Name = `` (empty), Postal Code = `12345`.
The Last Name input is redirected into First Name; the customer's real first name is overwritten.

**Evidence**
Field values read directly from the DOM after typing: `{ fn: "Doe", ln: "", zip: "12345" }`.

**Impact / notes**
**Release blocker.** This corrupts shipping/billing data without any visible error. Because the form still validates "First Name is required" as satisfied, a user can complete the order with wrong data. Highest-priority defect in this report. Baseline `standard_user` stores all three fields correctly.

---

<a id="obs-01"></a>
## OBS-01 — Repeated 401 errors from third-party telemetry on every page

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Priority** | P3 |
| **Area** | Technical / Observability |
| **Affected user** | All |
| **Status** | Open (observation) |

**Description**
The browser console logs repeated `401 Unauthorized` network errors from a third-party analytics endpoint on every page load.

**Detail**
```
Failed to load resource: 401 (Unauthorized)
  https://events.backtrace.io/api/unique-events/submit?universe=UNIVERSE&token=TOKEN
  https://events.backtrace.io/api/summed-events/submit?universe=UNIVERSE&token=TOKEN
```
The placeholder `universe=UNIVERSE&token=TOKEN` suggests unconfigured telemetry credentials.

**Impact / notes**
Not user-facing, but it pollutes the console (hiding real errors during debugging), wastes network calls, and indicates a misconfigured integration. Recommend disabling telemetry in non-prod or providing valid credentials.

---

<a id="obs-02"></a>
## OBS-02 — Login inputs lack `autocomplete` attributes

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **Priority** | P3 |
| **Area** | Accessibility / Usability |
| **Affected user** | All |
| **Status** | Open (observation) |

**Description**
The browser warns that the login inputs are missing `autocomplete` attributes:
```
[DOM] Input elements should have autocomplete attributes (suggested: "current-password")
```

**Impact / notes**
Minor: degrades password-manager and browser autofill support and is an accessibility/usability best-practice gap. Recommend adding `autocomplete="username"` and `autocomplete="current-password"`.

---

## Summary

| ID | Severity | Area | Status |
|----|----------|------|--------|
| BUG-01 | High | Catalog/Visual | Open |
| BUG-02 | High | Catalog/Logic | Open |
| BUG-03 | High | Cart | Open |
| BUG-04 | **Critical** | Checkout | Open |
| OBS-01 | Low | Technical | Open |
| OBS-02 | Low | Accessibility | Open |
