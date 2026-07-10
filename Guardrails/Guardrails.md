# Guardrails Register — Marketing Campaign Management Tool

> **This is the living, canonical document for ALL guardrails in this project.**
> Whenever a new guardrail is added, record it here using the
> [template](#template-for-new-guardrails) at the bottom, give it the next
> `GR-###` id, add a row to the register, and update the change log.
> A guardrail is any control that prevents invalid data, unsafe actions, or
> incorrect state transitions — at the API, the service layer, or the UI.

---

## How to use this document

- **Before building a guardrail:** check the register so you don't duplicate one.
- **When implementing:** cite the guardrail id in code comments (e.g. `// GR-003`)
  so code and docs stay traceable.
- **After implementing:** add/update the detailed entry (screen, control,
  validation, files, tests), flip its status, and add a change-log line.
- Keep it consistent with the data contract in [CLAUDE.md](../CLAUDE.md) §6.

**Layers:** `API` (controller/validation) · `Service` (business rules) ·
`UI` (React).
**Status:** ✅ Implemented · ⏳ Planned · ⛔ Deprecated.

---

## Register

| ID | Guardrail | Layer | Screen / Endpoint | Status |
| --- | --- | --- | --- | --- |
| GR-001 | Date sanity (parseable ISO dates, end ≥ start) | API | Create/Edit campaign → `POST`/`PUT /api/campaigns` | ✅ |
| GR-002 | Numeric ranges (non-negative; decisions ≤ population) | API | Create/Edit campaign → `POST`/`PUT /api/campaigns` | ✅ |
| GR-003 | Approval state machine (only *Under approval* → approve/reject) | Service + API | Campaigns → *Awaiting your approval* → `POST /api/campaigns/{id}/approve`·`/reject` | ✅ |
| GR-004 | Disable Next / Send-for-approval until Setup is valid | UI | Create campaign wizard (Setup & Review steps) | ✅ |
| GR-005 | Prevent double-submit (disable actions while in flight) | UI | Campaigns (Approve/Reject/Clone + confirm) & wizard submit | ✅ |
| GR-006 | Role-based authorization (only Administrators may approve/reject or view the audit trail) | UI | Login + admin-only **Administration** group: **Approvals** (`/approvals`) & **Audit Trail** (`/audit-trail`) | ✅ |

---

## GR-001 — Date sanity

- **Screen / endpoint:** Create campaign wizard (Setup step) and Edit → the
  request hits `POST /api/campaigns` / `PUT /api/campaigns/{id}`.
- **Control:** `CampaignValidator.Validate()` invoked by the controller before
  the campaign is created/updated.
- **Validation performed:**
  - If `startDate` is provided it must parse as a date (invariant culture).
  - If `endDate` is provided it must parse as a date.
  - If both are provided, `endDate` must be **on or after** `startDate` (equal
    dates are allowed).
- **Behaviour / response:** invalid → **HTTP 400** with
  `{ "message": "End date must be on or after the start date." }` (or the
  relevant message). The UI shows it in the error banner.
- **Implementation:** [src/api/Validation/CampaignValidator.cs](../src/api/Validation/CampaignValidator.cs),
  wired in [CampaignsController](../src/api/Controllers/CampaignsController.cs) `Create`/`Update`.
- **Tests:** [CampaignValidatorTests](../src/api.Tests/CampaignValidatorTests.cs) —
  `EndDate_BeforeStartDate_IsRejected`, `Unparseable_Date_IsRejected`,
  `EqualStartAndEndDate_IsAllowed`.
- **Related:** GR-004 blocks the UI from submitting bad dates in the first place.

## GR-002 — Numeric ranges

- **Screen / endpoint:** same as GR-001 (`POST`/`PUT /api/campaigns`).
- **Control:** `CampaignValidator.Validate()`.
- **Validation performed:**
  - `targetedPopulation`, `accepted`, `declined`, `clickedUnfinished` are all
    **≥ 0**.
  - `accepted + declined + clicked ≤ targetedPopulation` (the invariant
    `CampaignService.EnsureMetrics()` relies on).
  - All-zero metrics are allowed (a fresh campaign posts zeros; the service then
    fills non-zero dummy data **after** validation — see the note below).
- **Behaviour / response:** invalid → **HTTP 400** with a descriptive message.
- **Implementation:** [CampaignValidator.cs](../src/api/Validation/CampaignValidator.cs).
- **Tests:** [CampaignValidatorTests](../src/api.Tests/CampaignValidatorTests.cs) —
  `Negative_Metric_IsRejected`, `Decisions_ExceedingPopulation_IsRejected`,
  `AllZeroMetrics_AreAllowed`.
- **Note:** validation runs on the incoming payload; `EnsureMetrics()` then
  fills any zero metrics, preserving the invariant.

## GR-003 — Approval state machine

- **Screen / endpoint:** Campaigns screen → **"Awaiting your approval"** →
  **Approve** / **Reject**, calling `POST /api/campaigns/{id}/approve` and
  `/reject`.
- **Control:** `CampaignService.Transition()` enforces the required source
  status; the controller maps the outcome to an HTTP status.
- **Validation performed / allowed transitions:**

  | From | Action | To | Allowed? |
  | --- | --- | --- | --- |
  | `Under approval` | Approve | `Active` | ✅ |
  | `Under approval` | Reject | `Draft` | ✅ |
  | any other status | Approve/Reject | — | ⛔ (409) |
  | `Draft` / `In-progress` | Send for approval (save) | `Under approval` | ✅ (via wizard) |
  | any | Clone | new `Draft` | ✅ |

- **Behaviour / response:**
  - Campaign missing → **HTTP 404**.
  - Campaign exists but **not** `Under approval` → **HTTP 409 Conflict** with
    `{ "message": "Only campaigns that are 'Under approval' can be approved or rejected. Current status: '...'." }`.
  - Otherwise **HTTP 200** with the updated campaign. The status is **not**
    mutated on a rejected transition.
- **Implementation:** [CampaignService.cs](../src/api/Services/CampaignService.cs)
  (`Transition`, `TransitionResult`, `TransitionOutcome`);
  [CampaignsController.cs](../src/api/Controllers/CampaignsController.cs) (`HandleTransition`).
- **Tests:** [CampaignServiceTests](../src/api.Tests/CampaignServiceTests.cs) —
  `Approve_SetsStatusActive_WhenUnderApproval`,
  `Reject_SetsStatusDraft_WhenUnderApproval`,
  `Approve_IsRejectedForNonUnderApprovalStatus`,
  `Reject_IsRejectedForDraftStatus`, `Approve_ReturnsNotFound_WhenMissing`.

## GR-004 — Disable Next / Send-for-approval until Setup is valid

- **Screen:** Create campaign wizard — **Setup** step (the **Next** button) and
  **Review** step (the **Send for approval** button).
- **Control:** `setupValid` computed in
  [CampaignWizard.js](../src/components/Campaigns/CampaignWizard.js); the buttons
  are `disabled` until it is true, and a red hint explains what's missing.
- **Validation performed (client-side):**
  - Campaign **name** is non-empty.
  - **Start date** and **End date** are both present and **end ≥ start**.
  - At least **one channel** is selected.
- **Behaviour:** **Next** is disabled on Setup and **Send for approval** is
  disabled on Review until all conditions hold; a hint reads *"Enter a campaign
  name, start & end dates (end on or after start), and select at least one
  channel to continue."* Server-side GR-001/GR-002 remain the authoritative
  backstop.
- **Implementation:** [CampaignWizard.js](../src/components/Campaigns/CampaignWizard.js);
  hint style `.wizard-hint` in [styles/wizard.css](../src/styles/wizard.css).
- **Tests:** [CampaignWizard.test.js](../src/components/__tests__/CampaignWizard.test.js) —
  *"Next is disabled until required Setup fields are valid"*, *"Next stays
  disabled when end date is before start date"*, and the full walk-through.

## GR-005 — Prevent double-submit

- **Screen:** Campaigns screen — **Approve**, **Reject**, **Clone**, and the
  confirmation dialog; the wizard's **Send for approval**.
- **Control:**
  - [CampaignList.js](../src/components/Campaigns/CampaignList.js) keeps a `busy`
    flag; `act()` returns early if already busy and toggles `busy` around the
    request (`finally` resets it).
  - Action buttons and the [ConfirmDialog](../src/components/common/ConfirmDialog.js)
    buttons are `disabled` while `busy` (confirm shows "Working…").
  - The wizard disables **Send for approval** while `saving` (shows "Sending…").
- **Behaviour:** a second click during an in-flight request is ignored, so no
  duplicate approve/reject/clone/create is issued.
- **Implementation:** [CampaignList.js](../src/components/Campaigns/CampaignList.js),
  [ConfirmDialog.js](../src/components/common/ConfirmDialog.js),
  [CampaignWizard.js](../src/components/Campaigns/CampaignWizard.js).
- **Tests:** exercised by the CampaignList approve/clone tests
  ([CampaignList.test.js](../src/components/__tests__/CampaignList.test.js)),
  which pass with the busy-guard in place.

## GR-006 — Role-based approval authorization

- **Screen / endpoint:** Login page → the app is gated until a user signs in;
  the dedicated **Approvals** screen (`/approvals`) hosts the **"Awaiting your
  approval"** queue (Approve/Reject). This queue **moved out of the Campaigns
  list** — `CampaignList` no longer shows it.
- **Control:** authentication context in
  [src/services/auth.js](../src/services/auth.js) exposes `isAdmin`;
  [Approvals.js](../src/components/Approvals/Approvals.js) renders the approval
  queue (and its Approve/Reject actions) and **self-guards** by redirecting
  non-admins to `/dashboard`. The **Administration** nav group that links to it
  is also hidden from non-admins in
  [Sidebar.js](../src/components/Layout/Sidebar.js).
- **Validation performed:**
  - There are exactly **two roles**: `admin` (Administrator) and `creator`
    (Campaign Creator).
  - Only `admin` may approve or reject; the approver queue is **hidden** for
    `creator` (who can still view all screens and create campaigns).
- **Behaviour:** a Campaign Creator never sees the Approvals menu entry, and even
  a direct visit to `/approvals` is bounced to `/dashboard`, so the approval
  action cannot be triggered from the UI. GR-003 remains the server-side backstop
  for the transition itself. The **Audit Trail** page (`/audit-trail`) is gated
  the same way — the whole **Administration** nav group and both pages are
  admin-only and self-guard.
- **Implementation:** [auth.js](../src/services/auth.js),
  [Login.js](../src/components/Login/Login.js),
  [BrandBar.js](../src/components/Layout/BrandBar.js) (shows the logged-in role + Sign out),
  [App.js](../src/App.js) (login gate + `/approvals` and `/audit-trail` routes),
  [Sidebar.js](../src/components/Layout/Sidebar.js) (admin-only Administration group),
  [Approvals.js](../src/components/Approvals/Approvals.js) (self-guard + queue),
  [AuditTrail.js](../src/components/AuditTrail/AuditTrail.js) (self-guard + activity log).
- **Tests:** [Login.test.js](../src/components/__tests__/Login.test.js) (renders
  the two roles, invalid-credential handling, demo-fill sign-in, Show/Hide),
  [Approvals.test.js](../src/components/__tests__/Approvals.test.js) —
  *"admin sees the approval queue and can approve after confirming"* and
  *"a Campaign Creator is redirected away — no approval queue (GR-006)"* — and
  [AuditTrail.test.js](../src/components/__tests__/AuditTrail.test.js) —
  *"a Campaign Creator is redirected away (GR-006)"*.
- **Related:** GR-003 (approval state machine — server-side backstop).

---

## Template for new guardrails

```markdown
## GR-00X — <short title>

- **Screen / endpoint:** <where the user hits it / which route>
- **Control:** <what enforces it — validator, service rule, disabled control>
- **Validation performed:** <the exact rules / conditions>
- **Behaviour / response:** <HTTP code + message, or UI behaviour>
- **Implementation:** <links to the files>
- **Tests:** <test names / files>
- **Related:** <other GR ids, if any>
```

Also: add a row to the **Register** table and a line to the **Change log**.

---

## Change log

| Date | Guardrails | Notes |
| --- | --- | --- |
| 2026-07-09 | GR-001 … GR-005 | Initial guardrails: date sanity, numeric ranges, approval state machine, wizard field-validity gating, double-submit prevention. |
| 2026-07-10 | GR-006 | Added login page with two roles (Administrator, Campaign Creator); only Administrators see the approval queue / can approve/reject. |
| 2026-07-10 | GR-006 | Approval queue moved out of the Campaigns list to a dedicated admin-only **Approvals** screen (`/approvals`), which self-guards by redirecting non-admins to `/dashboard`. Guardrail id/intent unchanged. |
| 2026-07-10 | GR-006 | Extended to the new admin-only **Audit Trail** screen (`/audit-trail`); the whole Administration nav group and both pages are admin-only and self-guard. |
