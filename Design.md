# FlowState --- Design System & Frontend Experience Specification

> **Product:** FlowState --- Execution OS\
> **Package:** `daily-tracker` v2.0.0\
> **Design direction:** Water-inspired blue, calm focus, visible
> execution\
> **Status:** Proposed design specification --- implementation must be
> reconciled with the existing codebase before changes.

------------------------------------------------------------------------

## 1. Product Design Intent

FlowState should feel like a calm, intelligent execution environment:
the clarity of a well-designed planner, the feedback of a personal
performance dashboard, and the progression of a lightweight RPG.

The interface must make three things immediately obvious:

1.  **What am I doing now?** --- current focus, active mission, next
    scheduled action.
2.  **What have I accomplished?** --- completed tasks, focus time,
    habits, streaks, XP and goal progress.
3.  **Where am I heading?** --- daily actions connected to monthly,
    strategic-cycle and yearly goals.

The product should not look like a generic admin dashboard, a copied
spreadsheet, or a game HUD covering every screen. The spreadsheet and
handwritten tracker references are inspiration for **visibility,
cadence, check-off satisfaction and trend awareness**---not a literal
layout to reproduce.

### Product promise

**Turn intention into action. See your progress. Stay in flow.**

### Design principles

-   Calm before decoration: blue surfaces and restrained contrast should
    support concentration.
-   Progress should be visible without requiring users to open multiple
    pages.
-   The next action should be more prominent than historical statistics.
-   Dense information belongs in structured tables, calendars and
    expandable sections---not in oversized cards.
-   Gamification should reinforce execution, not compete with it.
-   The same interaction language must work in the responsive web app
    and Electron desktop modes.
-   Every visual metric must have a defined calculation and a clear time
    range.
-   Accessibility, readable contrast, keyboard navigation and reduced
    motion are requirements.

------------------------------------------------------------------------

## 2. Reference Analysis

### 2.1 Presentation reference: `Srujan_Team_VARY.pptx.pdf`

The seven-page presentation uses a consistent visual language:

-   A pale mint / seafoam background.
-   Deep teal typography and section headings.
-   Thin teal divider lines under headings.
-   Large, light surfaces with restrained outlines.
-   Navy-blue panels for important labels and process headers.
-   Soft blue, lavender, pale green and warm cream accents.
-   Structured diagrams, clear hierarchy and generous whitespace.

The most useful references are:

-   **Page 1:** pale mint background, deep teal title, thin underline,
    large light information panel.
-   **Page 2:** dark navy emphasis labels, pale blue content area, clear
    information hierarchy.
-   **Page 3:** navy process header and grouped solution modules.
-   **Page 4:** strong navy table header, light blue-gray rows and
    restrained borders.
-   **Page 5:** modular architecture diagram with navy section header
    and pale panels.
-   **Page 6:** four clearly separated feasibility areas using muted
    pastel fills.

**What to carry into FlowState:** clean hierarchy, calm backgrounds,
dark blue anchors, thin dividers, structured information and controlled
use of accent colors.

**What not to copy:** presentation-style full-page mint backgrounds,
cartoon illustrations, oversized speech bubbles, dense explanatory
paragraphs, or the exact slide layouts. FlowState is an interactive
daily-use product and needs a more refined application interface.

### 2.2 Water-blue palette reference

The second supplied palette is a vertical four-band blue gradient. Its
approximate colors, sampled visually from the supplied image, are:

  ------------------------------------------------------------------------
  Role                               Approximate hex Intended use
  --------------------- ---------------------------- ---------------------
  Deep Ocean                               `#1D3A60` Primary dark
                                                     surfaces, sidebar,
                                                     headings

  Ocean Blue                               `#075B9A` Primary actions,
                                                     active navigation,
                                                     selected states

  Clear Water                              `#5BBEDB` Progress, charts,
                                                     highlights, focus
                                                     indicators

  Mist Aqua                                `#9BDDEB` Subtle backgrounds,
                                                     hover fills,
                                                     secondary progress
  ------------------------------------------------------------------------

These values are visual approximations, not extracted source-file color
values. Adjust them after checking contrast in the actual UI.

### 2.3 Unified direction

Use the PPT as the reference for **layout discipline and visual
hierarchy**; use the four-band blue palette as the reference for **brand
identity and interaction color**.

The resulting identity is:

**FlowState = Deep Ocean structure + Ocean Blue action + Clear Water
feedback + Mist Aqua atmosphere.**

A small amount of pale seafoam from the PPT can remain as a secondary
background tint, but the application should read as blue-first---not
mint-first.

------------------------------------------------------------------------

## 3. Color System

### 3.1 Core brand tokens

``` css
:root {
  /* Brand blues */
  --fs-ocean-950: #102B49;
  --fs-ocean-900: #1D3A60;
  --fs-ocean-800: #075B9A;
  --fs-ocean-700: #0877B8;
  --fs-water-500: #5BBEDB;
  --fs-water-300: #9BDDEB;

  /* Light surfaces */
  --fs-mist-50: #F5FBFD;
  --fs-mist-100: #EAF6FA;
  --fs-mist-200: #D8EEF4;
  --fs-seafoam-100: #E7F4F1;
  --fs-white: #FFFFFF;

  /* Text */
  --fs-text-primary: #142B40;
  --fs-text-secondary: #536B7E;
  --fs-text-muted: #7890A1;
  --fs-text-on-dark: #F5FBFF;

  /* Borders and states */
  --fs-border: #D5E4EB;
  --fs-border-strong: #A9C5D3;
  --fs-success: #23856D;
  --fs-warning: #C58A2A;
  --fs-danger: #C4515B;
  --fs-info: #1686B8;

  /* Elevation */
  --fs-shadow-soft: 0 8px 24px rgba(16, 43, 73, 0.07);
  --fs-shadow-pop: 0 14px 36px rgba(16, 43, 73, 0.13);
}
```

### 3.2 Color usage rules

-   `#1D3A60` is the primary dark brand anchor.
-   `#075B9A` is the primary interactive blue.
-   `#5BBEDB` is for meaningful progress and selected data
    visualization---not body text on white.
-   `#9BDDEB` is a soft supporting color, not a primary text color.
-   Use white and mist surfaces for most content areas.
-   Use deep ocean backgrounds selectively for sidebar, hero/focus
    panels and desktop widgets.
-   Keep success, warning and danger colors semantically distinct. Do
    not recolor them blue.
-   Never use the full four-color gradient as a background behind dense
    text.
-   Avoid low-contrast pale-blue text on white.
-   Validate WCAG AA contrast for text and controls. Use a darker blue
    variant for small text when needed.

### 3.3 Dark theme

Dark mode should be a first-class theme, not a simple inversion.

``` css
[data-theme="dark"] {
  --fs-bg: #0B1724;
  --fs-surface: #12263A;
  --fs-surface-raised: #18334D;
  --fs-border: #29465E;
  --fs-text-primary: #EAF5FB;
  --fs-text-secondary: #A9C1D1;
  --fs-text-muted: #7F9BAD;
  --fs-primary: #49A9D0;
  --fs-primary-strong: #1686B8;
  --fs-water-highlight: #78D2E8;
}
```

Dark theme should preserve the same information hierarchy, semantic
status colors and focus visibility.

------------------------------------------------------------------------

## 4. Typography, Shape and Motion

### Typography

Use a modern, highly readable sans-serif such as **Inter**, **Manrope**
or the project's already-installed equivalent. Do not add a font
dependency until the current typography stack has been inspected.

-   Page title: 26--32 px, semibold.
-   Section title: 16--20 px, semibold.
-   Body: 14--16 px.
-   Supporting metadata: 12--13 px.
-   Numeric KPI: 24--32 px, semibold.
-   Use tabular numerals for timers, dates, streaks and metrics.
-   Avoid all-caps for long labels.

### Shape language

-   Prefer crisp rectangular surfaces with 8--12 px corner radii.
-   Use 12--16 px radius only for prominent hero/focus surfaces.
-   Avoid excessive pill-shaped controls and oversized rounded cards.
-   Use thin borders and subtle shadows rather than glassmorphism
    everywhere.
-   Keep spacing consistent on a 4/8 px scale.

### Motion

-   Hover/focus transitions: 120--180 ms.
-   Panel transitions: 180--240 ms.
-   Progress animations: 300--500 ms, once per meaningful update.
-   No constant pulsing, floating particles or distracting background
    motion.
-   Respect `prefers-reduced-motion`.
-   Desktop ambient mode must prioritize low CPU/GPU use.

------------------------------------------------------------------------

## 5. Application Information Architecture

Preserve existing routes and working flows unless a code audit
demonstrates that a change is necessary. The target navigation should be
organized around execution rather than a long list of unrelated feature
pages.

### Primary navigation

1.  **Overview** --- today's execution and performance summary.
2.  **Schedule** --- calendar, time blocks and task planning.
3.  **Tasks** --- task inbox, priorities, statuses and filters.
4.  **Habits** --- daily/weekly habit tracker and streaks.
5.  **Goals** --- yearly, strategic-cycle, monthly and daily alignment.
6.  **Quests** --- RPG missions, bosses and character progression.
7.  **Analytics** --- execution history, trends and discipline metrics.
8.  **Codex** --- daily journal and retrospective notes.
9.  **AI Coach** --- evidence-grounded coaching.
10. **Settings** --- identity, theme, notifications and preferences.

Do not create duplicate pages if equivalent routes already exist. Map
existing features to this information architecture.

### Responsive navigation

-   Desktop: compact left sidebar, expandable/collapsible.
-   Tablet: icon rail or collapsible navigation.
-   Mobile: bottom navigation for the four most-used destinations
    (Overview, Schedule, Tasks, Profile/More), with remaining pages
    inside More.
-   Preserve quick task creation from every primary screen.

------------------------------------------------------------------------

## 6. Overview Dashboard --- the execution cockpit

The overview is the most important screen. It should answer "What am I
doing, what matters next, and how is today going?" within five seconds.

### Recommended layout

#### A. Header

-   Greeting and current date.
-   Compact day/week navigation.
-   Search or command action if the project already supports it.
-   Notification and profile controls.
-   Prominent `+ Add Task` action.

#### B. Today's execution summary

Use a horizontal KPI strip rather than a wall of cards:

-   Tasks completed / planned.
-   Focus time completed.
-   Habit completion.
-   Current streak.
-   XP earned today.

Every metric must show its period and denominator. Do not display
fabricated or placeholder metrics in production.

#### C. Current Focus --- primary visual anchor

A prominent but compact focus panel should show:

-   Current active task or mission.
-   Linked goal.
-   Priority and estimated duration.
-   Focus timer, if an actual timer exists.
-   Start / Pause / Complete actions as supported by the current
    implementation.
-   Next scheduled task.

If no task is active, show a useful empty state: "Choose your next
focus" with the highest-priority due task suggested. Never silently
start a timer or consume resources.

#### D. Today's schedule

Provide a time-based agenda with:

-   Time blocks.
-   Task title and status.
-   Priority indicator.
-   Estimated duration.
-   Overdue / upcoming labels.
-   Drag-and-drop only if the current architecture can persist and
    validate it reliably.

#### E. Habit tracker preview

Show a compact weekly matrix with habits as rows and weekdays as
columns. Each cell should be a real checkable completion state, not a
decorative icon.

Include:

-   Habit name.
-   Current streak.
-   Weekly completion ratio.
-   Today completion state.
-   Add/edit habit action.

#### F. Goal alignment

Show the top 2--3 active goals and how today's tasks contribute to them.
Include a small hierarchy breadcrumb,
e.g. `Yearly goal → Strategic cycle → Monthly goal`.

#### G. Execution highlights

Use an "Activity / Highlights" feed to show meaningful events:

-   Completed tasks.
-   Focus sessions.
-   Habits maintained.
-   Goal milestones.
-   XP earned and level progress.
-   Quests completed.
-   Tasks carried forward.

Each event must be derived from real application data. Avoid generic
congratulatory copy without an associated event.

#### H. AI Coach insight

Show at most one or two concise, evidence-grounded insights. Include the
measurement window and a link to the detailed AI Coach page. Clearly
label AI-generated recommendations.

------------------------------------------------------------------------

## 7. Task Scheduler and Habit Tracker

The supplied social-media references show spreadsheet and notebook
trackers with daily checkboxes, weekly columns, habit lists, completion
percentages and simple trend charts. FlowState should turn those ideas
into a usable interactive scheduler.

### 7.1 Scheduler views

Provide three synchronized views:

-   **Day:** time-blocked agenda and current execution.
-   **Week:** seven-day grid with tasks, habits and capacity.
-   **Month:** calendar overview with workload and completion
    indicators.

The view selector should be easy to switch without losing the selected
date.

### 7.2 Task model and lifecycle

First inspect the current task schema and service. Extend it compatibly;
do not replace the existing model without a migration plan.

The UI should distinguish:

-   `INBOX` --- captured, not scheduled.
-   `SCHEDULED` --- assigned to a date/time.
-   `IN_PROGRESS` --- actively being worked on.
-   `COMPLETED` --- completed once and timestamped.
-   `CARRIED_FORWARD` --- explicitly rescheduled from an earlier date.
-   `CANCELLED` --- intentionally removed.
-   `FAILED` --- explicitly failed under the product's quest rules.

If the existing schema uses different statuses, create a documented
mapping rather than blindly renaming stored values.

Recommended task information:

-   Title and optional description.
-   Priority: High / Medium / Low.
-   Category.
-   Due date and optional scheduled time.
-   Estimated duration.
-   Actual duration, only if measured.
-   Linked goal.
-   Quest tier, if applicable.
-   Status.
-   Created, updated and completed timestamps.
-   Original due date and rollover history.

**Rollover rules:**

-   Never overwrite the original due date.
-   Ask or clearly allow the user to carry a task forward.
-   Preserve rollover count and timestamps.
-   Do not automatically convert overdue into failed.
-   Prevent repeated reward or HP events when task status is toggled.
-   Make timezone and date-only semantics explicit.

### 7.3 Weekly habit matrix

Create a compact, accessible matrix:

  Habit             Mon   Tue   Wed   Thu   Fri   Sat   Sun   Weekly
  ----------------- ----- ----- ----- ----- ----- ----- ----- --------
  Morning routine   ✓     ✓     ---   ✓     ✓     ---   ---   4/7
  Deep work         ✓     ---   ✓     ✓     ---   ✓     ---   4/7
  Reading           ✓     ✓     ✓     ---   ✓     ---   ✓     5/7

This is illustrative only. Actual habits and completion states must come
from the user's data.

Interactions:

-   Click/tap a cell to mark completion.
-   Provide accessible labels such as "Mark Reading complete for
    Tuesday".
-   Undo a completion with a clear confirmation or reversible action.
-   Show streak and weekly ratio without shaming missed days.
-   Support daily, selected weekdays and custom frequency if the data
    model supports them.
-   Do not treat rest days or non-scheduled days as failures.

### 7.4 Scheduler filters and controls

-   Today / This Week / This Month.
-   Priority.
-   Category.
-   Goal.
-   Status.
-   Search.
-   Show completed / hide completed.
-   Quick-add task.
-   Keyboard-accessible task creation.

### 7.5 Scheduler empty states

Examples:

-   "Your day is open. Choose one meaningful task to begin."
-   "No habits scheduled for this day."
-   "Nothing overdue. Your schedule is clear."

Empty states should include a relevant action and must not imply missing
data is zero performance.

------------------------------------------------------------------------

## 8. Make Progress and Achievements Visible

The user specifically wants clear highlights of what they are doing.
Build a consistent **Execution Highlights** language across Overview,
Schedule, Analytics and desktop modes.

### Highlight types

1.  **Now:** active task, focus session or current mission.
2.  **Next:** next scheduled commitment.
3.  **Completed:** tasks and habits finished today.
4.  **Momentum:** streaks and consistency trends.
5.  **Milestones:** goal progress, level-ups and quest completion.
6.  **Attention:** overdue tasks, schedule conflicts and at-risk goals.
7.  **Reflection:** Codex note or end-of-day review.

### Highlight design

-   Use a small semantic icon, concise label and timestamp.
-   Use blue for neutral progress; green for completed; amber for
    attention; red only for actual critical states.
-   Provide a details link to the source record.
-   Do not invent achievements, badges or streaks.
-   Avoid confetti for routine completion. Reserve celebration for
    meaningful milestones and make it dismissible.

### "What I did today" summary

At the end of the day, generate a deterministic summary from actual
records:

-   Tasks completed: `completed / planned`.
-   Habits completed: `completed / scheduled`.
-   Focus time: measured duration, if available.
-   XP gained: ledger-derived.
-   Goal contributions: actual linked progress.
-   Carry-forwards: count and titles.
-   Reflection: user's Codex note, if present.

Do not infer actual focus time from task duration estimates.

------------------------------------------------------------------------

## 9. RPG Layer: Integrate, Do Not Overwhelm

Keep the character, identity and quest systems, but make their visual
presence proportional to the task at hand.

### Overview

-   Compact level and XP progress.
-   HP / FP / EP shown as clearly labelled resources with tooltips.
-   Active archetype shown as a subtle identity marker.
-   Today's quest and next milestone.

### Character page

-   Full attribute breakdown.
-   XP and level history.
-   Attribute-point allocation.
-   Archetype passive effects and explanations.
-   Resource recovery rules.

### Quest page

-   Five documented tiers.
-   Boss quests for major objectives.
-   Clear reward and failure rules before acceptance.
-   Quest progress linked to tasks or goals where appropriate.

### Fairness rules

-   A single underlying completion event must not award XP multiple
    times.
-   Passive multipliers must be visible before a mission starts.
-   Users should be able to inspect why XP or resource changes occurred.
-   Do not penalize users for rest days or tasks they never accepted as
    quests.
-   Resource values must never be decorative; show their actual gameplay
    effect.

------------------------------------------------------------------------

## 10. Charts and Analytics

Use a consistent chart palette:

-   Deep Ocean for primary series.
-   Ocean Blue for secondary series.
-   Clear Water for progress series.
-   Mist Aqua for supporting fills.
-   Semantic green/amber/red for status only.

Recommended visualizations:

-   Weekly task completion trend.
-   Monthly completion trend.
-   Habit consistency matrix / heatmap.
-   Priority-wise completion.
-   Focus time trend, only if actual focus sessions are recorded.
-   Goal progress over time.
-   XP and level history.
-   Discipline components with metric definitions.

Every chart must have:

-   Clear title.
-   Time range.
-   Axis labels or understandable units.
-   Empty and loading states.
-   Tooltip or accessible data alternative.
-   Explanation of how the metric is calculated.

Avoid 3D charts, decorative gauges, excessive donuts and charts without
actionable meaning.

------------------------------------------------------------------------

## 11. Electron Desktop Modes

### Standard mode

-   Full responsive application.
-   Same navigation and core interactions as web.
-   Native title-bar and window controls should follow existing
    implementation.

### Mini Mode

Target footprint from existing documentation: approximately 380 × 600
px.

Show only:

-   Current date.
-   Today's completion summary.
-   Current focus task.
-   Start / pause / complete controls if supported.
-   Next task.
-   Compact habit check-off.
-   XP / level strip.

Do not attempt to render the full dashboard in the mini widget.

### Wallpaper / ambient mode

-   Preserve the existing screen-saver-level overlay concept only after
    validating its Windows behaviour.
-   Show a low-distraction agenda, next task, small progress strip and
    time.
-   Use a mostly opaque-enough surface for legibility while allowing
    restrained transparency.
-   Provide an obvious exit / hide control.
-   Test multi-monitor and display-scaling behaviour.
-   Avoid constant animation and high-frequency timers.
-   Never describe this mode as a literal Windows desktop wallpaper
    unless it is implemented as one.

### Shared behaviour

Web, standard Electron, Mini Mode and Wallpaper Mode must call the same
task/progression services. Do not duplicate XP, task-completion or
goal-aggregation rules in renderer-specific components.

------------------------------------------------------------------------

## 12. Component System

Create or consolidate reusable components only after inspecting the
current component library.

Suggested components:

``` text
components/
  layout/
    AppShell
    Sidebar
    MobileNavigation
    PageHeader

  dashboard/
    TodaySummary
    CurrentFocusPanel
    NextUpList
    ExecutionHighlights
    GoalAlignment
    AIInsight

  scheduler/
    SchedulerToolbar
    DayAgenda
    WeekGrid
    MonthCalendar
    TaskComposer
    TaskRow
    TaskDetailPanel
    HabitMatrix

  progress/
    MetricStrip
    ProgressBar
    StreakIndicator
    GoalProgress
    XPProgress
    ResourceMeter
    ActivityTimeline

  charts/
    CompletionTrend
    HabitHeatmap
    PriorityBreakdown
    GoalTrend

  shared/
    EmptyState
    LoadingState
    ErrorState
    ConfirmDialog
    AccessibleTooltip
```

Use the project's existing naming conventions and directory structure
where possible. Do not create a parallel component system.

### Interaction states

Every interactive component needs:

-   Default.
-   Hover.
-   Focus-visible.
-   Active / selected.
-   Disabled.
-   Loading.
-   Success.
-   Error.
-   Empty, where applicable.

------------------------------------------------------------------------

## 13. Accessibility and Responsive Requirements

-   Meet WCAG 2.2 AA where applicable.
-   Keyboard access to navigation, task actions, scheduler and dialogs.
-   Visible focus rings using a sufficiently dark water-blue.
-   Semantic HTML and correct heading hierarchy.
-   Accessible names for icon-only buttons.
-   Do not use color alone to communicate task status.
-   Maintain readable text at browser zoom 200%.
-   Avoid horizontal scrolling on mobile except for intentionally
    scrollable calendar/matrix regions with clear affordances.
-   Touch targets should be comfortably usable (aim for 44 × 44 CSS px).
-   Respect reduced-motion preferences.
-   Test light and dark themes independently.

------------------------------------------------------------------------

## 14. Technical Constraints and Non-Negotiable Rules

1.  Preserve the existing React 18, Electron 40, Firebase, Zustand and
    Context architecture unless source inspection demonstrates a
    concrete reason to change it.
2.  Do not migrate to another framework, database or state-management
    library as part of a visual refresh.
3.  Do not introduce a second task store or duplicate task source of
    truth.
4.  Do not break authentication, Firestore persistence, task rollover,
    goal aggregation, XP, identity perks, quest logic, AI fallback, tray
    behaviour or desktop modes.
5.  Do not expose Gemini API keys in browser or Electron renderer
    bundles.
6.  Do not trust frontend-only authorization. Verify Firestore Security
    Rules.
7.  Do not award progression directly from visual components. Use the
    canonical business logic.
8.  Do not create fake production metrics or placeholder completion
    data.
9.  Do not silently change existing persisted schemas. Use
    backward-compatible migration plans.
10. Keep existing working routes and URLs unless a route migration is
    explicitly planned.
11. Do not add large dependencies without demonstrating why they are
    needed.
12. Use the current project's lint, formatting and build conventions.
13. Keep the web and Electron UI consistent while respecting
    platform-specific constraints.
14. Document any feature that cannot be implemented safely within the
    current architecture.

------------------------------------------------------------------------

## 15. Definition of Done

The redesign is complete only when all relevant checks pass:

### Visual

-   Blue-first FlowState identity is consistent across all primary
    routes.
-   Dashboard has a clear current-focus area and visible execution
    highlights.
-   Scheduler supports the implemented day/week/month views.
-   Habit matrix uses persisted data and accessible interactions.
-   Light and dark themes are coherent.
-   Mobile, tablet and desktop layouts are usable.

### Functional

-   Task creation, editing, completion and rollover still work.
-   Original due dates and rollover history are preserved.
-   Goal progress recalculates correctly.
-   XP and resource events are not duplicated.
-   Habit completion persists and updates weekly summaries.
-   AI fallback continues to work.
-   Electron Mini Mode and ambient mode use shared data and business
    rules.

### Quality

-   No console errors introduced.
-   No broken routes.
-   No unauthorized cross-user data access.
-   Unit and integration tests cover changed domain logic.
-   Production build succeeds.
-   Electron packaging succeeds if desktop files were changed.
-   No unverified claims of passing tests.

### Final implementation report

Provide:

1.  Existing architecture discovered.
2.  Files changed and why.
3.  Screens/routes redesigned.
4.  Data-model changes and migration approach.
5.  New reusable components.
6.  Tests executed with actual results.
7.  Build and packaging results.
8.  Known limitations and deferred work.
9.  Before/after screenshots for major screens.

------------------------------------------------------------------------

# Appendix A --- Primary Implementation Prompt

Copy the prompt below into the coding agent operating on the actual
FlowState repository. Attach this `Design.md` and the PPT PDF / palette
image as visual references.

## PRIMARY PROMPT --- FLOWSTATE BLUE THEME, EXECUTION DASHBOARD & TASK SCHEDULER

You are acting as a senior product designer, frontend architect and
full-stack engineer. Your task is to transform the existing **FlowState
/ Execution OS (`daily-tracker` v2.0.0)** into a polished, cohesive,
water-blue productivity platform with a powerful task scheduler and
visible execution highlights.

### Mission

Redesign and improve the existing application---not a greenfield
replacement.

The product must make it effortless to understand:

-   What I am doing right now.
-   What I should do next.
-   What I have completed today and this week.
-   Which habits I am maintaining.
-   How daily tasks contribute to larger goals.
-   How my RPG character and progression reflect actual execution.

Use this `Design.md` as the design authority. Use the supplied MASTERY
presentation PDF for its visual hierarchy, structured layouts, navy
headers, pale surfaces and thin dividers. Use the supplied four-band
blue palette as the brand direction:

-   Deep Ocean `#1D3A60`
-   Ocean Blue `#075B9A`
-   Clear Water `#5BBEDB`
-   Mist Aqua `#9BDDEB`

The presentation's pale mint/seafoam and light panels may be used as
subtle supporting surfaces. The overall product must remain unmistakably
blue-first.

### Existing architecture to preserve

The documented application uses:

-   React 18 SPA.
-   Electron 40 Windows desktop application.
-   Firebase Authentication and Cloud Firestore.
-   Zustand stores for character, identity and quests.
-   React Context for application domains.
-   Existing task, goal, progression, analytics and AI services.
-   Gemini-based AI coach with deterministic fallback.
-   Standard, Mini and Wallpaper / ambient desktop modes.

Treat these as documented starting points, not verified facts. Inspect
the actual repository and establish the real architecture before
editing.

### Mandatory execution protocol

#### Phase 0 --- Repository reconnaissance (no implementation yet)

1.  Inspect the complete directory structure and package scripts.
2.  Read `package.json`, app entry points, routes, global styles,
    Tailwind/configuration files and existing design tokens.
3.  Inspect every relevant context, Zustand store, task/goal service,
    progression engine, analytics engine and AI service.
4.  Inspect Firestore initialization, rules, indexes and persisted
    schemas.
5.  Inspect Electron main process, preload bridge, IPC handlers, build
    scripts and installer configuration.
6.  Identify the existing task lifecycle, task rollover rules, priority
    weights, goal hierarchy and XP/resource event logic.
7.  Identify the actual component library and chart/calendar
    dependencies.
8.  Run the existing tests and production build before changes,
    recording real results.
9.  Identify missing files or discrepancies between the supplied
    documentation and actual source.

Create an audit report with: - Existing architecture. - Current routes
and user journeys. - Existing reusable components. - Confirmed
defects. - Potential risks requiring verification. - Exact files planned
for modification.

**Do not begin implementation until the baseline audit is complete. Do
not assume filenames or schemas from this prompt exist.**

#### Phase 1 --- Design system foundation

1.  Create or update the canonical design tokens from `Design.md`.
2.  Implement light and dark themes.
3.  Establish typography, spacing, border, radius, elevation and motion
    tokens.
4.  Create a consistent button, input, navigation, dialog, tooltip and
    surface system.
5.  Establish responsive app shell, sidebar and mobile navigation.
6.  Remove inconsistent legacy colors and styling only where safely
    covered by the new tokens.
7.  Keep accessibility and contrast in scope from the beginning.

Do not apply a large gradient to every screen. Use Deep Ocean for
structure, Ocean Blue for actions, Clear Water for progress and Mist
Aqua for subtle supporting surfaces.

#### Phase 2 --- Overview dashboard redesign

Implement the execution cockpit described in `Design.md`.

Required sections:

1.  Greeting and date header.
2.  Today's execution KPI strip.
3.  Current Focus panel.
4.  Next Up / upcoming schedule.
5.  Today's time-blocked agenda.
6.  Weekly habit tracker preview.
7.  Goal alignment.
8.  Execution Highlights / activity timeline.
9.  One or two evidence-grounded AI Coach insights.
10. Compact character XP and resource summary.

Prioritize the current task and next action over decorative statistics.
All values must come from actual application state and persisted
records.

#### Phase 3 --- Task scheduler

Build or improve a complete scheduler using the existing data model
wherever possible.

Required views:

-   Day agenda.
-   Week grid.
-   Month calendar.

Required capabilities:

-   Create, edit, view, complete and cancel tasks.
-   Priority and category.
-   Due date and optional scheduled time.
-   Estimated duration.
-   Goal linkage.
-   Quest linkage where supported.
-   Status and completion timestamp.
-   Search and filters.
-   Clear overdue indicators.
-   Explicit carry-forward workflow.
-   Responsive mobile interaction.

Do not silently overwrite original due dates during rollover. Preserve
history and make timezone behaviour explicit.

Do not implement drag-and-drop unless it can be persisted safely and
tested.

#### Phase 4 --- Habit tracker

Create a weekly habit matrix inspired by the supplied spreadsheet and
handwritten tracker references.

It should include:

-   Habits as rows.
-   Weekdays as columns.
-   Persisted checkable completion cells.
-   Weekly completion ratio.
-   Current streak.
-   Scheduled frequency.
-   Add/edit habit actions.
-   Accessible keyboard and touch interactions.

Reuse an existing habit model if available. If a new model is required,
propose the schema and migration before changing persisted data. Do not
use task records as habits unless the current architecture intentionally
models them that way.

#### Phase 5 --- Execution highlights and progression integration

Integrate real events from:

-   Task completions.
-   Habit completions.
-   Focus sessions, if implemented.
-   XP gains.
-   Quest completions.
-   Goal milestones.
-   Carry-forward events.
-   Level-ups.

Every event must have a canonical source and timestamp.

Do not duplicate XP or HP events when the same task is updated
repeatedly. Do not move business rules into React components. Use the
existing progression engine or a clearly justified domain service.

Keep the RPG visual layer compact on the dashboard and richer on
dedicated character/quest pages.

#### Phase 6 --- Analytics and AI Coach

Improve charts and metrics using actual persisted data.

-   Define all denominators and date windows.
-   Handle zero-task days and insufficient history.
-   Distinguish estimates from measured focus time.
-   Keep journal content private and avoid sending it to AI unless
    explicitly permitted.
-   Label AI recommendations separately from measured facts.
-   Keep Gemini credentials out of client bundles.
-   Preserve deterministic fallback behaviour.
-   AI suggestions must never modify tasks, goals or RPG state without
    explicit user confirmation.

#### Phase 7 --- Electron adaptation

Adapt the redesigned experience to:

-   Standard desktop mode.
-   Approximately 380 × 600 Mini Mode.
-   Existing Wallpaper / ambient overlay mode.

Use the same underlying data and business logic as the web application.
Keep Mini Mode focused on current task, next task, today's progress and
quick habit actions.

Verify Electron security configuration and test multi-monitor behaviour
if the relevant files are changed. Avoid high-frequency rendering or
expensive ambient animation.

#### Phase 8 --- Verification and delivery

Run:

-   Existing test suite.
-   New tests for modified task and progression rules.
-   Scheduler and habit persistence tests.
-   Goal aggregation tests.
-   Authorization tests where a Firebase emulator or test environment
    exists.
-   Responsive UI checks.
-   Production web build.
-   Electron packaging if desktop code was changed.

Do not report a test as passing unless it was actually executed.

### Required engineering safeguards

-   No framework or database migration.
-   No wholesale rewrite.
-   No duplicate state stores.
-   No mock production data.
-   No hardcoded user-specific metrics.
-   No frontend-only security assumptions.
-   No exposed API keys.
-   No destructive schema changes without migration.
-   No removal of existing working features.
-   No fabricated test results.
-   No speculative dependency installation.
-   No separate business logic for web and Electron.

### Required deliverables

1.  Updated `Design.md` only if implementation reveals necessary
    corrections; preserve the approved design direction.
2.  Updated application UI and responsive layouts.
3.  Functional scheduler and habit tracker.
4.  Execution Highlights integrated with real data.
5.  Shared theme tokens and reusable components.
6.  Any necessary backward-compatible database migration.
7.  Tests and build evidence.
8.  A detailed final implementation report.
9.  Screenshots of Overview, Scheduler, Habit Tracker, Analytics, Mini
    Mode and mobile layout.

### Working method

Work in small, reviewable phases. After each phase:

-   Summarize files changed.
-   Explain implementation decisions.
-   Run relevant tests.
-   Report actual failures.
-   Stop if a change requires an unapproved data migration or changes
    established progression semantics.

Do not claim the work is complete merely because the UI renders. The
result must be visually coherent, functionally connected to real data,
responsive, secure within the existing architecture and verifiably
buildable.

**Final quality bar:** FlowState should feel like a premium
water-inspired execution environment---not a generic dashboard, not a
spreadsheet clone and not a game-themed to-do list. It should make the
user's present action, daily momentum and long-term direction
unmistakably visible.
