# Integrating Devin AI with the Marketing Campaign Management Tool — UPDATED

*A configuration guide and readiness assessment for using **Devin** (Cognition
Labs' autonomous AI software engineer) to add new features to this existing
application.*

> **This is the updated copy.** The original
> [Devin-Integration-Guide.md](Devin-Integration-Guide.md) is preserved
> unchanged. This version records progress made: **Git is now installed, the
> repository is initialized, and the project has been pushed to GitHub.**

> **Scope:** how to connect Devin to this project, what tools/software are
> required, whether those tools are present on this machine, and an end-to-end
> plan to build a new feature with Devin.

---

## 0. Progress status (what's done so far)

| Milestone | Status | Detail |
| --- | --- | --- |
| Install Git | ✅ **Done** | `git version 2.54.0.windows.1` ("Software Freedom Conservancy Git", installed via corporate software center — winget is blocked by group policy). |
| Install GitHub CLI | ✅ **Done** | `gh version 2.89.0` at `C:\Program Files\GitHub CLI`. |
| Initialize repository | ✅ **Done** | `git init`, branch `main`, author `rahul.sureka@cognizant.com`. |
| First commit | ✅ **Done** | Commit `5b88b6a` — 47 source files (no `node_modules`/`bin`/`obj`/`build`). |
| Push to GitHub | ✅ **Done** | Pushed to **https://github.com/rahulsureka-cloud/Compaign-App** (`main`), authenticated via Git Credential Manager. |
| Connect Devin to the repo | ⬜ **Next** | Install the Devin GitHub App on the repo (Step 4). |
| Configure Devin Machine Setup | ⬜ Pending | Node 22 + .NET 10, install/run/test commands (Step 5). |
| Add Devin Knowledge + task | ⬜ Pending | Point at CLAUDE.md, then assign a feature (Steps 6–7 + §5). |

**Repository URL:** `https://github.com/rahulsureka-cloud/Compaign-App`

---

## 1. How Devin fits this project

Devin is a **cloud-based autonomous AI engineer**. It runs in its own sandboxed
VM (editor + shell + browser), reads a Git repository, plans and writes code,
runs builds and tests, and opens a **pull request** for a human to review and
merge. You give it a task in plain English (in the web app, Slack, or a
Linear/Jira ticket) and it works largely on its own.

Because Devin works from a **Git repo hosted on a provider (GitHub / GitLab /
Bitbucket / Azure DevOps)**, integrating it with this app is mostly about:

1. Getting this codebase into a hosted Git repository ✅ **(done — see §0)**, and
2. Teaching Devin's cloud VM how to install, run, and test *this specific*
   project (Node/React front end + .NET Core API).

The good news: this repo already ships an **instructor file
([CLAUDE.md](../CLAUDE.md))**, a **README**, and **docs/** — exactly the kind of
context Devin uses to work accurately. We will point Devin at them.

---

## 2. Tools & software required

Devin itself runs in the cloud, so most heavy tooling (Node, .NET) is needed
**inside Devin's VM snapshot**, not on your laptop. Your local machine mainly
needs enough to **publish the repo** and access Devin.

### A. Required on THIS machine (local)

| Requirement | Why it's needed | Status |
| --- | --- | --- |
| **Git** | Version the project and push it to a hosted Git provider so Devin can access it. | ✅ Installed (2.54.0) |
| **A web browser** | Access the Devin web app at `https://app.devin.ai`. | ✅ Edge |
| **Internet access** | Devin is a cloud service. | ✅ |

### B. Required externally (accounts / cloud)

| Requirement | Why it's needed | Status |
| --- | --- | --- |
| **Devin subscription** (Cognition Labs account) | Access to Devin. Pricing is **ACU-based** (Agent Compute Units) — verify the current plan/price at cognition.ai / app.devin.ai. | ⬜ Verify |
| **Hosted Git repository** (GitHub recommended; GitLab / Bitbucket / Azure DevOps also supported) | Devin clones the repo and opens PRs here. | ✅ Pushed to GitHub |
| **Git provider account with push access** | To create the remote repo and let Devin's GitHub App connect to it. | ✅ `rahulsureka-cloud` |

### C. Configured INSIDE Devin's VM (cloud "Machine Setup" snapshot)

These make Devin able to build and test *this* project. They live in Devin's
environment, not on your PC:

| Tool | Version this project uses |
| --- | --- |
| Node.js | **22.x** (built/tested on 22.19.0) |
| npm | **10.x** |
| .NET SDK | **10.0** (`net10.0` target) |

### D. Optional but recommended

| Tool / integration | Benefit | Status |
| --- | --- | --- |
| **GitHub CLI (`gh`)** | Easier repo creation/auth from the terminal. | ✅ Installed (2.89.0) |
| **Devin Desktop** | Local "command center" to run multiple Devins in parallel (e.g. one on frontend, one on backend). | ⬜ Optional |
| **Slack integration** | Kick off / talk to Devin with `@Devin` from Slack. | ⬜ Optional |
| **Linear / Jira integration** | Assign a ticket to Devin and have it implement it. | ⬜ Optional |
| **Devin API + MCP server** | Trigger Devin programmatically / from other tools (needs an API key from Devin settings). | ⬜ Optional |
| **Devin Review** | AI code review directly on pull requests. | ⬜ Optional |

---

## 3. System readiness check (this machine)

Re-checked on the current Windows environment (updated):

| Tool / condition | Required? | Status | Notes |
| --- | --- | --- | --- |
| **Git** | ✅ Required | ✅ **INSTALLED** | `git version 2.54.0.windows.1` at `C:\Program Files\Git\cmd\git.exe`. |
| **Git repository initialized** | ✅ Required | ✅ **DONE** | `.git` present; branch `main`; commit `5b88b6a`. |
| **Pushed to GitHub** | ✅ Required | ✅ **DONE** | `origin` → `https://github.com/rahulsureka-cloud/Compaign-App.git`. |
| Node.js | For Devin VM / local test | ✅ Present | v22.19.0 |
| npm | For Devin VM / local test | ✅ Present | 10.9.3 |
| .NET SDK | For Devin VM / local test | ✅ Present | 10.0.109 and 10.0.301 installed |
| Web browser | ✅ Required | ✅ Present | Default = Microsoft Edge |
| **GitHub CLI (`gh`)** | Optional | ✅ **Installed** | 2.89.0. |
| Python | Not needed | ❌ Missing | Not used by this project. |
| Docker | Not needed | ❌ Missing | Not used in this workflow. |
| winget (installer) | — | ⚠️ **Blocked** | Blocked by corporate group policy; installs were done via the software center instead. |

### ✅ Blockers cleared / remaining action items

1. ~~**Install Git**~~ ✅ done (2.54.0).
2. ~~**Initialize a repo and push it to GitHub**~~ ✅ done → `rahulsureka-cloud/Compaign-App`.
3. ~~(Optional) Install **GitHub CLI**~~ ✅ done (2.89.0).
4. **Create/verify a Devin subscription** — ⬜ *remaining*.
5. **Connect the repo in Devin and configure Machine Setup** — ⬜ *remaining (Steps 4–6)*.

Everything this project needs locally (Git, Node, .NET) is present. The next
work is entirely inside the Devin web app.

---

## 4. Step-by-step configuration plan

### Step 1 — Install the local tools ✅ DONE

> **Note:** `winget` is **blocked by group policy** on this machine, so the
> tools were installed from the **corporate software center** instead:
> - *Software Freedom Conservancy Git 2.54 Windows* → provides `git`.
> - *GitHub CLI 2.89 Windows-Freeware* → provides `gh`.
>
> After installing, the terminal was reopened so `git` landed on the PATH.

Confirm at any time:

```powershell
git --version   # git version 2.54.0.windows.1
gh --version    # gh version 2.89.0
```

### Step 2 — Put this project under version control ✅ DONE

Executed from the project root `c:\Fiserv\POCRelated\POC02072026\Compaign App`:

```powershell
git init
git config user.email "rahul.sureka@cognizant.com"
git config user.name  "Rahul Sureka"
git branch -M main
git add .
git commit -m "Initial commit: Marketing Campaign Management Tool"
```

> `.gitignore` excludes `node_modules/`, `build/`, `bin/`, and `obj/`, so only
> source was committed (47 files, commit `5b88b6a`).

### Step 3 — Create a remote repository and push ✅ DONE

The remote already existed at
`https://github.com/rahulsureka-cloud/Compaign-App`, so we wired it up and
pushed:

```powershell
git remote add origin https://github.com/rahulsureka-cloud/Compaign-App.git
git push -u origin main
```

Authentication was handled by **Git Credential Manager** (browser sign-in) —
subsequent pushes will not re-prompt. Verified: `refs/heads/main` on the remote
matches local `5b88b6a`.

> For future repos, the GitHub CLI shortcut also works:
> `gh auth login` then `gh repo create <name> --private --source . --push`.

### Step 4 — Connect Devin to the repository ⬜ NEXT

1. Sign in at **`https://app.devin.ai`**.
2. Go to **Settings → Integrations → GitHub** and install the **Devin GitHub
   App**, granting access to **`rahulsureka-cloud/Compaign-App`**.
3. Confirm the repo appears in Devin's list of connected repositories.

### Step 5 — Configure Devin's Machine Setup (the VM snapshot)

This is the most important step for *this* project. In Devin: **Settings →
Machine Setup** (a.k.a. environment/snapshot) for the connected repo, configure:

**Install / dependencies:**
```bash
# Node dependencies (frontend)
npm install

# Restore .NET dependencies (backend)
dotnet restore src/api/MarketingApi.csproj
dotnet restore src/api.Tests/MarketingApi.Tests.csproj
```

**Ensure these runtimes are available in the snapshot:** Node.js 22.x, npm 10.x,
.NET SDK 10.0. (If the base image is older, add setup commands to install Node 22
and the .NET 10 SDK.)

**How to run the app (tell Devin):**
```bash
# Backend API on port 5000
dotnet run --project src/api/MarketingApi.csproj

# Frontend on port 3000 (separate process)
npm start
```

**How to test / verify (Devin should run these before opening a PR):**
```bash
npm run test:ci
dotnet test src/api.Tests/MarketingApi.Tests.csproj
```

Save the snapshot so every new Devin session starts from this ready state.

### Step 6 — Give Devin project knowledge

- In **Devin → Knowledge**, add a note such as:
  *"Follow CLAUDE.md at the repo root before any change. Keep the Campaign /
  UserSegment data contract (CLAUDE.md §6) in sync across `src/data/*.json`,
  `src/api/Models`, `src/api/Data/SeedData.cs`, and the React components. Run
  `npm run test:ci` and `dotnet test` and report results."*
- Because Devin reads repo files, CLAUDE.md, README.md, and everything in
  `docs/` already act as strong built-in guidance.

### Step 7 (optional) — Wire up team integrations 

- **Slack:** install the Devin Slack app; start work with `@Devin <task>`.
- **Linear / Jira:** connect the workspace; assign a ticket to Devin to have it
  implement and open a PR.
- **Devin API / MCP:** generate an API key in Devin settings to trigger sessions
  from scripts or other tools.

---

## 5. End-to-end flow: adding a new feature with Devin

Example feature: *"Add a `budget` field to campaigns and show it on the
dashboard."*

```
You write a task prompt in Devin (web/Slack/ticket)
        │
        ▼
Devin spins up its VM from your saved snapshot (Node 22 + .NET 10, deps installed)
        │  reads CLAUDE.md + docs/ for conventions and the data contract
        ▼
Devin PLANS the change across the full stack:
   Campaign model → SeedData → campaigns.json → API DTO/controller
   → services/api.js → CampaignForm/CampaignList/Dashboard → tests
        │
        ▼
Devin WRITES the code, then RUNS:  npm run test:ci  +  dotnet test
        │  fixes anything that fails, iterates autonomously
        ▼
Devin opens a PULL REQUEST on GitHub with the changes + test results
        │
        ▼
You (or Devin Review) review the PR, request tweaks in-thread, then MERGE
```

**A good task prompt for this repo looks like:**

> "In the Marketing Campaign Management Tool repo, add a numeric `budget` field
> to campaigns. Follow CLAUDE.md — update the data contract (§6), the C# model,
> SeedData, `src/data/campaigns.json`, the API, `services/api.js`, and the
> Campaigns form/list + Dashboard. Add/adjust Jest and xUnit tests. Run
> `npm run test:ci` and `dotnet test` and include results in the PR."

The clearer the prompt and the better CLAUDE.md is maintained, the more reliably
Devin lands the change in one pass.

---

## 6. Verification & review

- **Automated:** Devin runs `npm run test:ci` (6 Jest tests) and
  `dotnet test` (12 xUnit tests) inside its VM before opening the PR.
- **Human:** review the PR diff; optionally enable **Devin Review** to get an
  AI review comment automatically.
- **Local sanity check (optional):** pull the branch and run the app yourself —
  backend on `:5000`, frontend on `:3000` (see
  [Project Structure-Technical.md](../docs/Project%20Structure-Technical.md) §5).

---

## 7. Caveats & notes

- **Devin is a paid cloud service.** Confirm current ACU-based pricing and seat
  limits before relying on it for regular work.
- **`winget` is blocked here.** Install any further local tooling from the
  corporate software center, not `winget`.
- **Data is in-memory in this app.** The API resets to seed data on restart —
  Devin's runtime tests won't persist data, which is expected.
- **Split the work for parallelism.** With Devin Desktop you can run one Devin on
  the backend and another on the frontend, mirroring this repo's clean
  file-per-layer boundaries (see the team split in
  [Project Structure-Technical.md](../docs/Project%20Structure-Technical.md) §1).
- **Keep CLAUDE.md current.** It is Devin's (and Claude's) primary source of
  truth; an accurate instructor file is the single biggest lever on output
  quality.
- **Product names/features** (Devin Cloud, Desktop, Review, Ask Devin/DeepWiki,
  Machine Setup, Knowledge) and exact menu labels evolve — verify against the
  live Devin UI and current Cognition Labs docs when configuring.

---

## 8. Quick checklist (updated)

- [x] Install **Git** (via software center — *Software Freedom Conservancy Git 2.54*)
- [x] (Optional) Install **GitHub CLI** (*GitHub CLI 2.89*)
- [x] `git init` → commit → push to **GitHub** (`rahulsureka-cloud/Compaign-App`)
- [ ] Create/verify a **Devin** subscription
- [ ] Connect the repo in Devin (**GitHub App**)
- [ ] Configure **Machine Setup** (Node 22, .NET 10, `npm install`, run & test commands)
- [ ] Add **Knowledge** pointing to CLAUDE.md and the data contract
- [ ] (Optional) Connect **Slack / Linear / Jira**
- [ ] Give Devin a task → review its **PR** → merge

---

### Appendix — commands to re-run the readiness check

```powershell
git --version
gh --version
node --version
npm --version
dotnet --version
dotnet --list-sdks
git remote -v
git log --oneline -1
```
