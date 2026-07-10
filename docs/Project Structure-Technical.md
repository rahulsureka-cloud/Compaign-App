# Project Structure — Technical

*Engineering reference for the **Marketing Campaign Management Tool**.*
*Companion to the non-technical [Project Structure.md](Project%20Structure.md).*

---

## 1. Structure of the team involved

This project is designed to be built and maintained by a small, cross-functional
team. Because **agent teams are enabled** in this repo
(`.claude/settings.local.json`), the same roles map cleanly onto either human
contributors or Claude Code teammates (see
[agent-teams-reference.md](agent-teams-reference.md)).

| Role | Responsibility | Owns (files/folders) |
| --- | --- | --- |
| **Team lead / Architect** | Coordinates work, owns the data contract & conventions, reviews and integrates changes | [CLAUDE.md](../CLAUDE.md), overall structure |
| **Backend engineer** | .NET Core Web API — models, controllers, services, seed data | [src/api/](../src/api/), [src/api.Tests/](../src/api.Tests/) |
| **Frontend engineer** | React UI — pages, components, routing, API client | [src/components/](../src/components/), [src/services/](../src/services/) |
| **UI / styling** | Look and feel, layout, responsive CSS | [src/styles/](../src/styles/) |
| **QA / test** | Unit tests on both layers, verifying behavior | [src/components/__tests__/](../src/components/__tests__/), [src/api.Tests/](../src/api.Tests/) |
| **Data** | Keeps dummy/seed data consistent across layers | [src/data/](../src/data/), [src/api/Data/](../src/api/Data/) |

> **Why this split works:** each role owns a distinct set of files, so multiple
> contributors (or agent-team teammates) can work in parallel without conflicts.
> The single point of coordination is the **data contract** in CLAUDE.md §6,
> which every role must keep in sync.

**Suggested agent-team recipe** for a cross-layer feature: spawn 3 teammates —
`backend` (only `src/api/`), `frontend` (only `src/components/` + `src/services/`
+ `src/styles/`), and `data` (only `src/data/`) — then the lead runs the full
test suites and integrates. Details in `agent-teams-reference.md` §9.

---

## 2. Skills / tools used to build the project (with versions)

### Runtimes & SDKs

| Tool | Version | Purpose |
| --- | --- | --- |
| Node.js | **22.19.0** | Runs the React dev server and test runner |
| npm | **10.9.3** | Frontend package manager & scripts |
| .NET SDK | **10.0.301** (also 10.0.109 installed) | Builds and runs the Web API |
| Target framework | **net10.0** | Compilation target for the API & tests |

### Frontend stack

| Package | Version | Purpose |
| --- | --- | --- |
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | React DOM rendering |
| react-router-dom | ^6.26.2 | Client-side routing between screens |
| react-scripts (Create React App) | 5.0.1 | Build/dev-server/test tooling (webpack, Babel, Jest) |
| http-proxy-middleware | ^2.0.6 | Proxies `/api` calls to the backend in dev |
| xlsx (SheetJS) | ^0.18.5 | Parses uploaded CSV/XLS/XLSX lists to count users (Segment step) |
| @testing-library/react | ^16.0.1 | Component testing |
| @testing-library/jest-dom | ^6.4.8 | Extra DOM matchers for tests |
| @testing-library/user-event | ^14.5.2 | Simulating user interactions in tests |
| Jest | (bundled with react-scripts) | Frontend test runner |

### Backend stack

| Package / feature | Version | Purpose |
| --- | --- | --- |
| Microsoft.NET.Sdk.Web | net10.0 | ASP.NET Core Web API |
| xunit | 2.9.2 | Backend unit-test framework |
| xunit.runner.visualstudio | 2.8.2 | Test discovery/execution |
| Microsoft.NET.Test.Sdk | 17.11.1 | Test host |

### Languages

- **C#** (backend, `net10.0`, nullable + implicit usings enabled)
- **JavaScript (ES2020+) / JSX** (frontend)
- **CSS** (plain, class-based, in `src/styles/`)

---

## 3. Project structure (diagram + explanation)

```
Compaign App/
│
├── CLAUDE.md                     # Instructor: rules, data contract, how to extend
├── README.md                     # Quick start
├── package.json                  # React app manifest (scripts + dependencies)
├── .gitignore
│
├── .claude/
│   └── settings.local.json       # Enables experimental agent teams
│
├── docs/
│   ├── Project Structure.md            # Non-technical guide
│   ├── Project Structure-Technical.md  # This document
│   └── agent-teams-reference.md        # Master guide for agent teams
│
├── Guardrails/
│   └── Guardrails.md             # Living register of all guardrails (GR-###)
│
├── DummyData/
│   └── dummy-users.csv           # Sample list to upload in the Segment step
│
├── public/
│   └── index.html                # HTML shell that hosts the React app
│
└── src/
    ├── index.js                  # React entry point (mounts <App/>, Router)
    ├── App.js                    # Layout + route definitions
    ├── setupProxy.js             # Dev proxy: /api  ->  http://localhost:5000
    ├── setupTests.js             # Jest setup (jest-dom matchers)
    │
    ├── components/               # ── FRONTEND UI ──
    │   ├── Login/
    │   │   └── Login.js           #   Login page (left summary + right sign-in card)
    │   ├── Layout/
    │   │   ├── BrandBar.js        #   Global "fiserv. Admin Tool" header + logged-in role/name / Sign out
    │   │   ├── Sidebar.js         #   Left nav in two groups: Marketing (Dashboard, Create campaign, Templates, Campaigns, User segment) + Administration (Approvals, admin-only)
    │   │   └── Topbar.js          #   Breadcrumb (panel/home icons) + Marketing title
    │   ├── Dashboard/
    │   │   └── Dashboard.js       #   Performance metrics & table + decision bars
    │   ├── Campaigns/
    │   │   ├── CampaignList.js       #   Status-tab table + clone/edit/create (approval queue moved to Approvals/)
    │   │   ├── CampaignWizard.js     #   4-step create/edit wizard (orchestrator; can pre-fill from a template)
    │   │   ├── campaignOptions.js    #   Shared option lists + empty-campaign factory
    │   │   └── wizard/
    │   │       ├── WizardProgress.js     #   Step tracker (Setup→Segment→Location→Review)
    │   │       ├── StepSetup.js          #   Step 1: details + multi-select channels
    │   │       ├── StepSegment.js        #   Step 2: pick segments + audience summary (uses common/FileUpload); opens CreateSegmentModal for inline create
    │   │       ├── StepLocation.js       #   Step 3: web/mobile placements
    │   │       ├── StepReview.js         #   Step 4: summary + edit jumps
    │   │       └── SegmentPickerModal.js #   "Select user segment" popup (uses UserSegment/segmentOptions)
    │   ├── Templates/
    │   │   ├── TemplateList.js       #   Campaign blueprints; "Use template" opens the wizard pre-filled (via router state)
    │   │   └── templateData.js       #   Blueprint definitions
    │   ├── Approvals/
    │   │   └── Approvals.js          #   Admin-only approval queue (moved out of CampaignList); self-guards → redirects non-admins to /dashboard
    │   ├── UserSegment/
    │   │   ├── UserSegmentList.js    #   Segment list
    │   │   ├── AddUserSegment.js     #   Build segment + upload list (reuses SegmentDefinitionForm + common/FileUpload)
    │   │   ├── SegmentDefinitionForm.js #  Shared controlled form (name/description/base/criteria/reach) used by page + modal
    │   │   ├── CreateSegmentModal.js #   In-wizard "Create new segment" modal wrapping SegmentDefinitionForm
    │   │   └── segmentOptions.js     #   Shared segment option lists (CRITERIA/OPERATORS/MATCH_LOGIC) + describeRules + form helpers
    │   ├── common/
    │   │   ├── ConfirmDialog.js   #   Reusable yes/no confirmation modal
    │   │   ├── FileUpload.js      #   Reusable CSV/XLS/XLSX picker (shared by wizard Segment step + AddUserSegment)
    │   │   └── parseUpload.js     #   Counts users in an uploaded CSV/XLS/XLSX (SheetJS); moved here from Campaigns/wizard/
    │   └── __tests__/             #   Jest component tests
    │
    ├── services/
    │   ├── api.js                # Single API client (fetch + fallback to dummy data)
    │   └── auth.js               # AuthProvider/useAuth: two roles, session state (GR-006)
    │
    ├── data/                     # ── DUMMY DATA (JSON) ──
    │   ├── campaigns.json
    │   ├── segments.json
    │   └── uploadedUsers.json
    │
    ├── styles/                   # ── CSS ──
    │   ├── global.css            #   Tokens, buttons, tables, badges, form fields, confirm dialog
    │   ├── login.css             #   Login page split layout (brand panel + sign-in card)
    │   ├── layout.css            #   Shell, fiserv brand bar, sidebar, topbar
    │   ├── dashboard.css
    │   ├── campaigns.css         #   List, status tabs, approve/reject/clone actions
    │   ├── templates.css         #   Templates screen (blueprint cards)
    │   ├── wizard.css            #   Wizard steps, channel cards, segment modal
    │   └── segments.css
    │
    ├── api/                      # ── BACKEND (.NET Core Web API) ──
    │   ├── MarketingApi.csproj    #   Project file (net10.0)
    │   ├── Program.cs             #   Startup: DI, CORS, routing, port 5000
    │   ├── Controllers/
    │   │   ├── CampaignsController.cs   #   /api/campaigns endpoints + dashboard
    │   │   └── SegmentsController.cs    #   /api/segments endpoints
    │   ├── Services/
    │   │   ├── CampaignService.cs #   Business logic + in-memory store
    │   │   └── SegmentService.cs  #   Business logic + reach estimation
    │   ├── Models/
    │   │   ├── Campaign.cs
    │   │   ├── UserSegment.cs
    │   │   └── DashboardSummary.cs
    │   ├── Validation/
    │   │   └── CampaignValidator.cs   #   Guardrails GR-001/GR-002 (date + numeric rules)
    │   └── Data/
    │       └── SeedData.cs        #   Initial in-memory data (mirrors src/data)
    │
    └── api.Tests/                # ── BACKEND TESTS (xUnit) ──
        ├── MarketingApi.Tests.csproj
        ├── CampaignServiceTests.cs
        ├── CampaignValidatorTests.cs
        └── SegmentServiceTests.cs
```

> Component tests live in `src/components/__tests__/` — including
> `Login.test.js` (the login page + roles) and `CampaignList.test.js` (which
> covers the GR-006 role gating of the approval queue).

**How it's organized (the reasoning):**

- **Grouped by feature, then by layer.** Frontend features each get a folder
  (`Dashboard`, `Campaigns`, `UserSegment`); the backend mirrors the classic
  Controller → Service → Model layering.
- **One API client (`services/api.js`).** Components never call `fetch`
  directly — all network access is centralized, which makes the frontend easy to
  test (the whole module is mocked in tests).
- **Styling is separate.** No inline styles; every component imports a
  class-based stylesheet from `src/styles/`.
- **Dummy data lives in two synchronized places:** `src/data/*.json` (used by the
  frontend as a fallback and by the file-upload preview) and
  `src/api/Data/SeedData.cs` (the backend's in-memory seed). CLAUDE.md §6 is the
  authoritative shape both must follow.

---

## 4. End-to-end flow (backend + frontend, with files)

### Request lifecycle diagram

```
Browser (http://localhost:3000)
        │  user clicks "Dashboard"
        ▼
React Router  (src/App.js)  ── renders ──►  Dashboard component
                                            (src/components/Dashboard/Dashboard.js)
        │  useEffect → campaignApi.getDashboard()
        ▼
API client (src/services/api.js)
        │  fetch('/api/campaigns/dashboard')
        ▼
Dev proxy (src/setupProxy.js)  ──►  forwards /api to http://localhost:5000
        ▼
ASP.NET Core (src/api/Program.cs)  ── routes to ──►
   CampaignsController.GetDashboard()  (src/api/Controllers/CampaignsController.cs)
        │  calls
        ▼
   CampaignService.GetDashboard()  (src/api/Services/CampaignService.cs)
        │  aggregates the in-memory list seeded from
        ▼
   SeedData.Campaigns()  (src/api/Data/SeedData.cs)
        │  returns DashboardSummary (src/api/Models/DashboardSummary.cs)
        ▼
   JSON response  ── back through proxy ──►  React state  ──►  rendered on screen
```

*(If the backend is not running, `api.js` catches the failed fetch and returns
the bundled `src/data/*.json` so read-only screens still render.)*

### Backend flow (per request)

1. **Startup** — [Program.cs](../src/api/Program.cs) registers controllers,
   registers `CampaignService` and `SegmentService` as **singletons** (so the
   in-memory data survives across requests), enables **CORS** for
   `http://localhost:3000`, and binds the server to **port 5000**.
2. **Routing** — an incoming request such as `GET /api/campaigns/dashboard` is
   matched to the attribute route on
   [CampaignsController](../src/api/Controllers/CampaignsController.cs).
3. **Controller** — stays thin: validates input and delegates to a service.
   Returns proper HTTP codes (200, 201, 204, 400, 404).
4. **Service** — [CampaignService](../src/api/Services/CampaignService.cs) /
   [SegmentService](../src/api/Services/SegmentService.cs) hold the business
   logic and a thread-safe in-memory list, initially filled from
   [SeedData](../src/api/Data/SeedData.cs).
5. **Models** — [Campaign](../src/api/Models/Campaign.cs),
   [UserSegment](../src/api/Models/UserSegment.cs), and
   [DashboardSummary](../src/api/Models/DashboardSummary.cs) define the shapes
   serialized to JSON (camelCase on the wire).

**API endpoints**

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/campaigns` | List all campaigns |
| GET | `/api/campaigns?status={status}` | List campaigns filtered by status (Active, Draft, Under approval, …) |
| GET | `/api/campaigns/dashboard` | Aggregated dashboard metrics |
| GET | `/api/campaigns/{id}` | One campaign |
| POST | `/api/campaigns` | Create (validated GR-001/GR-002 → 400; fills non-zero dummy metrics) |
| PUT | `/api/campaigns/{id}` | Update (validated GR-001/GR-002 → 400) |
| DELETE | `/api/campaigns/{id}` | Delete |
| POST | `/api/campaigns/{id}/approve` | Approve → `Active` (GR-003: 409 unless currently `Under approval`) |
| POST | `/api/campaigns/{id}/reject` | Reject → `Draft` (GR-003: 409 unless currently `Under approval`) |
| POST | `/api/campaigns/{id}/clone` | Clone into a new `Draft` (fresh non-zero metrics) |
| GET | `/api/segments` | List segments |
| POST | `/api/segments` | Create (server estimates reach) |
| PUT | `/api/segments/{id}` | Update |
| DELETE | `/api/segments/{id}` | Delete |

### Frontend flow (per screen)

1. **Bootstrap** — [index.js](../src/index.js) mounts `<App/>` inside a
   `BrowserRouter`, wraps it in the `AuthProvider`
   ([services/auth.js](../src/services/auth.js)), and imports global CSS.
2. **Login gate** — [App.js](../src/App.js) reads `useAuth()`; while no user is
   signed in it renders [Login.js](../src/components/Login/Login.js) instead of
   the app shell. Sign-in matches one of the two frontend demo users and stores
   the session (mirrored to `sessionStorage`, so a refresh keeps you signed in).
   On successful sign-in the login page calls `navigate('/dashboard')`, so a user
   **always lands on the Dashboard** even if the previous session logged out from
   another route (the browser URL is otherwise preserved while logged out).
3. **Shell & routing** — once authenticated, [App.js](../src/App.js) renders a
   global [BrandBar.js](../src/components/Layout/BrandBar.js) (the blue
   "fiserv. Admin Tool" header) above the persistent `Sidebar` + `Topbar`, and
   maps URLs to page components: `/dashboard`, `/campaigns`, `/campaigns/new`,
   `/campaigns/:id/edit`, `/templates`, `/approvals`, `/user-segment`,
   `/user-segment/new`.
   - `/templates` renders the **Templates** screen (both roles); its **Use
     template** action navigates to the wizard with the chosen blueprint in
     router `location.state.template`, which `CampaignWizard` reads to pre-fill.
   - `/approvals` renders the **admin-only Approvals** screen. Approvals
     **self-guards**: if the signed-in user isn't an Administrator it redirects
     to `/dashboard`. The approval queue moved here out of `CampaignList`.
4. **Navigation & header** — [BrandBar.js](../src/components/Layout/BrandBar.js)
   shows the "fiserv. Admin Tool" brand plus the **logged-in user's role**, name,
   and a **Sign out** button on every screen;
   [Sidebar.js](../src/components/Layout/Sidebar.js) uses `NavLink`s grouped into
   **Marketing** (Dashboard, Create campaign, Templates, Campaigns, User segment)
   and **Administration** (Approvals) — the Administration group is **admin-only**;
   and [Topbar.js](../src/components/Layout/Topbar.js) shows the breadcrumb for
   the current route and the **🏬 Marketing** title.
5. **Data access** — each page calls the matching function in
   [services/api.js](../src/services/api.js) (`campaignApi` / `segmentApi`);
   nothing else touches the network.
6. **Pages**
   - [Dashboard.js](../src/components/Dashboard/Dashboard.js) → `getDashboard()`
     → renders stat cards + performance table + decision bars.
   - [CampaignList.js](../src/components/Campaigns/CampaignList.js) →
     `getAll()` / `clone()`. Renders the status-tab table plus Edit/Clone/Create
     for everyone. The **"Awaiting your approval"** queue no longer lives here —
     it moved to the dedicated Approvals page.
   - [Approvals.js](../src/components/Approvals/Approvals.js) →
     `getAll()` / `approve()` / `reject()`. The **admin-only** approval queue;
     Approve/Reject open a
     [ConfirmDialog](../src/components/common/ConfirmDialog.js) first (GR-006). It
     self-guards by redirecting non-admins to `/dashboard`.
   - [TemplateList.js](../src/components/Templates/TemplateList.js) → lists
     campaign blueprints from `templateData.js`; **Use template** opens the
     wizard pre-filled via router `location.state.template`.
   - [CampaignWizard.js](../src/components/Campaigns/CampaignWizard.js) →
     the 4-step create/edit wizard (`create()` / `update()`), shared for both new
     and edit via the `:id` route. Delegates to the step components under
     `Campaigns/wizard/` and loads segments via `segmentApi.getAll()`.
   - [UserSegmentList.js](../src/components/UserSegment/UserSegmentList.js) →
     `getAll()` / `remove()`.
   - [AddUserSegment.js](../src/components/UserSegment/AddUserSegment.js) →
     builds rules + `create()`; also previews `uploadedUsers.json`. Its
     base-segment dropdown loads the real segments via `segmentApi.getAll()`
     (rather than hardcoded options).
   - **Create a segment inline from the wizard** — the Segment step
     ([StepSegment.js](../src/components/Campaigns/wizard/StepSegment.js)) has a
     "Create new segment" button that opens
     [CreateSegmentModal.js](../src/components/UserSegment/CreateSegmentModal.js),
     which reuses the shared
     [SegmentDefinitionForm.js](../src/components/UserSegment/SegmentDefinitionForm.js).
     On save the segment is created via `segmentApi.create()`, added to the
     wizard's segment list (`CampaignWizard.js`), and auto-selected into the
     campaign so its reach flows into the audience summary — all without leaving
     the wizard.
7. **Shared frontend modules** — the User Segment screens and the campaign
   wizard's Segment step now share code so the audience/upload experience stays
   consistent:
   - [UserSegment/segmentOptions.js](../src/components/UserSegment/segmentOptions.js)
     is the single source of truth for the segment option lists (`CRITERIA`,
     `OPERATORS`, `MATCH_LOGIC`, `newRule`), the `describeRules` formatter, and the
     shared form helpers (`emptySegmentForm`, `validateSegmentForm`,
     `buildSegmentPayload`) — imported by `AddUserSegment`, `UserSegmentList`,
     `SegmentDefinitionForm`/`CreateSegmentModal`, and the wizard's
     `SegmentPickerModal`.
   - [UserSegment/SegmentDefinitionForm.js](../src/components/UserSegment/SegmentDefinitionForm.js)
     is the shared controlled segment form (name, description, base segment,
     criteria rules, optional reach) reused by both `AddUserSegment` (the page)
     and `CreateSegmentModal` (the in-wizard popup).
   - [common/FileUpload.js](../src/components/common/FileUpload.js) is a reusable
     CSV/XLS/XLSX picker (parses the real user-row count) used by both the
     wizard's `StepSegment` and `AddUserSegment`.
   - [common/parseUpload.js](../src/components/common/parseUpload.js) (moved here
     from `Campaigns/wizard/`) does the SheetJS row counting behind `FileUpload`.
8. **Proxy** — in development, [setupProxy.js](../src/setupProxy.js) forwards any
   `/api/*` request from port 3000 to the backend on port 5000, so the two run
   independently without CORS friction in the browser.

### Key feature flows

- **Login & roles:** the app is gated by [App.js](../src/App.js) behind the
  `AuthProvider`. Two frontend demo users exist —
  **Administrator** (`admin`) and **Campaign Creator** (`creator`). The role is
  kept in context (and `sessionStorage`); `isAdmin` drives the GR-006 gating of
  the approval queue. This is a POC, so there is no backend auth or password
  store — see [auth.js](../src/services/auth.js). Signing in redirects to
  `/dashboard` so every session starts on the Dashboard.
- **Create/edit wizard (4 steps):** `Setup → Segment → Location → Review`.
  Setup captures name/description/keywords/product/priority/dates and
  multi-select **channels**; Segment picks user segments (modal) + optional list
  upload with a live audience estimate; Location sets web/mobile placements;
  Review summarises everything with per-section edit jumps and a **Send for
  approval** action (saves with status `Under approval`). *(The earlier "Content"
  step was removed; the `assets` field remains in the model/seed only.)*
- **Approval workflow:** campaigns move `Draft`/`In-progress` → `Under approval`
  (via Send for approval) → `Active` (Approve) or back to `Draft` (Reject).
  Approve/Reject now live on the dedicated **admin-only Approvals** screen
  (`/approvals`); the Campaigns screen shows only the status tabs for every
  status (plus Edit/Clone/Create).
- **Dummy metrics guarantee:** `CampaignService.EnsureMetrics()` fills any zero
  `targetedPopulation`/`accepted`/`declined`/`clickedUnfinished` on Create and
  Clone, so every campaign always has non-zero numbers and a colored dashboard
  bar.
- **Manual list upload (Segment step):** the reusable
  [FileUpload](../src/components/common/FileUpload.js) picker reads the chosen
  CSV/XLS/XLSX with SheetJS ([parseUpload.js](../src/components/common/parseUpload.js)),
  counts the data rows, and shows that as **"Manual upload users"** (feeding the
  estimated reach). Re-uploading replaces the previous list. The same picker is
  reused when building a User Segment. A ready-to-use
  sample lives in [DummyData/dummy-users.csv](../DummyData/dummy-users.csv).
- **Reach model (shared FE/BE):** a segment's estimated reach is a rules-based
  heuristic `100000 × factor^(#rules)` (factor `0.45` for AND, `0.70` for OR).
  The frontend formula in
  [UserSegment/segmentOptions.js](../src/components/UserSegment/segmentOptions.js)
  (`estimateSegmentReach`) mirrors backend `SegmentService.EstimateReach` and is
  kept in sync so the segment builder's live preview equals the value the server
  stores. A campaign's audience reach combines the chosen segments' reach plus
  any manual-upload users through a single shared `0.9` dedup factor
  (`combineAudienceReach`, used by the wizard's Segment step).

### Guardrails

Validation, safe-action, and state-transition controls are catalogued in
**[Guardrails/Guardrails.md](../Guardrails/Guardrails.md)** (the living register),
each cited as `GR-###` in code:

- **GR-001 / GR-002 (API):** `CampaignValidator` rejects bad dates
  (end < start / unparseable) and out-of-range metrics (negative, or
  accepted+declined+clicked > targetedPopulation) with **HTTP 400** on
  create/update.
- **GR-003 (Service+API):** approve/reject only succeed from `Under approval`
  (else **HTTP 409**); missing id → **404**.
- **GR-004 (UI):** the wizard disables **Next** / **Send for approval** until the
  Setup step is valid (name, dates with end ≥ start, ≥1 channel).
- **GR-005 (UI):** an in-flight-action `busy` guard disables
  Approve/Reject/Clone and the confirm dialog to prevent double-submits.
- **GR-006 (UI):** role-based authorization — the *Awaiting your approval* queue
  and its Approve/Reject actions live on the **admin-only Approvals** screen
  ([Approvals.js](../src/components/Approvals/Approvals.js)), which self-guards by
  redirecting non-admins to `/dashboard`; the Administration nav group is also
  hidden from **Campaign Creators**. Enforced via
  [auth.js](../src/services/auth.js) (`isAdmin`). GR-003 remains the server-side
  backstop.

### The data contract (keeps both layers aligned)

The **Campaign** and **UserSegment** field shapes are defined once in
[CLAUDE.md](../CLAUDE.md) §6 and must match across: `src/data/*.json`,
`src/api/Models/*.cs`, `src/api/Data/SeedData.cs`, and the React components.
Changing a field means updating all of them plus the tests — this is the golden
rule for extending the project.

---

## 5. Steps to run the project via terminal

Use **two terminals**, both at the project root
`c:\Fiserv\POCRelated\POC02072026\Compaign App`.
(PowerShell does not support `&&`, so keep the two servers in separate terminals.)

### Terminal 1 — Backend API (port 5000)

```powershell
dotnet run --project "src\api\MarketingApi.csproj"
```

Leave it running once it reports listening on `http://localhost:5000`.

### Terminal 2 — Frontend (port 3000)

```powershell
npm install    # first time only (dependencies already installed here)
npm start
```

When it prints **`Compiled successfully!`**, open **http://localhost:3000**.

### Run the tests

```powershell
# Frontend (Jest + React Testing Library) — 32 tests across 10 suites
npm run test:ci

# Backend (xUnit) — 27 tests
dotnet test "src\api.Tests\MarketingApi.Tests.csproj"
```

### Build a production frontend bundle (optional)

```powershell
npm run build      # outputs an optimized build to .\build
```

### Stopping the servers

Press `Ctrl + C` in each terminal, or if they were started in the background:

```powershell
Get-Process node, MarketingApi -ErrorAction SilentlyContinue | Stop-Process -Force
```

> **Note:** the API stores data in memory, so any campaigns/segments you create,
> edit, or delete reset to the seed data whenever the backend restarts.
