# DemoDoc — Marketing Campaign Management Tool

*A presenter's guide for demoing the app to **both non-technical (business)** and
**technical** audiences. Use it as a script: each flow has **what to do** (on
screen) and **what to say** (talking points). Pick the sections that fit your
audience and time slot.*

---

## 0. Before the demo — setup checklist

Do this 10 minutes before you present.

- [ ] **Start the backend** (from the project root):
  `dotnet run --project "src\api\MarketingApi.csproj"` → wait for
  *"Now listening on: http://localhost:5000"*.
- [ ] **Start the frontend** (project root): `npm start` → opens
  **http://localhost:3000**.
- [ ] Confirm both respond: the app loads the **login page** at
  http://localhost:3000.
- [ ] Have the **demo accounts** ready (see below).
- [ ] Because data is **in-memory**, restart the backend beforehand for a clean,
  predictable dataset (7 sample campaigns, 2 sample segments).
- [ ] Zoom the browser to ~110–125% so the room can read it.
- [ ] Close unrelated tabs; have this DemoDoc open on a second screen.

**Demo accounts (click-to-fill on the login page):**

| Role | Username | Password | Can do |
| --- | --- | --- | --- |
| **Administrator** | `admin` | `admin123` | Everything, incl. **approve/reject** |
| **Campaign Creator** | `creator` | `creator123` | All screens, create/edit/clone; **no** approve/reject |

---

## 1. One-line pitch (open with this)

> "This is a single, self-service **Marketing Campaign Management** tool. A
> marketer can plan a promotion with a guided wizard, choose exactly who
> receives it, send it through an approval workflow, and watch how it's
> performing — all in the browser, no spreadsheets, no dev help."

**The four questions the app answers:** *What am I promoting? Who receives it?
Is it approved? Is it working?*

---

## 2. Suggested agenda (≈20–25 min)

| # | Segment | Audience | Time |
| --- | --- | --- | --- |
| 1 | Login & roles | Both | 2 min |
| 2 | Dashboard (performance) | Both | 3 min |
| 3 | Templates (start from a blueprint) | Both | 2 min |
| 4 | Create a campaign (4-step wizard) | Both | 6 min |
| 5 | Approval workflow (Approvals menu, approve/reject) | Both | 3 min |
| 6 | User Segments + create-in-wizard | Both | 4 min |
| 7 | Guardrails (safety) | Both (light) / Tech (deep) | 2 min |
| 8 | Under the hood (architecture, tests, AI) | Technical | 5 min |
| 9 | Q&A | Both | — |

> Tip: for a **purely business** audience, do 1–6 and skip 8. For a **technical**
> audience, keep 1–6 brief and spend time on 7–8.

---

## 3. Business flows (non-technical) — do & say

### Flow A — Sign in and orient (2 min)
**Do:** Open http://localhost:3000. Click the **Administrator** demo account →
**Sign in**.
**Say:**
- "The whole app is gated behind a login. There are **two roles** — an
  **Administrator** who can approve campaigns, and a **Campaign Creator** who can
  build everything but not approve."
- "Notice the **fiserv. Admin Tool** header on top — it shows *who's logged in*
  and their role on every screen, with a Sign out button."
- "After login you always land on the **Dashboard**."

### Flow B — Read the Dashboard (3 min)
**Do:** Stay on **Dashboard**. Point to the summary cards, then the table's
colored bars.
**Say:**
- "At a glance: **Total Targeted Population** — how many people our promotions
  reached — plus how they responded."
- "The response is broken into three outcomes: **Accepted/Fulfilled** (green),
  **Declined** (red), and **Clicked but Unfinished** (amber) — people who started
  but didn't complete."
- "Each campaign row has a **colored bar** splitting those three, so you spot a
  weak performer instantly. Every campaign always shows real numbers, so nothing
  looks empty."

### Flow C — Create a campaign with the wizard (6 min) ⭐ the centerpiece
**Do:** Left menu → **Create campaign**. Walk the 4 steps.
**Tip (Templates):** before building from scratch, show **Templates** in the
left menu — a set of ready-made **blueprints**. Click **Use template** on one and
point out that the wizard **opens pre-filled** from the blueprint, so you can
tweak instead of start blank. Then continue the walkthrough below.
**Say (per step):**
1. **Setup** — "Give it a name, dates, and pick delivery **channels** (In-app,
   Email, SMS, Social, Ads). Notice **Next is greyed out** until the required
   fields are valid — that's a built-in safeguard."
2. **Segment (audience)** — "Choose *who* receives it: pick existing **user
   segments**, or upload a customer list — the tool reads the file and shows the
   **real number of people** in it. The **Audience summary** estimates the total
   reach." *(Optional wow moment: click **⊕ Create new segment** — see Flow E.)*
3. **Location** — "Where the promotion appears — web and mobile placements
   (banners, dashboard tiles)."
4. **Review** — "A tidy summary with an edit icon on each section to jump back.
   Finish with **Send for approval**."
**Say (close):** "The performance numbers are filled in automatically — the
marketer never types them."

### Flow D — Approval workflow (3 min)
**Do:** Left menu → **Administration → Approvals** (admin-only). Show the
**"Awaiting your approval"** queue. Click **Approve** on one → confirm in the
popup → it becomes **Active**. Then show **Reject** → back to **Draft**. (The
**Campaigns** screen now shows only the status tabs + Edit/Clone/Create.)
**Say:**
- "Approvals now have their **own menu** under **Administration** — a dedicated,
  admin-only screen. Anything sent for approval lands in this queue. An approver
  clicks **Approve** (goes live) or **Reject** (back to draft) — always with a
  **confirmation popup** so nothing happens by accident."
- "Over on **Campaigns**, the tabs organize every campaign by stage: In-progress,
  Under approval, Draft, Active, Completed. You can also **Edit** or **Clone** a
  campaign there."
- **Role contrast (powerful):** Sign out → sign in as **Campaign Creator**.
  "Notice the entire **Administration** group with **Approvals** is **gone** — and
  even typing `/approvals` bounces you to the Dashboard. This role can build
  campaigns but not approve them."

### Flow E — User Segments & create-in-context (4 min)
**Do:** Left menu → **User segment** → **+ Add user segment**. Build a rule like
*Age Greater than 25* **AND** *State is CA*. Show the **estimated reach** update.
Then show the same builder appears **inside the campaign wizard** via
**⊕ Create new segment**.
**Say:**
- "A **segment** is a reusable audience defined by simple rules — e.g. *customers
  over 25 in California*. Combine rules with **AND/OR**."
- "The **estimated reach** reflects the rules: more/tighter rules → smaller
  audience. That same number follows the segment everywhere."
- "Best part: if you're mid-campaign and the audience doesn't exist yet, click
  **Create new segment** right there — build it in a popup, and it's **created
  and auto-selected** without leaving the campaign."

---

## 4. Safety & trust — Guardrails (2 min, light for business)

**Say:** "The tool has built-in **guardrails** so bad data or wrong actions can't
slip through." Show one live: on the wizard Setup step, clear the name → **Next
stays disabled** with a hint.

| ID | Guardrail (plain language) |
| --- | --- |
| GR-001 | Dates must make sense (end on/after start) |
| GR-002 | Numbers can't be negative or exceed the audience |
| GR-003 | Only a *submitted* campaign can be approved/rejected |
| GR-004 | Can't advance/submit until required fields are valid |
| GR-005 | Double-click can't submit an action twice |
| GR-006 | Only Administrators can approve/reject |

*(Full register lives in `Guardrails/Guardrails.md`.)*

---

## 5. Under the hood (technical audience, 5 min)

### Architecture at a glance
**Say:** "Classic split — a **React** front end and a **.NET Core Web API**,
talking over REST."
- **Frontend:** React 18 + React Router (`src/components/`), one API client
  (`src/services/api.js`), plain class-based CSS. Dev server on **:3000**.
- **Backend:** ASP.NET Core Web API (`src/api/`), thin controllers → services →
  in-memory store seeded from `SeedData.cs`. Runs on **:5000**.
- **Dev proxy:** `setupProxy.js` forwards `/api` from :3000 to :5000, so the two
  run independently without CORS pain.
- **Data model:** one contract (documented in `CLAUDE.md §6`) kept in sync across
  the JSON seed, C# models, and React.

### Request lifecycle (say while drawing/pointing)
> Browser → React page → `services/api.js` → `/api` proxy → ASP.NET controller →
> service (business logic) → in-memory data → JSON back → rendered on screen.

Mention: "If the backend is down, read-only screens **fall back to bundled JSON**
so the UI still renders — handy for demos."

### Things a technical audience will appreciate
- **Auth & roles** — a lightweight `AuthProvider` (`services/auth.js`); role
  drives UI **and** enforces GR-006 (Campaign Creator never sees approve/reject).
- **Shared audience code** — the segment criteria, the file-upload component, and
  the **reach formula** are shared between the User Segment screen and the
  campaign wizard, so the two never drift. The frontend reach estimate
  **mirrors** the backend formula, so previews equal stored values.
- **Guardrails** cited as `GR-###` in code, with a living register.
- **Tests:** `npm run test:ci` (Jest + React Testing Library) and `dotnet test`
  (xUnit) — currently **32 frontend + 27 backend** passing.
- **State is in-memory** — created/edited data resets on backend restart (POC
  choice; swap the service for a DB later).

### How the app was built / evolved (optional, impressive)
- **CLAUDE.md** is the "instructor" file that keeps changes consistent.
- Larger changes were delivered with **agent teams** — parallel AI teammates each
  owning distinct files, then integrated and tested.
- The repo is **Devin-ready** (`IntegrateWithDevin/`) for autonomous
  feature/bug work.

---

## 6. Value talking points (sprinkle throughout)

- **Self-service:** marketers work independently — no spreadsheets, no dev tickets.
- **Guided & safe:** the wizard + guardrails prevent invalid campaigns.
- **Governed:** role-based approvals; an audit-friendly status lifecycle.
- **Consistent:** audiences and reach mean the same thing everywhere.
- **Measurable:** the dashboard closes the loop on performance.
- **Extensible:** clean layering + one data contract makes new fields/metrics easy.

---

## 7. Likely questions (Q&A prep)

| Question | Short answer |
| --- | --- |
| "Is the data real?" | No — sample/dummy data for the POC; in-memory, resets on restart. |
| "Where are users/passwords stored?" | Frontend demo accounts only (POC). Real auth would move to the API/identity provider. |
| "Can a Creator approve by any trick?" | UI hides it (GR-006) and GR-003 guards the transition server-side. |
| "How is reach calculated?" | Rules-based heuristic (`100000 × factor^rules`, AND 0.45 / OR 0.70), same on FE and BE. |
| "How do we add a field/metric?" | Update the data contract (CLAUDE.md §6), then model → seed → API → UI → tests. |
| "Is it tested?" | Yes — 32 frontend + 27 backend automated tests; both run in CI. |
| "Production-ready?" | It's a functional POC; next steps are a real database, real auth, and hardening. |

---

## 8. Reset & troubleshooting (keep handy)

- **Clean data mid-demo:** restart the backend (`Ctrl+C`, then `dotnet run …`).
- **"Port already in use":** something's already running — reuse it, or stop with
  `Get-Process node, MarketingApi | Stop-Process -Force`.
- **Approve/Reject missing:** you're signed in as **Campaign Creator** — that's
  expected (GR-006). Sign in as **Administrator** to show it.
- **Numbers look off after edits:** remember data is in-memory and resets on
  restart; that's by design for the POC.

---

## 9. Quick reference — screens & roles

| Screen | Purpose |
| --- | --- |
| **Login** | Sign in as Administrator or Campaign Creator |
| **Dashboard** | Performance: targeted, accepted, declined, unfinished |
| **Create campaign** | 4-step wizard: Setup → Segment → Location → Review |
| **Templates** | Start a campaign from a ready-made blueprint (pre-fills the wizard) |
| **Campaigns** | Status tabs + edit/clone/create |
| **User segment** | Build/manage reusable audiences from rules |
| **Approvals** *(admin-only)* | Approval queue — approve/reject (moved out of Campaigns) |

**Golden demo path (if you only have 10 minutes):**
Login (admin) → Dashboard → Create campaign (wizard) → Send for approval →
Campaigns → Approve → *(sign in as creator to show approval hidden)*.
