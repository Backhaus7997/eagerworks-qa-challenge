# Part 2 — API Testing (Answers)

**API under test:** Official Joke API — `https://official-joke-api.appspot.com`
**Tool:** Postman (collection) + Newman (CLI runner, for reproducible execution)
**Date:** 2026-06-18

---

## 1. What I did

I explored the Joke API and automated **3 core tests + 1 bonus negative test** over endpoints of my choice, and then **designed a new `POST /jokes` endpoint** to create jokes (which the real API does not expose).

### Endpoints chosen and why

| # | Endpoint | Why I chose it |
|---|----------|----------------|
| 1 | `GET /random_joke` | Core endpoint returning a **single object**. Best place to validate the **response schema / data contract** and response time. |
| 2 | `GET /jokes/ten` | Returns an **array of 10**. Lets me validate **collection contracts**: exact count, per-item schema, and **id uniqueness**. |
| 3 | `GET /jokes/:id` | Validates **data integrity**: the joke returned must actually match the requested id. |
| Bonus | `GET /jokes/999999` | **Negative test**: a non-existent id must return **404** with a clear error body. |

All tests are in [`Jokes-API.postman_collection.json`](./Jokes-API.postman_collection.json) and were executed with Newman — **16/16 assertions passed** (see [`evidence/newman-run.txt`](./evidence/newman-run.txt)).

### Observations found while exploring (QA mindset)
- `GET /jokes/<invalidType>/random` returns **`200 OK` with an empty array `[]`** instead of a `404`/`400`. Arguably inconsistent with `GET /jokes/:id`, which returns `404` for invalid input. Worth flagging to the API owner.
- Responses include `Access-Control-Allow-Origin: *` and `Content-Type: application/json; charset=utf-8`.

---

## 2. New endpoint: *Create a Joke*

> The current API has **no create endpoint** — `POST /jokes` returns `404 "Cannot POST /jokes"`. Below is how I would design and test it.

### 2.1 How would this request look like?

**Request**

```http
POST /jokes HTTP/1.1
Host: official-joke-api.appspot.com
Content-Type: application/json
Authorization: Bearer <token>        # if the API is protected
Accept: application/json
```

**Request body**

```json
{
  "type": "programming",
  "setup": "How many programmers does it take to change a light bulb?",
  "punchline": "None, that's a hardware problem."
}
```

**Field contract**

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `type` | string | yes | One of the allowed categories: `general`, `knock-knock`, `programming`, `dad`. |
| `setup` | string | yes | Non-empty, trimmed; reasonable max length (e.g. ≤ 250 chars). |
| `punchline` | string | yes | Non-empty, trimmed; reasonable max length. |
| `id` | number | **no** | **Server-generated**, never accepted from the client. |

**Expected success response — `201 Created`**

```http
HTTP/1.1 201 Created
Location: /jokes/413
Content-Type: application/json
```
```json
{
  "id": 413,
  "type": "programming",
  "setup": "How many programmers does it take to change a light bulb?",
  "punchline": "None, that's a hardware problem."
}
```

**Design decisions**
- **`201 Created`** (not `200`) is the correct status for resource creation, with a **`Location`** header pointing to the new resource.
- The server **assigns the `id`** — the client must not be able to set or overwrite it.
- The created joke should then be retrievable via `GET /jokes/{id}`.

### 2.2 What would I test on this endpoint, and how?

I would test it across **happy path, validation, contract, security, and idempotency/persistence**. "How" = automated in Postman/Newman, asserting status code, headers, body schema, and side effects.

#### A. Happy path (positive)
| Test | Expected |
|------|----------|
| Create a valid joke | `201`, body echoes the sent fields, `id` is a number, `Location` header present. |
| Persistence / round-trip | `GET /jokes/{id}` of the new joke returns it with the same data (the **most important** functional check — proves it was really created). |

#### B. Input validation (negative) — *the bulk of the value*
| Test | Expected |
|------|----------|
| Missing `setup` | `400 Bad Request`, descriptive error. |
| Missing `punchline` | `400`. |
| Missing `type` | `400`. |
| Empty strings (`""`) for setup/punchline | `400` (must reject blanks, not just missing keys). |
| Invalid `type` (e.g. `"random"`) | `400` with allowed-values message. |
| Wrong data type (`setup: 123`) | `400`. |
| Extra/unknown fields | Ignored **or** `400` — assert the documented behavior. |
| Client tries to set `id` | `id` ignored; server generates its own. |
| Malformed JSON | `400`. |
| Wrong/empty `Content-Type` | `415 Unsupported Media Type` or `400`. |
| Oversized payload (very long strings) | `400`/`413`, no server crash. |
| Injection-style payloads (`<script>`, SQL) | Stored/escaped safely, no `500`. |

#### C. Contract / schema
- Response matches the joke schema (`id:number`, `type:string`, `setup:string`, `punchline:string`).
- `Content-Type: application/json`.
- `Location` header points to a valid, fetchable resource.

#### D. Security & auth (if protected)
| Test | Expected |
|------|----------|
| No token | `401 Unauthorized`. |
| Invalid/expired token | `401`. |
| Valid token, insufficient role | `403 Forbidden`. |

#### E. Reliability / non-functional
- **Response time** within an agreed SLA (e.g. < 1s).
- **Duplicate creation**: sending the same joke twice — define whether it's allowed (two ids) or de-duplicated (`409 Conflict`); assert the agreed rule.
- **Idempotency**: `POST` is not idempotent by design — verify each call creates exactly one resource (no double-insert).

#### How I would automate it
- A **Postman collection** with one folder per category (happy / validation / security).
- **Pre-request + test scripts**: capture the created `id` into a collection variable, then a chained `GET /jokes/{{createdId}}` to assert persistence, and finally a `DELETE` (or cleanup) so the suite is **repeatable** and leaves no test data behind.
- Run in CI with **Newman** (as done here), failing the build on any assertion failure.
- For development before the endpoint exists, point the collection at a **Postman Mock Server** returning the `201` contract, so the tests are written and reviewed against the agreed schema (shift-left).

---

## 3. Deliverables (Part 2)

| File | Description |
|------|-------------|
| [`Jokes-API.postman_collection.json`](./Jokes-API.postman_collection.json) | Importable Postman collection: 3 automated tests + bonus negative + proposed POST create joke. |
| `02-API-Testing-Answers.md` | This document. |
| [`evidence/newman-run.txt`](./evidence/newman-run.txt) | Newman execution log — 16/16 assertions passed. |

### How to run
```bash
# With Newman (CLI)
npx newman run Jokes-API.postman_collection.json \
  --folder "1. GET random joke (schema & contract)" \
  --folder "2. GET ten jokes (array contract & uniqueness)" \
  --folder "3. GET joke by id (data integrity)" \
  --folder "Bonus - Negative: GET non-existent joke (404)"

# Or: import the .json into Postman and use the Collection Runner.
```
> The `PROPOSED - POST create joke` request is intentionally excluded from the green run because the endpoint does not exist on the real API (it returns 404). It documents the intended contract and its tests; point `baseUrl` at a mock server to see it pass.
