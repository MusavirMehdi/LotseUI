# LOTSE Implementation Plan (Stage 2)

## 1. Folder Structure
```text
src/
├── assets/          # SVG logo mark, icons
├── context/         # ChatContext.tsx, ThemeContext.tsx
├── hooks/           # useIntersectionObserver.ts, useTheme.ts, useChat.ts
├── styles/          # index.css (Tailwind v4 tokens, animations, custom variant dark)
├── pages/           # LandingPage.tsx, ChatPage.tsx
├── components/
│   ├── chat/       # ScreenFrame.tsx, GenieShowcase, GenieChatWindow, GenieHeader, GenieMessage, GenieInput, FullScreenChat
│   ├── layout/     # AnimatedBackground.tsx, Navbar.tsx, Footer.tsx, MobileMenu.tsx
│   └── sections/   # Hero.tsx, ThreeTrackOptions.tsx, Features.tsx, Architecture.tsx, Team.tsx, Testimonials.tsx, Faq.tsx
├── App.tsx          # Router configuration
└── main.tsx         # Entry point with Providers
```

## 2. Component Tree
- **App** (wrapped in `ThemeProvider` & `ChatProvider`)
  - **LandingPage (`/`)**
    1. `AnimatedBackground` (full-viewport ambient drifting blobs & color cycling palette)
    2. `Navbar` (logo mark, wordmark, 6 smooth-scroll links, theme toggle, sign in, mobile drawer)
    3. `Hero` (eyebrow, split typography heading, subtext, dual CTAs: "Start your journey" → `#showcase`, "Explore how it works" → `#features`)
    4. `Showcase` (`#showcase`) -> `ScreenFrame` (hardware bezel with animated light-blue border & monitor stand) -> `GenieChatWindow` (`mini` mode)
    5. `ThreeTrackOptions` (three guided tracks: Higher Education, Ausbildung, Skilled Employment with deterministic validation)
    6. `Features` (7-feature bento composition with custom SVG icons)
    7. `Architecture` (animated interactive system flow: Frontend, Backend, DB, AI, Rules Engine)
    8. `Team` (placeholder members with badges)
    9. `Testimonials` (clearly marked demo placeholders)
    10. `Faq` (accessible accordion)
    11. `Footer` (links, Educaro attribution, disclaimer)
  - **ChatPage (`/chat`)**
    - `FullScreenChat` -> `GenieChatWindow` (`full` mode) -> sidebar panel, `GenieHeader`, message history, `GenieInput`

## 3. Design Tokens (Tailwind v4)
Tailwind v4 is used via `@tailwindcss/vite`. Tokens are in `src/styles/index.css` using `@theme` and CSS variables, with class-based dark mode enabled by `@custom-variant dark (&:where(.dark, .dark *));`. No `tailwind.config.js` is created.

### Color Tokens (Real Hex Values)
- **Dark Mode (Default)**:
  - `--bg-base`: `#09090b` (Obsidian viewport base)
  - `--surface-card`: `#121215` (Card container surfaces)
  - `--surface-elevated`: `#27272a` (Pills, inputs, elevated tracks)
  - `--border-subtle`: `rgba(255, 255, 255, 0.08)` (Dividers & borders)
  - `--border-strong`: `rgba(255, 255, 255, 0.16)` (Hover outlines)
  - `--text-primary`: `#ffffff` (High-contrast titles & headings)
  - `--text-secondary`: `#a1a1aa` (Subtitles & body copy)
  - `--text-muted`: `#71717a` (Badges, tags, captions)
  - `--accent-brand`: `#3b82f6` (Primary action accent blue)
  - `--accent-glow`: `rgba(59, 130, 246, 0.18)` (Atmospheric radial glow)
- **Light Mode**:
  - `--bg-base`: `#fafafa`
  - `--surface-card`: `#ffffff`
  - `--surface-elevated`: `#f4f4f5`
  - `--border-subtle`: `rgba(0, 0, 0, 0.08)`
  - `--border-strong`: `rgba(0, 0, 0, 0.16)`
  - `--text-primary`: `#09090b`
  - `--text-secondary`: `#52525b`
  - `--text-muted`: `#71717a`
  - `--accent-brand`: `#2563eb`
  - `--accent-glow`: `rgba(37, 99, 235, 0.12)`

### Typography & Fonts
- **Fonts**: Loaded via Google Fonts (`Plus Jakarta Sans`, `Instrument Serif`, `JetBrains Mono`). Note: Marked in DESIGN.md as unverified against Visuvate's proprietary webfonts.
- **Section IDs & Navbar Mapping**:
  - `Home` → `#hero`
  - `Start` → `#showcase`
  - `Features` → `#features`
  - `Architecture` → `#architecture`
  - `Team` → `#team`
  - `FAQs` → `#faqs`

## 4. Theme Strategy
- Light default.
- Applied via `<html>` using an inline script in `index.html` reading `localStorage.getItem('lotse_theme') || 'light'` before first paint to eliminate flash-of-unstyled-theme (FOUT).
- `ThemeContext` provides `theme` and `toggleTheme()`, updating both the DOM class on `document.documentElement` and `localStorage`.

## 5. Chat State (`ChatProvider`)
Single provider above the router, synced with `sessionStorage`:
- **State Shape**:
  ```ts
  interface ChatState {
    messages: Array<{ id: string; sender: 'genie' | 'user'; text: string; timestamp: number }>;
    welcomePlayed: boolean;
    isTransitioning: boolean; // NOT persisted to sessionStorage
  }
  ```
- **Actions**: `triggerWelcomeMessage()`, `sendUserMessage(text: string)`, `startTransition()`, `resetChat()`.

## 6. Mini-to-Full Transition Approach (Stage 4 Note)
**Approach:** Fixed-overlay animation at app root.
1. The overlay lives at the app root, contains the real chat UI, locks scroll (`overflow: hidden` on body) while animating.
2. Animate the overlay from mini chat bounds to full viewport (`top: 0, left: 0, width: 100vw, height: 100vh`) over 450ms (`ease: [0.16, 1, 0.3, 1]`).
3. The overlay is removed only after `FullScreenChat` has mounted at `/chat`.
4. `isTransitioning` is purely transient in-memory state and is NOT persisted to `sessionStorage`.
**Main Risk:** Coordinate desynchronization if parent scrolls during trigger.
**Fallback:** Immediate router navigation with motion fade-in.

## 7. Welcome Message Trigger
An `IntersectionObserver` on `GenieShowcase` with `threshold: 0.35`. It fires once when visible:
```ts
if (entry.isIntersecting && !welcomePlayed) {
  triggerWelcomeMessage();
  observer.disconnect();
}
```

## 8. Build Order & Checklist
- [x] **Stage 1 & 2:** Design audit & plan adjustments.
- [ ] **Stage 3:** Vite + Tailwind v4 foundations, ThemeContext, Navbar (floating pill, smooth-scroll, mobile drawer, theme toggle) & Hero (eyebrow, split serif heading, subtext, dual CTAs, motion entrance).
- [ ] **Stage 4:** Implement `ChatContext`, `GenieShowcase`, `GenieChatWindow` (mini & full), fixed-expansion transition to `/chat`.
- [ ] **Stage 5:** Implement Features (7-card bento), Architecture diagram, Team, Testimonials, FAQs, Footer.
- [ ] **Stage 6:** Multi-viewport side-by-side verification (1440px, 768px, 390px), TypeScript check, production build.

## 9. Open Questions
*None at this stage; all product rules and visual constraints are clear.*
