# Marketing Campaign Management Tool

Admin-tool feature (for users with the **Marketing** entitlement) to create
campaigns via a guided wizard, review/edit/clone them, run an approval workflow,
view a Campaign & Promotion dashboard, and manage user segments.

The app opens on a **login page** and supports **two roles**: **Administrator**
(`admin` / `admin123`) with full access including approve/reject, and
**Campaign Creator** (`creator` / `creator123`) who can use every screen and
create/edit/clone campaigns but cannot approve/reject.

- **Frontend:** React.js (`src/components/`) — runs at **http://localhost:3000**
- **Backend:** .NET Core Web API (`src/api/`) — runs at **http://localhost:5000**
- **Dummy data:** `src/data/*.json`
- **Styling:** `src/styles/*.css`
- **Tests:** frontend `src/components/__tests__/`, backend `src/api.Tests/`

> Working conventions and a guide for adding/modifying features live in
> [CLAUDE.md](CLAUDE.md). The agent-teams master reference is in
> [docs/agent-teams-reference.md](docs/agent-teams-reference.md).

## Run the app

Open two terminals.

**1. Backend** (from the project root):

```powershell
dotnet run --project src/api/MarketingApi.csproj
```

**2. Frontend** (from the project root):

```powershell
npm install   # first time only
npm start     # opens http://localhost:3000
```

The frontend proxies `/api` calls to the backend on port 5000
(`src/setupProxy.js`). If the backend is not running, read-only screens fall
back to the bundled dummy data so the UI still renders.

## Run the tests

```powershell
# Frontend (Jest + React Testing Library)
npm run test:ci

# Backend (xUnit)
dotnet test src/api.Tests/MarketingApi.Tests.csproj
```

## Features

- **Login & roles** — the app is gated behind a login page (left summary panel +
  right sign-in card with click-to-fill demo accounts). Signing in always lands
  you on the Dashboard. Every screen carries a global **"fiserv. Admin Tool"**
  header showing the logged-in role and a Sign out control. **Administrator** has
  full access (incl. approve/reject); **Campaign Creator** sees all screens and
  can create/edit/clone but not approve/reject (the approval queue is hidden).
- **Dashboard** — Total Targeted Population and per-decision breakdown
  (Accepted/Fulfilled, Declined, Clicked but Unfinished) with a per-campaign
  performance table. Every campaign carries non-zero dummy metrics.
- **Create campaign** — a 4-step wizard: **Setup → Segment → Location → Review**
  (multi-select channels, segment picker, placements, summary → *Send for
  approval*). The Segment step can **upload a user list** (CSV/XLS/XLSX) and
  shows the real parsed user count — a ready sample lives in
  [DummyData/dummy-users.csv](DummyData/dummy-users.csv) — and can **create a new
  segment inline** without leaving the wizard.
- **Templates** — start a campaign from a ready-made **blueprint**; *Use
  template* opens the wizard pre-filled. (Both roles.)
- **Campaigns** — the full campaign list with **status tabs** (In-progress,
  Under approval, Draft, Active, Completed), plus **Edit** and **Clone** actions.
- **Approvals** *(Administrators only)* — the dedicated **"Awaiting your
  approval"** queue with **Approve/Reject** (confirmation dialog). Moved here out
  of the Campaigns screen.
- **Audit Trail** *(Administrators only)* — a log of **who signed in and what
  actions were performed** (logins, approvals, campaign/segment changes) with
  timestamps; backed by a client-side audit service persisted to `localStorage`.
- **User segment** — import a custom user list, review uploaded users, build a
  segment from criteria rules (e.g. `Age > 25 AND State is CA`) with AND/OR
  match logic and an estimated audience reach.

> REST API also exposes create/read/update/delete plus
> `approve`, `reject`, and `clone`; see
> [docs/Project Structure-Technical.md](docs/Project%20Structure-Technical.md) §4.

## Guardrails

Validation and safe-action controls (date sanity, numeric ranges, the approval
state machine, wizard field-validity gating, double-submit prevention, and
role-based approval authorization) are catalogued in
**[Guardrails/Guardrails.md](Guardrails/Guardrails.md)** — the living register
for the project.
