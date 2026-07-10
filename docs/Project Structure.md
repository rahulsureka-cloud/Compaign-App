# Project Structure — Marketing Campaign Management Tool

*A plain-language guide for business and end users. No technical background needed.*

---

## 1. What this application is about

The **Marketing Campaign Management Tool** is an online workspace for the
marketing team. Think of it as a control room where a marketer can plan the
promotions a company sends to its customers, watch how well those promotions are
doing, and decide exactly which groups of customers should receive them.

Everything happens in one place, in the browser, so a marketer does not need
spreadsheets, separate reporting tools, or help from a technical team to get
their day-to-day work done.

Access is meant for staff who have the **"Marketing"** permission in the admin
system — so only the right people can create, approve, and change campaigns. You
sign in on a **login page** first, and what you can do depends on your **role**
(see below).

In short: **it helps the marketing team run promotions and see whether those
promotions are working.**

---

## 2. What the application does

The tool covers these everyday marketing jobs:

0. **Sign in with your role.**
   You start on a login page. There are two kinds of users: an **Administrator**
   (full access — can also approve or reject campaigns) and a **Campaign
   Creator** (can use every screen and create campaigns, but cannot approve or
   reject them).

1. **Manage campaigns (the promotions themselves).**
   Create a new promotion with a guided step-by-step wizard, view all promotions
   grouped by their stage, edit one, or make a copy of one.

2. **Approve or reject campaigns.**
   Campaigns that someone has "sent for approval" wait in an approval queue. An
   approver can **Approve** (the campaign goes live) or **Reject** (it goes back
   to draft) — with a confirmation prompt so nothing happens by accident.

3. **See how campaigns are performing (the dashboard).**
   A single screen shows, at a glance, how many people were targeted and how
   they responded — who accepted the offer, who declined it, and who clicked but
   never finished.

4. **Build audiences (user segments).**
   Decide *who* should receive a promotion by grouping customers using simple
   rules — for example, "customers older than 25 who live in California." You can
   also upload your own list of customers.

Together these let a marketer answer the key questions: *What am I promoting?
Who should receive it? Is it approved? Is it working?*

---

## 3. Step-by-step: what you can do as an end user

Below is everything the application lets you do, described the way you would
actually use it on screen. No technical steps — just clicks.

### Signing in

- When you open the app you first see a **login page**. The **left side**
  summarises what the tool does; the **right side** is the sign-in card.
- Enter your **username** and **password** (a **Show** link reveals the
  password). For convenience there are **demo accounts** listed below the form —
  click one to fill the details automatically, then click **Sign in**:
  - **Administrator** (`admin`) — full access, including approve/reject.
  - **Campaign Creator** (`creator`) — all screens and create campaigns, but
    **no** approve/reject.
- After signing in you enter the app. Your name and role show at the top right,
  with a **Sign out** button.

### Getting around

- Once signed in you land on the **Dashboard**.
- On the **left side** is the **Marketing** menu, in this order:
  **Dashboard**, **Create campaign**, **Campaigns**, and **User segment**.
- Click any menu item to go to that screen. The bar at the top always reminds
  you where you are (for example, *Marketing › Campaigns*).

### A. View campaign performance — the Dashboard

1. Click **Dashboard** in the left menu.
2. At the top you see summary cards:
   - **Total Targeted Population** — how many people all your promotions reached.
   - **Accepted / Fulfilled** — how many took up the offer.
   - **Declined** — how many said no.
   - **Clicked but Unfinished** — how many started but did not complete.
   - Plus counts of **Active** and **Total** campaigns.
3. Below the cards is a **performance table**, one row per campaign, showing its
   status and the same accepted / declined / clicked numbers, with a small
   colored bar that visually splits the responses (green = accepted,
   red = declined, amber = clicked-but-unfinished).
4. Every campaign always shows real numbers, so the colored bars are never empty.
5. Use this screen any time you want a quick health-check of your marketing.

### B. See all your campaigns — the Campaigns screen

Click **Campaigns** in the left menu. This screen has two parts:

**"Awaiting your approval"** (top): a list of campaigns that have been sent for
approval, each with **Approve** and **Reject** buttons (see section E). *This
queue is only shown to **Administrators**; Campaign Creators don't see it.*

**"Campaigns"** (below): the full list, organised by **status tabs**:
- **In-progress** — being worked on / journey being defined.
- **Under approval** — waiting for an approver.
- **Draft** — saved but not submitted.
- **Active** — approved and running.
- **Completed** — finished.

Click a tab to see the campaigns in that stage. Each row shows the name, channel,
start/end dates, status, and actions: **✏️ Edit** and **Clone**. There is also a
**Create campaign** button.

### C. Create a new campaign (the 4-step wizard)

Click **Create campaign** (menu or button). A guided wizard walks you through
four steps shown as a progress bar at the top — **Setup → Segment → Location →
Review**. Use **Next** / **Back** to move between steps.

1. **Setup** — the campaign details:
   - **Campaign name** (required), optional **Description** and **Keywords**.
   - Optional **Product category** and **Priority**.
   - **Start date** and **End date**.
   - **Channel** — pick one or more delivery channels by clicking the cards:
     **In-app, Email, SMS, Social media, Ads** (a green tick marks the ones you
     chose).
2. **Segment** — who receives it:
   - Click **⊕ Add existing user segment** to pick audience groups from a popup.
   - Optionally **upload a user list** (CSV, XLS, XLSX). The tool reads the file
     and shows the **actual number of people in it** as "Manual upload users";
     uploading a different file replaces the previous one. (A sample file to try
     is provided with the project.)
   - The **Audience summary** on the right shows existing-segment users, manual
     upload users, and the estimated reach.
3. **Location** — where it appears: tick the **Web** and **Mobile** placements
   (e.g. Accounts-top banner, Dashboard banner).
4. **Review** — a summary of everything, grouped into Campaign details, Segment,
   and Location, each with an **✏️ edit** icon that jumps you back to that step.
   Finish with **Send for approval** (puts the campaign in the approval queue),
   or **Cancel** / **Back**.

*(Response numbers like targeted population and accepted/declined are filled in
automatically, so you don't enter them by hand.)*

**Built-in safeguards:** the **Next** and **Send for approval** buttons stay
greyed out until you've entered a campaign name, valid start/end dates (end on or
after start), and at least one channel. Action buttons (like Approve, Reject,
Clone) briefly disable while they're working so a double-click can't submit
twice.

### D. Edit an existing campaign

1. On the **Campaigns** screen, find the campaign and click its **✏️** icon.
2. The wizard opens, pre-filled with the current details.
3. Change whatever you need across the steps and save from the Review step.

### E. Approve or reject a campaign *(Administrators only)*

1. On the **Campaigns** screen, look at **"Awaiting your approval"**.
2. Click **Approve** or **Reject** on a campaign.
3. A **confirmation popup** appears — *"Are you sure you want to approve the
   campaign **[name]**?"* — with **No** / **Yes**.
4. Click **Yes** to confirm: **Approve** makes the campaign **Active**;
   **Reject** sends it back to **Draft**. Click **No** to cancel.

### F. Clone a campaign

On the **Campaigns** screen, click **Clone** on any row. A copy is created as a
new **Draft** named "… (Copy)", which you can then edit. Handy for reusing a
similar campaign.

### G. View your audiences — User segment list

1. Click **User segment** in the left menu.
2. You see a table of saved segments (audience groups) with their name,
   description, the rules that define them, and an **estimated reach** (roughly
   how many people fall into that group).
3. You can delete a segment here with the **trash can** button, or add a new one.

### H. Create a new user segment

1. Click **+ Add user segment**.
2. **Choose your list source** at the top:
   - **Existing customer list** — use customers already in the system, or
   - **New customer list** — upload your own file (CSV, XLS, or XLSX, up to 60 MB)
     by clicking **Select a file** or dropping it into the box.
3. The **Audience summary** on the right shows the estimated reach — how many
   people your selection covers.
4. **Review uploaded list** shows a preview table of the customers (name, age,
   state, date of birth) with a green check confirming each is valid.
5. **Name your segment** and add an optional description. You can also base it on
   an existing segment.
6. **Add the rules** that define who belongs in this audience:
   - Each **rule** has three parts: a **criteria** (e.g. Age, State), an
     **operator** (e.g. *is*, *greater than*), and a **value** (e.g. 25 or CA).
   - Click **⊕ Add rule** to add more conditions.
   - When you have more than one rule, choose the **match logic**:
     *Match ALL criteria (AND)* means every rule must be true;
     *Match ANY criteria (OR)* means any one rule is enough.
   - Example: *Age Greater than 25* **AND** *State is CA*.
   - Remove a rule with its **trash can** button.
7. Finish with one of the buttons at the bottom:
   - **Add new** — save this segment and clear the form to start another.
   - **Import** — save this segment and return to the segment list.
   - **Cancel** — discard and go back.

---

### Quick reference — the screens

| Screen | What you do there |
| --- | --- |
| **Login** | Sign in as Administrator or Campaign Creator (your role sets what you can do). |
| **Dashboard** | Check how campaigns are performing (targeted, accepted, declined, unfinished). |
| **Create campaign** | Add a new promotion via the 4-step wizard (Setup → Segment → Location → Review). |
| **Campaigns** | Approve/reject campaigns awaiting approval; browse campaigns by status; edit or clone them. |
| **User segment** | Build and manage audience groups; upload customer lists. |

That's the whole application from an everyday user's point of view: **plan a
promotion, choose who receives it, get it approved, and watch how it performs.**
