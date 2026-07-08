# Marketing Campaign Management Tool

Admin-tool feature (for users with the **Marketing** entitlement) to create,
read, update, and delete campaigns, view a Campaign & Promotion dashboard, and
manage user segments.

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

- **Dashboard** — Total Targeted Population and per-decision breakdown
  (Accepted/Fulfilled, Declined, Clicked but Unfinished) with a per-campaign
  performance table.
- **Campaigns** — full CRUD (list, create, edit, delete).
- **User segment** — import a custom user list, review uploaded users, build a
  segment from criteria rules (e.g. `Age > 25 AND State is CA`) with AND/OR
  match logic and an estimated audience reach.
