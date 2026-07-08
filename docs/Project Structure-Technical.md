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
| .NET SDK | **10.0.109** | Builds and runs the Web API |
| Target framework | **net10.0** | Compilation target for the API & tests |

### Frontend stack

| Package | Version | Purpose |
| --- | --- | --- |
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | React DOM rendering |
| react-router-dom | ^6.26.2 | Client-side routing between screens |
| react-scripts (Create React App) | 5.0.1 | Build/dev-server/test tooling (webpack, Babel, Jest) |
| http-proxy-middleware | ^2.0.6 | Proxies `/api` calls to the backend in dev |
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
    │   ├── Layout/
    │   │   ├── Sidebar.js         #   Left navigation menu
    │   │   └── Topbar.js          #   Breadcrumb + title bar
    │   ├── Dashboard/
    │   │   └── Dashboard.js       #   Performance metrics & table
    │   ├── Campaigns/
    │   │   ├── CampaignList.js    #   List + delete
    │   │   └── CampaignForm.js    #   Create / edit form
    │   ├── UserSegment/
    │   │   ├── UserSegmentList.js #   Segment list
    │   │   └── AddUserSegment.js  #   Build segment + upload list
    │   └── __tests__/             #   Jest component tests
    │
    ├── services/
    │   └── api.js                # Single API client (fetch + fallback to dummy data)
    │
    ├── data/                     # ── DUMMY DATA (JSON) ──
    │   ├── campaigns.json
    │   ├── segments.json
    │   └── uploadedUsers.json
    │
    ├── styles/                   # ── CSS ──
    │   ├── global.css            #   Tokens, buttons, tables, badges
    │   ├── layout.css            #   Shell, sidebar, topbar
    │   ├── dashboard.css
    │   ├── campaigns.css
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
    │   └── Data/
    │       └── SeedData.cs        #   Initial in-memory data (mirrors src/data)
    │
    └── api.Tests/                # ── BACKEND TESTS (xUnit) ──
        ├── MarketingApi.Tests.csproj
        ├── CampaignServiceTests.cs
        └── SegmentServiceTests.cs
```

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
| GET | `/api/campaigns/dashboard` | Aggregated dashboard metrics |
| GET | `/api/campaigns/{id}` | One campaign |
| POST | `/api/campaigns` | Create |
| PUT | `/api/campaigns/{id}` | Update |
| DELETE | `/api/campaigns/{id}` | Delete |
| GET | `/api/segments` | List segments |
| POST | `/api/segments` | Create (server estimates reach) |
| PUT | `/api/segments/{id}` | Update |
| DELETE | `/api/segments/{id}` | Delete |

### Frontend flow (per screen)

1. **Bootstrap** — [index.js](../src/index.js) mounts `<App/>` inside a
   `BrowserRouter` and imports global CSS.
2. **Shell & routing** — [App.js](../src/App.js) renders the persistent
   `Sidebar` + `Topbar` and maps URLs to page components:
   `/dashboard`, `/campaigns`, `/campaigns/new`, `/campaigns/:id/edit`,
   `/user-segment`, `/user-segment/new`.
3. **Navigation** — [Sidebar.js](../src/components/Layout/Sidebar.js) uses
   `NavLink`s; [Topbar.js](../src/components/Layout/Topbar.js) shows the
   breadcrumb for the current route.
4. **Data access** — each page calls the matching function in
   [services/api.js](../src/services/api.js) (`campaignApi` / `segmentApi`);
   nothing else touches the network.
5. **Pages**
   - [Dashboard.js](../src/components/Dashboard/Dashboard.js) → `getDashboard()`
     → renders stat cards + performance table + decision bars.
   - [CampaignList.js](../src/components/Campaigns/CampaignList.js) →
     `getAll()` / `remove()`.
   - [CampaignForm.js](../src/components/Campaigns/CampaignForm.js) →
     `create()` / `update()` (shared for both new and edit via the `:id` route).
   - [UserSegmentList.js](../src/components/UserSegment/UserSegmentList.js) →
     `getAll()` / `remove()`.
   - [AddUserSegment.js](../src/components/UserSegment/AddUserSegment.js) →
     builds rules + `create()`; also previews `uploadedUsers.json`.
6. **Proxy** — in development, [setupProxy.js](../src/setupProxy.js) forwards any
   `/api/*` request from port 3000 to the backend on port 5000, so the two run
   independently without CORS friction in the browser.

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
# Frontend (Jest + React Testing Library) — 6 tests
npm run test:ci

# Backend (xUnit) — 12 tests
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
