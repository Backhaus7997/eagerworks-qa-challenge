# Test Scenarios — Swag Labs (SauceDemo)

Key test scenarios designed and executed for Part 1. Scenarios are prioritized by business risk; the goal (per the challenge) is **varied, meaningful coverage**, not exhaustiveness.

> **Status legend:** ✅ Pass · ❌ Fail (see linked bug) · ⚠️ Observation
> **Oracle:** `standard_user` defines correct behavior; defects are surfaced mainly via `problem_user`.

---

## Authentication

### TS-01 — Login with valid credentials ✅
**Priority:** P1
**Preconditions:** On `/`.
**Steps:**
1. Enter `standard_user` / `secret_sauce`.
2. Click **Login**.

**Expected:** Redirect to `/inventory.html`; 6 products visible.
**Result:** ✅ Pass.

### TS-02 — Login blocked for locked-out user ✅
**Priority:** P1
**Steps:** Login with `locked_out_user` / `secret_sauce`.
**Expected:** Stays on login; error *"Sorry, this user has been locked out."*
**Result:** ✅ Pass.

### TS-03 — Required-field validation on login ✅
**Priority:** P2
**Steps:** Click **Login** with empty username/password.
**Expected:** Error *"Username is required"*, then *"Password is required"*.
**Result:** ✅ Pass.

---

## Catalog / Inventory

### TS-04 — All products display their own image ❌ → [BUG-01](./04-Reported-Issues.md#bug-01)
**Priority:** P1
**Data:** `problem_user`.
**Steps:** Log in; inspect each product image `src`.
**Expected:** 6 distinct, correct product images.
**Actual:** All 6 images are the same `sl-404.jpg` placeholder (1 distinct image).
**Result:** ❌ Fail.

### TS-05 — Sort products by Name (Z→A) and Price ❌ → [BUG-02](./04-Reported-Issues.md#bug-02)
**Priority:** P1
**Data:** `problem_user`.
**Steps:** Select "Name (Z to A)", then "Price (low to high)".
**Expected:** List reorders accordingly.
**Actual:** Order does not change; prices remain unsorted (`$29.99, $9.99, $15.99, …`).
**Result:** ❌ Fail. *(Baseline `standard_user`: ✅ sorting works.)*

### TS-06 — Sorting works on baseline ✅
**Priority:** P2
**Data:** `standard_user`.
**Steps:** Apply each of the 4 sort options.
**Expected:** Correct reordering each time.
**Result:** ✅ Pass.

### TS-07 — Add product to cart updates badge ✅
**Priority:** P1
**Steps:** Click "Add to cart" on a product.
**Expected:** Button → "Remove"; cart badge increments.
**Result:** ✅ Pass (badge increments; button toggles).

### TS-08 — Remove product from inventory updates cart ❌ → [BUG-03](./04-Reported-Issues.md#bug-03)
**Priority:** P1
**Data:** `problem_user`.
**Steps:** Add Backpack (badge=1); click "Remove".
**Expected:** Item removed; badge decrements/clears.
**Actual:** Badge stays at `1`; item not removed.
**Result:** ❌ Fail.

---

## Cart

### TS-09 — Cart lists the correct items and prices ✅
**Priority:** P1
**Data:** `standard_user`; cart = Backpack, Bike Light, Onesie.
**Expected:** 3 rows with correct names/prices ($29.99, $9.99, $7.99).
**Result:** ✅ Pass.

### TS-10 — Cart persists across re-login ⚠️
**Priority:** P2
**Steps:** Add items, log out, log back in, open cart.
**Expected (debatable):** Cart restored from `localStorage`.
**Result:** ⚠️ Observation — cart contents persist after logout/login. Acceptable as a demo behavior, but worth confirming against requirements (privacy/state-leak consideration on shared machines).

---

## Checkout

### TS-11 — Required-field validation in checkout ✅
**Priority:** P1
**Steps:** On checkout step one, click **Continue** with empty fields.
**Expected:** Error *"Error: First Name is required"* (then Last Name, Postal Code).
**Result:** ✅ Pass.

### TS-12 — Last Name field accepts and stores its own value ❌ → [BUG-04](./04-Reported-Issues.md#bug-04)
**Priority:** P1 / Critical
**Data:** `problem_user`.
**Steps:** Type First="John", Last="Doe", Zip="12345" (real keyboard events).
**Expected:** Fields hold John / Doe / 12345 respectively.
**Actual:** First Name = "Doe", Last Name = "" — input typed into Last Name is redirected into First Name.
**Result:** ❌ Fail.

### TS-13 — Checkout totals are calculated correctly ✅
**Priority:** P1
**Data:** `standard_user`; cart subtotal $47.97.
**Expected:** Tax ≈ 8% → $3.84; Total = $51.81.
**Actual:** Item total `$47.97`, Tax `$3.84`, Total `$51.81`.
**Result:** ✅ Pass (math verified: 47.97 × 0.08 = 3.8376 → 3.84; 47.97 + 3.84 = 51.81).

### TS-14 — Complete a purchase (happy path) ✅
**Priority:** P1
**Data:** `standard_user`.
**Steps:** Cart → Checkout → fill info → Continue → Finish.
**Expected:** "Thank you for your order!"; cart emptied.
**Result:** ✅ Pass.

---

## Technical / Non-functional

### TS-15 — Browser console is free of errors ⚠️ → [OBS-01](./04-Reported-Issues.md#obs-01)
**Priority:** P3
**Steps:** Monitor DevTools console across pages.
**Expected:** No unexpected errors.
**Actual:** Repeated `401 Unauthorized` from `events.backtrace.io` (telemetry) on every page; `autocomplete` attribute warning on login ([OBS-02](./04-Reported-Issues.md#obs-02)).
**Result:** ⚠️ Observation.
