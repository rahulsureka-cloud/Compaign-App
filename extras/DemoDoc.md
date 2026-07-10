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
  (xUnit) — currently **42 frontend + 27 backend** passing.
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
| "Is it tested?" | Yes — 42 frontend + 27 backend automated tests; both run in CI. |
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
| **Audit Trail** *(admin-only)* | Activity log — who signed in and what actions they performed, with timestamps |

**Golden demo path (if you only have 10 minutes):**
Login (admin) → Dashboard → Create campaign (wizard) → Send for approval →
Campaigns → Approve → *(sign in as creator to show approval hidden)*.

---

# Appendix — Sorting in the Audit Trail (developer guide)

*A self-contained explanation of how column sorting works on the Audit Trail
screen, aimed at any developer picking up the code. Everything lives in
[src/components/AuditTrail/AuditTrail.js](../src/components/AuditTrail/AuditTrail.js)
with styles in [src/styles/audit.css](../src/styles/audit.css); the underlying
data comes from [src/services/audit.js](../src/services/audit.js).*

## 1. The data being sorted
Each audit entry (from `getAuditLog()`) has this shape:
```js
{
  id: 'string',            // unique key
  timestamp: 'ISO string', // e.g. "2026-07-10T09:15:00.000Z"
  username: 'admin',
  name: 'Administrator',
  role: 'admin' | 'creator' | '—',
  action: 'Approve campaign',
  details: 'Premium Savings Cross-sell',
}
```
The component holds the raw list in `entries` state (newest-first, as returned by
the service). **Sorting never mutates `entries`** — it derives a sorted copy on
each render.

## 2. Column configuration
Columns are declared once as data, so headers and sort logic stay in sync. Each
column has a `key` (identity), a `label` (header text), and a `value(entry)`
function that returns the **comparable value** for that column:
```js
const COLUMNS = [
  { key: 'timestamp', label: 'Date & time', value: (e) => e.timestamp || '' },
  { key: 'user',      label: 'User',        value: (e) => (e.name || '').toLowerCase() },
  { key: 'role',      label: 'Role',        value: (e) => (e.role || '').toLowerCase() },
  { key: 'action',    label: 'Action',      value: (e) => (e.action || '').toLowerCase() },
  { key: 'details',   label: 'Details',     value: (e) => (e.details || '').toLowerCase() },
];
```
Notes:
- **Case-insensitive** text sort — `value()` lower-cases string fields so "alpha"
  and "Alpha" sort together.
- **Null-safe** — `|| ''` guards missing fields so the comparator never throws.
- The **User** column sorts by display `name` (not `username`); change the
  `value` fn if you want a different key.

## 3. Sort state
A single piece of state tracks the active column and direction:
```js
const [sort, setSort] = useState({ key: 'timestamp', dir: 'desc' });
```
Default is **timestamp descending** → newest activity first, matching how the log
is stored.

## 4. Toggling sort (header click)
```js
const toggleSort = (key) =>
  setSort((s) =>
    s.key === key
      ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }   // same column → flip
      : { key, dir: key === 'timestamp' ? 'desc' : 'asc' } // new column → sensible default
  );
```
- Click the **already-active** column → flips `asc ⇄ desc`.
- Click a **different** column → switches to it. Text columns default to `asc`
  (A→Z); the timestamp column defaults to `desc` (newest first), which is the
  more useful default for dates.

## 5. Producing the sorted rows
Sorting is a pure derivation in render — always consistent with `entries + sort`,
so there's no risk of a stale "sorted list" state:
```js
const col = COLUMNS.find((c) => c.key === sort.key) || COLUMNS[0];
const sorted = [...entries].sort((a, b) => {
  const av = col.value(a);
  const bv = col.value(b);
  if (av < bv) return sort.dir === 'asc' ? -1 : 1;
  if (av > bv) return sort.dir === 'asc' ? 1 : -1;
  return 0; // equal → keep relative order
});
```
- `[...entries]` copies first, so `Array.prototype.sort` (in-place) doesn't mutate
  React state.
- **Timestamps** are compared as **ISO-8601 strings**. ISO-8601 is designed so
  lexicographic order equals chronological order, so string comparison is correct
  and cheap — no `Date` parsing needed in the hot path.
- Equal values return `0`; V8's sort is stable, so ties keep their prior order.

## 6. Rendering sortable headers (with accessibility)
Headers are buttons so they're keyboard-focusable and screen-reader friendly, and
each `<th>` exposes `aria-sort`:
```jsx
<th aria-sort={sort.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
  <button type="button" className="th-sort" onClick={() => toggleSort(c.key)}>
    {c.label}{caret(c.key)}
  </button>
</th>
```
`caret(key)` appends ` ▲` / ` ▼` to the active column's label so users see the
current sort at a glance. `.th-sort` in `audit.css` makes the button inherit the
header font/colour and adds a pointer cursor + hover colour.

## 7. Interaction with Refresh / Clear
Sorting is **view-only** — it reorders whatever is currently in `entries`.
`Refresh` reloads `entries` from the service (`ensureAuditSeed()` +
`getAuditLog()`); the active `sort` is preserved across a refresh because it's
independent state. `Clear log` empties the data (and permanently, via the
service's cleared flag), after which there's simply nothing to sort.

## 8. How to add a new sortable column
1. Add a `{ key, label, value }` entry to `COLUMNS` (the `value` fn returns the
   comparable value — lower-case strings; return a number for numeric columns).
2. Add the matching `<td>` cell in the table body (the body still renders custom
   cells; only the header + comparator are data-driven).
That's it — the header, caret, `aria-sort`, and comparator all pick it up.

## 9. Edge cases & gotchas
- **Numeric columns:** don't sort numbers as strings ("10" < "9"). For a numeric
  column, have `value()` return a `Number` so the `<`/`>` comparison is numeric.
- **Mixed/undefined fields:** the `|| ''` (or `|| 0`) guard keeps comparisons
  total; missing values sort to one end consistently.
- **Locale-aware text:** the current compare uses default `<`/`>`. If you need
  locale/diacritic-aware ordering, switch to
  `String(av).localeCompare(String(bv))` inside the comparator.

## 10. Tests
See [src/components/__tests__/AuditTrail.test.js](../src/components/__tests__/AuditTrail.test.js):
- *"clicking a column header sorts the rows"* — clicks the **Action** header and
  asserts ascending then descending order of the first data row.
- *"after Clear log, Refresh does not bring the logs back"* — verifies the
  view-only nature of sorting alongside the permanent-clear behaviour.

## 11. Possible enhancements
- Persist the user's chosen sort (e.g. in `localStorage`).
- Multi-column sort (secondary tiebreaker).
- A dedicated numeric/day grouping, or server-side sorting if the log ever moves
  to a backend store.
