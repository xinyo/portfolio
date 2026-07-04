---
version: alpha
name: Cloudflare
description: "An internet infrastructure platform anchored in a deep violet primary (#190041) on a dark indigo canvas (#14111F / #1D1930) for marketing and a clean pale canvas for the dashboard. The system reads as serious infrastructure with an approachable brand: the violet is calm and precise rather than loud, contrasting with the technical depth of the product. Dashboard typography uses Inter at functional sizes; marketing uses a custom display variant at bold weights. The violet represents focus, trust, and clarity — the product's core value propositions materialized as a single accent color used across every touchpoint with unwavering consistency."

colors:
  primary: "#190041"
  on-primary: "#FFFFFF"
  primary-hover: "#2B0A6A"
  secondary: "#7550E8"
  ink: "#1C1830"
  ink-muted: "#625D75"
  canvas: "#FDFDFF"
  surface-1: "#F7F5FC"
  surface-2: "#F1ECFA"
  border: "#938AAE"
  dark-bg: "#14111F"
  dark-surface: "#1D1930"
  dark-border: "#6D6780"
  dark-ink: "#EAE7F5"
  success: "#067647"
  danger: "#B42318"
  warning: "#9A6700"

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

Cloudflare sits at an interesting design intersection: infrastructure company with consumer-legible branding. The orange is everywhere — Cloudflare's orange is as distinctive as Stripe's blue or GitHub's dark. The dashboard (Workers, R2, D1, Pages, etc.) uses a clean white product surface where orange appears on the primary "Create" button, active navigation indicators, and status warnings (orange = "check this"). Marketing goes darker and more dramatic. The brand consistently communicates speed and protection through warm, energetic color.

## 2. Color System

- **Primary violet**: #190041 — the singular brand color; used for primary CTAs, active states, and the logo across all contexts
- **Secondary indigo**: #7550E8 — lighter violet for gradients, partner moments, and decorative accents
- **Dark marketing**: #14111F — very dark slate for dramatic marketing surfaces
- **Dashboard canvas**: #FDFDFF with very light gray surfaces — enterprise clarity
- **Warning**: #9A6700 for warnings (paired with the brand system) — a calm, on-brand signal
- **Danger**: #B42318 only for errors, keeping the system grounded and precise

## 3. Typography

Maison Neue (or Inter equivalent) — humanist grotesque at bold display weights for marketing. Dashboard uses Inter at smaller functional sizes. The documentation is extensive and uses a three-level hierarchy (H1/H2/H3) with monospace code blocks throughout.

## 4. Components & Patterns

- **Dashboard nav**: Left sidebar with product areas (Workers, Pages, D1, etc.), violet active indicator
- **Worker editor**: Code editor (Monaco-based), route configuration panel, logs panel
- **Analytics charts**: Traffic volume over time, geographic heatmap, violet-accented data points
- **Status badge**: Healthy (green) / Degraded (amber) / Error (red) — the product's three states
- **Zone selector**: Top-of-page domain switcher dropdown
- **Documentation**: Two-column layout with code examples, orange inline links

## 5. Spacing & Layout

Dashboard: 220px sidebar + content area, max 1200px. Workers editor: split-pane code/preview. Marketing: 1440px max, dramatic full-bleed sections with orange gradient moments.

## 6. Motion & Interaction

Dashboard is functional and fast — hover highlights, no animation. Worker logs stream in real-time. Deployments show progress with animated status. Marketing has scroll-triggered reveals. Overall: reliable infrastructure aesthetic, not flashy.

## Accessibility

### Contrast Ratios

- **Primary on background** (#190041 on #FDFDFF): strong contrast for brand moments
- **Text on background** (#1C1830 on #FDFDFF): passes AA and AAA
- **Muted on background** (#625D75 on #FDFDFF): passes AA

### Minimum Requirements

- **Touch target**: 44×44px minimum for all interactive elements
- **Focus indicator**: #190041 outline, 2px, 2px offset
- **Focus contrast**: 2.6:1 against #FFFFFF background

### Motion

- Respects `prefers-reduced-motion`: yes — all transitions and animations should be suppressed
- All transitions use `@media (prefers-reduced-motion: reduce)` guard

### Notes

- The deep primary #190041 is reserved for large decorative moments, icon fills, and brand emphasis rather than body text.
- Focus rings using the deep violet on pale backgrounds should be supplemented with a dark offset shadow (e.g. `0 0 0 2px #1C1830`) to make focus perceivable.
- On the dark marketing canvas, the violet remains legible and restrained — verify the ratio against the specific dark surface value used rather than assuming white-page values apply.
- Worker log streaming and deployment progress animations should be suppressed under `prefers-reduced-motion`; show static state instead.
