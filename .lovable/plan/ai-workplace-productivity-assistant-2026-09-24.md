# AI Workplace Productivity Assistant

## Goal
Build a polished, frontend-only productivity workspace that feels useful immediately on desktop and mobile. All generated content and saved preferences remain local to the browser.

## Interface
- Create a responsive app shell with a collapsible desktop sidebar and compact mobile navigation.
- Use a professional pink, white, and light-blue design system with crisp typography, rounded cards, subtle shadows, and restrained motion.
- Add the five requested views: Dashboard, Email Generator, Meeting Summarizer, Task Planner, and Settings.
- Keep the AI-review disclaimer visible throughout the workspace.

## Features
- **Dashboard:** Personalized welcome, productivity metrics, recent activity, and shortcuts into each tool.
- **Email Generator:** Recipient, subject, purpose, key points, tone selection, simulated loading, personalized editable output, Copy, and Clear.
- **Meeting Summarizer:** Notes input, simulated analysis, and editable Summary, Action Items, Decisions, and Deadlines.
- **Task Planner:** Daily/weekly mode, task creation with urgency and importance, local prioritization, and an editable schedule board.
- **Settings:** Editable local profile/preferences and reset controls.
- Add relevant empty states, loading feedback, validation, and toast confirmations.

## Technical Details
- Keep the experience entirely client-side with React state and localStorage; no accounts, database, or external requests.
- Reuse the existing design-system controls and Lucide icons.
- Add route-specific metadata for the single application route.
- Verify the complete experience in desktop and mobile-sized browser views, including the main generation and planning flows.
