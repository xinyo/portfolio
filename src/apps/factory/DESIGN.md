---
version: alpha
name: Factory.app
description: "An internet infrastructure platform anchored in a deep violet primary token sourced from the shared shadcn theme system on a dark indigo canvas for marketing and a clean pale canvas for the dashboard. The system reads as serious infrastructure with an approachable brand: the violet is calm and precise rather than loud, contrasting with the technical depth of the product. Dashboard typography uses Inter at functional sizes; marketing uses a custom display variant at bold weights. The primary token represents focus, trust, and clarity — the product's core value propositions materialized as a single accent color used across every touchpoint with unwavering consistency."

colors:
  primary: "var(--primary)"
  on-primary: "var(--primary-foreground)"
  primary-hover: "var(--ring)"
  secondary: "var(--secondary)"
  ink: "var(--foreground)"
  ink-muted: "var(--muted-foreground)"
  canvas: "var(--background)"
  surface-1: "var(--card)"
  surface-2: "var(--muted)"
  border: "var(--border)"
  dark-bg: "var(--background)"
  dark-surface: "var(--card)"
  dark-border: "var(--border)"
  dark-ink: "var(--foreground)"
  success: "var(--chart-3)"
  danger: "var(--destructive)"
  warning: "var(--chart-1)"

typography:
  display:
    fontFamily: "Maison Neue, Inter, -apple-system, sans-serif"
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  body:
    fontFamily: "Maison Neue, Inter, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0

spacing:
  base: 8px
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96]

radius:
  sm: 4px
  md: 6px
  lg: 12px
  pill: 9999px

shadows:
  card: "0 1px 4px rgba(0,0,0,0.08)"
  elevated: "0 4px 16px rgba(0,0,0,0.12)"

motion:
  duration-fast: 100ms
  duration-base: 200ms
  easing: cubic-bezier(0.4, 0, 0.2, 1)
---

## Rationale

**Violet as focus, trust, and clarity** — #190041 encodes the product's core values into a single brand color. Deep violet feels composed and technical, supporting a calm sense of precision rather than spectacle. It signals confidence, control, and thoughtful execution across every interface moment.

**Using violet for signals, not just emphasis** — The dual assignment of violet to both "brand primary" and "warning state" is a deliberate constraint: it means alerts feel on-brand without becoming alarming, which is appropriate for infrastructure that should feel monitored and steady. Red remains reserved for actual errors.

**Clean pale dashboard, dramatic dark marketing** — The split between light product surfaces and dark marketing pages reflects different audiences. Engineers checking deployments need data clarity; prospective customers need to feel the product's scale and confidence. The two registers serve different conversion goals without visual contradiction.

**Minimal radius as infrastructure seriousness** — Cloudflare's 4–6px radius scale is less rounded than consumer products, signaling technical precision rather than consumer friendliness. This is calibrated for an audience of developers and DevOps engineers who associate very rounded UI with consumer apps and sharper edges with professional tools.

**Documentation-first architecture** — The emphasis on code blocks, two-column layouts, and inline links reflects that Cloudflare's product is primarily consumed through documentation and dashboards. Typography and spacing decisions prioritize reading long technical documents over impressing first-time visitors.

## 1. Visual Theme & Atmosphere

Cloudflare sits at an interesting design intersection: infrastructure company with consumer-legible branding. The primary violet token is everywhere — the shared shadcn `--primary` token is as distinctive as a strong brand accent should be. The dashboard uses the light-mode canvas and foreground tokens to keep product surfaces calm and readable, while marketing uses the darker surface tokens for a more dramatic presentation. The system consistently communicates focus and confidence through the shared color token set rather than through ad-hoc accent colors.

## 2. Color System

The colors in this app are intentionally sourced from the shared shadcn theme tokens in the theme stylesheet so the product and the factory experience stay visually aligned.

- **Primary**: `--primary` (#190041 in light mode, #D6BBFF in dark mode) — the singular brand color; used for primary CTAs, active states, and the logo across all contexts
- **Primary foreground**: `--primary-foreground` (#FFFFFF in light mode, #190041 in dark mode) — contrast color for primary surfaces
- **Secondary**: `--secondary` (#7550E8 in light mode, #C4B0FF in dark mode) — lighter violet for gradients, partner moments, and decorative accents
- **Background / canvas**: `--background` and `--bg` (#FFFFFF / #FDFDFF light, #0C0616 / #14111F dark) — used for the app shell and dashboard surfaces
- **Foreground / ink**: `--foreground` and `--text` (#1C1830 light, #EAE7F5 dark) — primary text color
- **Muted**: `--muted` / `--muted-foreground` — used for subdued surfaces and supporting content
- **Border**: `--border` / `--input` — used for structural separation and form controls
- **Warning**: `--warning` or the semantic warning token in the design system (#9A6700) — used sparingly for non-blocking alerts
- **Danger**: `--danger` or the semantic danger token (#B42318) — reserved for errors and destructive states

## 3. Typography

Maison Neue (or Inter equivalent) — humanist grotesque at bold display weights for marketing. Dashboard uses Inter at smaller functional sizes. The documentation is extensive and uses a three-level hierarchy (H1/H2/H3) with monospace code blocks throughout.

## 4. Components & Patterns

- **Dashboard nav**: Left sidebar with product areas (Workers, Pages, D1, etc.), active state driven by `--primary`
- **Worker editor**: Code editor (Monaco-based), route configuration panel, logs panel
- **Analytics charts**: Traffic volume over time, geographic heatmap, accent data points using `--chart-1` and `--chart-2`
- **Status badge**: Healthy (green) / Degraded (amber) / Error (red) — the product's three states, using semantic colors that pair with the shared token system
- **Zone selector**: Top-of-page domain switcher dropdown
- **Documentation**: Two-column layout with code examples, orange inline links

## 5. Spacing & Layout

Dashboard: 220px sidebar + content area, max 1200px. Workers editor: split-pane code/preview. Marketing: 1440px max, dramatic full-bleed sections with surface depth and `--accent` moments.

## 6. Motion & Interaction

Dashboard is functional and fast — hover highlights, no animation. Worker logs stream in real-time. Deployments show progress with animated status. Marketing has scroll-triggered reveals. Overall: reliable infrastructure aesthetic, not flashy.

## Accessibility

### Contrast Ratios

- **Primary on background** (light mode primary #190041 on light canvas): strong contrast for brand moments
- **Text on background** (light mode foreground #1C1830 on light canvas): passes AA and AAA
- **Muted on background** (light mode muted text #625D75 on light canvas): passes AA

### Minimum Requirements

- **Touch target**: 44×44px minimum for all interactive elements
- **Focus indicator**: `--primary` outline, 2px, 2px offset
- **Focus contrast**: sufficient against the current `--background` and `--foreground` pairings

### Motion

- Respects `prefers-reduced-motion`: yes — all transitions and animations should be suppressed
- All transitions use `@media (prefers-reduced-motion: reduce)` guard

### Notes

- The deep primary token is reserved for large decorative moments, icon fills, and brand emphasis rather than body text.
- Focus rings using the primary token should be supplemented with a dark offset shadow (e.g. `0 0 0 2px #1C1830`) to make focus perceivable on light surfaces.
- On the dark marketing canvas, the primary token is inverted to a lighter value for legibility — verify the ratio against the specific dark surface value used rather than assuming light-mode values apply.
- Worker log streaming and deployment progress animations should be suppressed under `prefers-reduced-motion`; show static state instead.
