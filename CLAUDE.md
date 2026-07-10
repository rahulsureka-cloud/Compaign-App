# CLAUDE.md — Marketing Campaign Management Tool

> This file is the **primary instructor** for Claude Code when working in this
> repository. Read it in full before making any change. It describes what the
> project is, how it is structured, the conventions to follow, and — most
> importantly — **how to add or modify functionality safely** so the app keeps
> working end-to-end.

---

## 1. Project overview

**Marketing Campaign Management Tool** is an Admin-tool feature for users who
hold the **"Marketing"** entitlement.

**Login & roles.** The app opens on a **login page** (split layout: a left
summary panel describing the app + a right "Welcome back" sign-in card with
click-to-fill demo accounts). Until a user signs in, the whole app is gated, and
on successful sign-in the user is redirected to `/dashboard` (so every session
starts on the Dashboard, regardless of the prior route). There are exactly
**two roles** (frontend-only demo users — this is a POC; see
`src/services/auth.js`):

- **Administrator** (`admin` / `admin123`) — full access; **can approve/reject**.
- **Campaign Creator** (`creator` / `creator123`) — sees all screens and can
  create/edit/clone campaigns, but **cannot approve/reject** (the *Awaiting your
  approval* queue is hidden). Enforced by **GR-006**.

Every authenticated screen shows a global **"fiserv. Admin Tool"** brand-bar
header (`src/components/Layout/BrandBar.js`) with the logged-in user's role and
name and a **Sign out** control; below it the Topbar shows the breadcrumb and
the **🏬 Marketing** title.

Once signed in, the tool lets the user:

- **Create campaigns via a 4-step wizard** (Setup → Segment → Location →
  Review), and read/update/clone them. (Delete exists on the API; the UI uses
  edit/clone.)
- Run an **approval workflow**: submit a campaign for approval, then
  **Approve** (→ Active) or **Reject** (→ Draft) from the Campaigns screen's
  "Awaiting your approval" queue, which also has status tabs.
- View a **Campaign & Promotion Dashboard** showing how campaigns are
  performing as of today, including:
  - **Total Targeted Population**
  - A breakdown of numbers **per decision**: *Accepted/Fulfilled*, *Declined*,
    and *Clicked but Unfinished*.
- Manage **User Segments** under the Marketing sub-menu: build a segment with a
  name, optional description, an optional base segment, and one or more
  **segment criteria rules** (e.g. `Age > 25 AND State is CA`) joined by
  AND/OR match logic. A segment can also be created **inline from the campaign
  wizard's Segment step** via a **"Create new segment" modal** (no need to leave
  the wizard); on save the new segment is auto-selected into the campaign and its
  reach flows into the audience summary.

The end result is a working app the user can view at **http://localhost:3000**.

---

## 2. Technology stack

| Layer      | Technology            | Location            |
| ---------- | --------------------- | ------------------- |
| Front end  | React.js              | `src/components/`   |
| Back end   | .NET Core Web API     | `src/api/`          |
| Dummy data | JSON seed files       | `src/data/`         |
| Styling    | Plain CSS             | `src/styles/`       |
| FE tests   | Jest + Testing Library| `src/components/__tests__/` |
| BE tests   | xUnit                 | `src/api.Tests/`    |

- Frontend dev server runs on **port 3000**.
- Backend API runs on **port 5000** (HTTP). The frontend proxies API calls to it.

---

## 3. Repository layout

```
Compaign App/
├── CLAUDE.md                     # <- you are here (the instructor)
├── README.md                     # quick start
├── .claude/
│   └── settings.local.json       # local settings (agent teams enabled)
├── docs/
│   ├── Project Structure.md            # non-technical guide
│   ├── Project Structure-Technical.md  # technical guide
│   └── agent-teams-reference.md        # master reference guide for agent teams
├── Guardrails/
│   └── Guardrails.md             # living register of all guardrails (GR-###)
├── DummyData/
│   └── dummy-users.csv           # sample upload for the Segment step
├── IntegrateWithDevin/           # Devin integration guides
├── package.json                  # React app manifest (scripts, deps)
├── public/
│   └── index.html
└── src/
    ├── index.js                  # React entry point (wraps App in AuthProvider)
    ├── App.js                    # Login gate + layout + routing
    ├── setupProxy.js             # Proxies /api -> backend :5000
    ├── components/               # React UI components
    │   ├── Login/                # Login page (split brand + sign-in)
    │   ├── Dashboard/
    │   ├── Campaigns/            # CampaignList, CampaignWizard, wizard/ steps
    │   ├── UserSegment/          # UserSegmentList, AddUserSegment, SegmentDefinitionForm.js (shared controlled form), CreateSegmentModal.js (in-wizard create), segmentOptions.js (shared option lists + describeRules)
    │   ├── Layout/               # Sidebar, Topbar, BrandBar (fiserv Admin Tool header)
    │   ├── common/              # ConfirmDialog, FileUpload, parseUpload (shared, reused by wizard + segments)
    │   └── __tests__/            # Jest test files
    ├── services/                 # API client helpers (api.js) + auth.js (roles)
    ├── data/                     # Dummy/seed data (JSON)
    ├── styles/                   # All .css files
    ├── api/                      # .NET Core Web API
    │   ├── MarketingApi.csproj
    │   ├── Program.cs
    │   ├── Controllers/
    │   ├── Models/
    │   ├── Services/
    │   ├── Validation/          # CampaignValidator (guardrails GR-001/GR-002)
    │   └── Data/                 # Seed data used by the API
    └── api.Tests/                # xUnit backend tests
```

If you add a new area, extend this tree and keep folders grouped by feature.

---

## 4. How to run the app

Backend (from `src/api/`):

```powershell
dotnet run
```

Frontend (from the project root):

```powershell
npm install   # first time only
npm start     # serves http://localhost:3000
```

Run both. The frontend calls the backend through the `/api` proxy defined in
`src/setupProxy.js`.

---

## 5. How to run tests

- Frontend: `npm test` (Jest, watch mode) or `npm test -- --watchAll=false`.
- Backend: `dotnet test` from `src/api.Tests/`.

**Always run the relevant tests after a change and report the result honestly.**
If a test fails, show the output; do not claim success.

---

## 6. Data model (contract between FE and BE)

Keep these shapes in sync across `src/data/`, `src/api/Models/`, and the React
components. If you change a field, change it in **all** three places plus tests.

**Campaign**

The create-campaign flow is a 4-step wizard (Setup → Segment → Location →
Review). The Campaign shape below spans all steps plus the dashboard metrics and
the approval workflow. (Note: the `assets` field remains in the model/seed data
but is no longer collected in the wizard UI — the Content step was removed.)

```jsonc
{
  "id": "string (guid)",
  // --- Step 1: Setup ---
  "name": "string",
  "description": "string",
  "keywords": "string (comma-separated, optional)",
  "productCategory": "string (optional) e.g. Savings | Checking | Credit Card | Auto Loan | Mortgage",
  "priority": "High | Medium | Low (optional)",
  "startDate": "ISO date",
  "endDate": "ISO date",
  "channels": ["In-app", "Email", "SMS", "Social media", "Ads"], // multi-select
  // --- Step 2: Content (marketing assets) ---
  "assets": [
    {
      "type": "Image | Text | HTML",
      "fileName": "string | null",   // Image/HTML upload name
      "tagOption": "string | null",  // Image tag option
      "altText": "string | null",    // Image alt text
      "ctaLink": "string | null",    // optional CTA link
      "text": "string | null",       // Text asset body
      "html": "string | null"        // HTML asset body
    }
  ],
  // --- Step 3: Segment ---
  "segmentIds": ["guid"],            // selected existing user segments
  "manualUploadName": "string | null", // uploaded CSV/XLS/XLSX file name
  "estimatedReach": 25329,           // Audience summary estimate
  // --- Step 4: Location ---
  "webLocations": ["Accounts-top banner", "Accounts-bottom banner", ...],
  "mobileLocations": ["Accounts-top banner", ...],
  // --- Status + dashboard metrics ---
  "status": "Draft | In-progress | Under approval | Active | Completed",
  "targetedPopulation": 12500,       // Total Targeted Population
  "accepted": 4200,                  // accepted / fulfilled
  "declined": 3100,                  // declined
  "clickedUnfinished": 1800          // clicked but did not finish
}
```

**Approval workflow / statuses**

- `Draft` — saved but not submitted. `In-progress` — being built / journey defined.
- `Under approval` — submitted via **Send for approval**; appears in the
  Campaigns screen's **"Awaiting your approval"** queue.
- Approver actions: **Approve** → status becomes `Active`; **Reject** → back to
  `Draft`.
- **Clone** copies an existing campaign into a new `Draft`.
- Endpoints: `GET /api/campaigns?status=Active`,
  `POST /api/campaigns/{id}/approve`, `POST /api/campaigns/{id}/reject`,
  `POST /api/campaigns/{id}/clone`.

**UserSegment**

```jsonc
{
  "id": "string (guid)",
  "name": "string",
  "description": "string (optional)",
  "baseSegmentId": "string | null",  // 'Select existing segment'
  "matchLogic": "AND | OR",          // how rules combine
  "rules": [
    { "criteria": "Age | State | ...", "operator": "Greater than | is | ...", "value": "string|number" }
  ],
  "estimatedReach": 17754            // Audience summary estimate
}
```

*Estimated reach* is a rules-based heuristic: `100000 × factor^(#rules)` with
factor `0.45` for AND and `0.70` for OR match logic. It is computed
authoritatively by the backend (`SegmentService.EstimateReach`) and mirrored on
the frontend (`src/components/UserSegment/segmentOptions.js` →
`estimateSegmentReach`) so the builder's live preview matches the stored value.
A campaign's audience reach combines its chosen segments' reach plus any manual
upload users via a shared `0.9` dedup factor (`combineAudienceReach`).

---

## 7. Conventions

- **React**: functional components + hooks only. One component per folder with
  its own file. Data access goes through `src/services/`, never inline `fetch`
  scattered in components.
- **CSS**: no inline styles and no CSS-in-JS. Every component imports a class-based
  stylesheet from `src/styles/`. Use the existing color tokens (green primary
  `#2e7d32`, matching the reference UI).
- **.NET**: controllers stay thin; business logic lives in `Services/`. Use
  dependency injection. Return proper HTTP status codes (200/201/204/404/400).
- **API routes**: REST under `/api`, e.g. `GET /api/campaigns`,
  `POST /api/campaigns`, `PUT /api/campaigns/{id}`, `DELETE /api/campaigns/{id}`,
  and the same pattern for `/api/segments`. Dashboard metrics at
  `GET /api/campaigns/dashboard`.
- **IDs**: GUID strings. New records get a server-generated id.
- Match the surrounding code's naming and comment density. Keep changes minimal
  and focused.

---

## 8. HOW TO ADD OR MODIFY FUNCTIONALITY  ← read this before every change

This project is meant to evolve. When the user asks to **add** or **change**
functionality, follow this checklist so nothing breaks:

1. **Locate the feature** using the repo layout in §3. Features are grouped by
   folder (`Dashboard`, `Campaigns`, `UserSegment`).
2. **Trace the full stack** for the change:
   `React component → src/services/ client → .NET controller → service → data`.
   A field or feature almost always touches every layer.
3. **Update the data contract** (§6) first if the shape changes, then propagate:
   - `src/data/*.json` (dummy data)
   - `src/api/Models/*.cs`
   - `src/api/Data/*` (API seed)
   - `src/services/*` and the React components
4. **Add/adjust tests** in `src/components/__tests__/` and `src/api.Tests/`.
5. **Run tests** (§5) and the app (§4); verify the change actually works.
6. **Update this CLAUDE.md** when you add a new feature area, route, or data
   field, so the instructor stays accurate.

### Guardrails

Validation, safe-action, and state-transition controls are tracked in
**`Guardrails/Guardrails.md`** — the living register for the whole project.
When you add or change a guardrail, implement it, cite its `GR-###` id in code
comments, and update that document (register row + detail entry + change log).

### Common change recipes

- **Add a new campaign field**: update the Campaign contract (§6) → model →
  seed data → API DTO → the Campaigns form/list components → tests.
- **Add a new dashboard metric**: extend the dashboard endpoint/service and the
  `Dashboard` component + its CSS card.
- **Add a new segment criteria type or operator**: extend the criteria/operator
  option lists in the `UserSegment` component and validate it in the API.
- **Add a new page/route**: create a folder under `src/components/`, add a route
  in `App.js`, a nav entry in `Layout/`, a stylesheet in `src/styles/`, and tests.

---

## 9. Using agent teams for larger changes (optional)

Agent teams are **enabled** in this project via `.claude/settings.local.json`.
For cross-layer work (frontend + backend + tests at once), you may spawn a small
team — e.g. one teammate per layer. **Read `docs/agent-teams-reference.md`
first**; it is the master guide for building effective teams here. Keep teams
small (3–5), give each teammate a distinct file boundary to avoid conflicts, and
have the lead synthesize.

---

## 10. Definition of done

A change is done only when:

- [ ] Data contract is consistent across data / API / UI.
- [ ] Frontend and backend build with no errors.
- [ ] Relevant tests are added/updated and **pass** (output shown).
- [ ] App runs and the feature is visible at http://localhost:3000.
- [ ] This CLAUDE.md is updated if the change altered structure, routes, or data.
