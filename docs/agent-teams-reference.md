# Agent Teams — Master Reference Guide

> Source: <https://code.claude.com/docs/en/agent-teams> (Claude Code v2.1.178+).
> This guide is the team's canonical reference for building **better, more
> effective agent teams** in this project. Read it before spawning teammates.

---

## 1. What agent teams are

Agent teams coordinate **multiple Claude Code instances** working together:

- **One session is the lead** — it coordinates work, assigns tasks, and
  synthesizes results.
- **Teammates** are separate Claude Code instances, each with its **own context
  window**, working independently.
- Unlike subagents, teammates **communicate directly with each other** and share
  a task list — and you can message any teammate directly, not just via the lead.

### Subagents vs. agent teams

|                | Subagents                                   | Agent teams                                    |
| -------------- | ------------------------------------------- | ---------------------------------------------- |
| Context        | Own context; result returns to caller       | Own context; fully independent                 |
| Communication  | Report back to main agent only              | Teammates message each other directly          |
| Coordination   | Main agent manages all work                 | Shared task list, self-coordination            |
| Best for       | Focused tasks where only the result matters | Complex work needing discussion & collaboration|
| Token cost     | Lower (results summarized back)             | Higher (each teammate is a full instance)      |

**Rule of thumb:** subagents when a worker just needs to report back; agent
teams when workers need to share findings, challenge each other, and coordinate.

---

## 2. Enabling agent teams

Disabled by default. Enable via the `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`
environment variable set to `1`, in the shell or in `settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

✅ In **this project** it is already enabled in `.claude/settings.local.json`.

Without the variable: no team is set up, no team directories are written, and
Claude will not spawn or propose teammates.

---

## 3. When to use a team (and when not to)

**Strong use cases** — parallel exploration adds real value:

- **Research & review** — teammates investigate different aspects, then share
  and challenge findings.
- **New modules/features** — each teammate owns a separate piece.
- **Debugging competing hypotheses** — teammates test different theories in
  parallel and converge faster.
- **Cross-layer coordination** — frontend / backend / tests each owned by a
  different teammate. *(This is the most common fit for this project.)*

**Avoid teams for:** sequential tasks, same-file edits, or work with many
dependencies. There, a single session or subagents are more effective. Teams add
coordination overhead and use significantly more tokens.

---

## 4. Starting and controlling a team

Describe the task and the teammates you want in natural language; the lead spawns
them and coordinates. Example:

```text
I'm designing a CLI tool that tracks TODO comments across a codebase.
Spawn three teammates to explore from different angles: one on UX, one on
technical architecture, one playing devil's advocate.
```

**Agent panel (in-process mode):**
- Up/Down arrows — select a teammate
- Enter — open that teammate's transcript and message it directly
- Escape — interrupt the selected teammate's turn
- `x` — stop the selected teammate
- Ctrl+T — toggle the task list

Idle teammate rows hide after 30s and reappear on the next turn (still running).

### Specify count and models

```text
Spawn 4 teammates to refactor these modules in parallel. Use Sonnet for each.
```

Teammates don't inherit the lead's `/model` by default — set **Default teammate
model** in `/config` (or "Default (leader's model)" to follow the lead). As of
v2.1.186 teammates inherit the lead's effort level.

### Require plan approval (for risky work)

```text
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

The teammate works in read-only plan mode, submits a plan, and only implements
after the lead approves. Influence the lead's judgment with criteria, e.g.
"only approve plans that include test coverage."

### Assign & claim tasks

Shared task list with states **pending → in progress → completed**, plus
dependencies (a task blocked by unresolved deps can't be claimed). The lead can
assign explicitly, or teammates self-claim the next unblocked task. File locking
prevents claim races.

### Shut down a teammate

```text
Ask the researcher teammate to shut down
```

The teammate can approve (exit gracefully) or reject with a reason. Team
directories clean up automatically when the session ends.

---

## 5. Display modes

- **in-process** (default) — all teammates run in the main terminal; works in any
  terminal, no setup.
- **split panes** — each teammate gets a pane; requires **tmux** or **iTerm2 +
  `it2` CLI**.

Set globally in `~/.claude/settings.json`:

```json
{ "teammateMode": "auto" }
```

Or per session: `claude --teammate-mode auto`. Options: `in-process`, `auto`,
`tmux`, `iterm2`.

> ⚠️ **On this project's environment (Windows + VS Code integrated terminal),
> split-pane mode is NOT supported.** Use the default `in-process` mode.

---

## 6. How teams work (architecture)

| Component  | Role                                                             |
| ---------- | --------------------------------------------------------------- |
| Team lead  | Main session; spawns teammates and coordinates                  |
| Teammates  | Separate Claude Code instances working on assigned tasks        |
| Task list  | Shared work items teammates claim and complete                  |
| Mailbox    | Messaging system between agents                                 |

- Stored under a session-derived name `session-<first 8 chars of session id>`:
  - Team config: `~/.claude/teams/{team-name}/config.json`
  - Task list: `~/.claude/tasks/{team-name}/`
- Team config is removed when the session ends; the task list persists (governed
  by `cleanupPeriodDays`). **Don't hand-edit or pre-author the team config** —
  it holds runtime state and is overwritten.
- **Context:** each teammate loads project context (CLAUDE.md, MCP servers,
  skills) + the spawn prompt. The lead's conversation history does **not** carry
  over — put needed detail in the spawn prompt.

### Reuse subagent definitions as teammates

Reference a subagent type by name when spawning:

```text
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

The teammate honors that definition's `tools` allowlist and `model`; its body is
appended to the system prompt. Coordination tools (`SendMessage`, task tools) are
always available. Note: `skills` and `mcpServers` frontmatter are **not** applied
to teammates (they load from project/user settings instead).

### Permissions

Teammates start with the lead's permission mode. Permission prompts bubble up to
the lead — approve them there. A teammate can't approve prompts or relay consent
on your behalf; relayed approval claims are treated as untrusted.

---

## 7. Quality gates via hooks

- `TeammateIdle` — runs when a teammate is about to go idle; exit code 2 sends
  feedback and keeps it working.
- `TaskCreated` — exit code 2 prevents creation and sends feedback.
- `TaskCompleted` — exit code 2 prevents completion and sends feedback.

Use these to enforce rules like "tests must pass before a task is completed."

---

## 8. Best practices (checklist)

- **Give enough context** in the spawn prompt (teammates don't inherit chat
  history). Include file paths, constraints, and the expected deliverable.
- **Team size 3–5** for most workflows; 5–6 tasks per teammate. Three focused
  teammates beat five scattered ones.
- **Size tasks right** — self-contained units with a clear deliverable (a
  function, a test file, a review). Too small = overhead; too large = wasted
  effort.
- **Avoid file conflicts** — give each teammate a distinct set of files.
- **Wait for teammates** — if the lead starts doing the work itself, tell it:
  "Wait for your teammates to complete their tasks before proceeding."
- **Monitor & steer** — check progress, redirect, synthesize as results arrive.
- **Start with research/review** — clear boundaries, no parallel-write conflicts.

---

## 9. Recommended team recipes for THIS project

The Marketing Campaign Management Tool has three natural, file-isolated layers,
which map cleanly onto teammates.

**Recipe A — Cross-layer feature (e.g. add a new campaign field):**
```text
Spawn 3 teammates, each owning a distinct file set, to add the <field> field:
- "backend": edit only src/api/ (Model, DTO, Service, Data seed) + src/api.Tests/
- "frontend": edit only src/components/Campaigns/ and src/services/ + src/styles/
- "data": edit only src/data/*.json to keep dummy data consistent
Keep the data contract in CLAUDE.md §6 as the source of truth. Wait for all
three, then run npm test and dotnet test and report results.
```

**Recipe B — Parallel review before shipping:**
```text
Spawn 3 teammates to review the current diff:
- one on correctness/CRUD integrity
- one on the FE/BE data-contract consistency (CLAUDE.md §6)
- one on test coverage
Have them report findings; lead synthesizes.
```

**Recipe C — Debugging (dashboard numbers wrong):**
```text
Spawn 3 teammates with competing hypotheses about why dashboard metrics are off
(data seed vs. aggregation service vs. frontend rendering). Have them challenge
each other and update a findings note with the consensus root cause.
```

Always keep teammates on **in-process** mode here, keep file boundaries strict,
and let the lead run the final `npm test` / `dotnet test`.

---

## 10. Limitations to remember

- **No session resumption with in-process teammates** — `/resume` and `/rewind`
  don't restore them; spawn new ones if needed.
- **Task status can lag** — teammates sometimes fail to mark tasks complete,
  blocking dependents; nudge or update manually.
- **Shutdown can be slow** — teammates finish the current tool call first.
- **One team per session**, **no nested teams** (teammates can't spawn teammates),
  **lead is fixed** for the session, **permissions set at spawn**.
- **Split panes need tmux/iTerm2** — not supported in VS Code terminal, Windows
  Terminal, or Ghostty (so this project uses in-process).
