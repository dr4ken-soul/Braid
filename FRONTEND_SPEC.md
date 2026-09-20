# Braid Frontend Specification

Status: approved design specification
Project: Braid
Product: multilingual insurance claims evidence reconciliation agent
Platform: ElevenLabs Agents
Primary audience: insurance claims operations and adjusters
Document purpose: implementation-ready frontend direction

## 1. Product definition

Braid turns a spoken insurance claim into an evidence-ready adjuster packet.

The agent receives a claimant account, extracts factual claim fields, compares them with policy requirements and repair records, identifies contradictions, and routes unresolved decisions to a human adjuster. Braid does not decide liability, coverage, settlement value, or payment.

The frontend must make three things immediately visible:

1. What the claimant said.
2. What the institution can verify.
3. What requires human judgment.

The interface must feel like a regulated case-control surface, not a voice toy, chatbot skin, or generic analytics dashboard.

## 2. Approved design decisions

### 2.1 Project Identity Fingerprint

| Axis | Decision |
| --- | --- |
| Hero composition | Split-screen |
| Typography character | Refined grotesk with compressed operational labels |
| Colour direction | Quiet premium neutral, executed through carbon, bone, and signal yellow |
| Background treatment | Technical grid and dot field |
| Rhythm | Editorial stagger |
| Motion personality | Subtle precision with controlled pinned transitions |

### 2.2 Design dials

| Dial | Value | Intent |
| --- | ---: | --- |
| DESIGN_VARIANCE | 5/10 | Structured evidence workspace with deliberate asymmetry |
| MOTION_INTENSITY | 4/10 | Motion explains relationships and state changes |
| VISUAL_DENSITY | 7/10 | High evidence density without dashboard clutter |

### 2.3 Approved gates

- Gate 1: Bento grid operational with bold brutalist character.
- Gate 2: Dual-pill split navigation.
- Gate 3A: Static but atmospheric page-wide treatment.
- Gate 3B: 2a mouse-tracked rotation plus 2c parallax depth layers.
- Gate 3C: GSAP pinned scroll.
- Gate 4: Barlow Condensed plus IBM Plex Mono.
- Gate 5: Carbon, bone, and signal yellow.
- Gate 6: Split-screen evidence braid hero.
- Gate 7: Approved evidence workflow section order.

## 3. Design principles

1. The transcript is not evidence until it has a source, confidence, and state.
2. Every contradiction must be explainable in plain language.
3. Yellow identifies active attention, not success.
4. Green means evidence was reconciled or a handoff was accepted.
5. Red means a guard failed or human review is required.
6. Motion must show relationships between spoken facts and structured evidence.
7. No waveform is the primary product visual.
8. No generic insurer logo, fake institution, or invented brand symbol.
9. Braid is rendered as text only in Version 1.
10. Never use hardcoded hex colours in JSX.
11. Do not use em dashes in interface copy, documentation, comments, or code strings.

## 4. Typography

Google Fonts import:

~~~css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
~~~

Root tokens:

~~~css
:root {
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'Barlow Condensed', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}
~~~

| Role | Family | Weight | Size | Line height | Tracking |
| --- | --- | ---: | ---: | ---: | ---: |
| Hero headline | Barlow Condensed | 700 | clamp(3.5rem, 9vw, 9rem) | 0.84 | -0.045em |
| Section headline | Barlow Condensed | 700 | clamp(2.25rem, 5vw, 5rem) | 0.88 | -0.03em |
| Panel title | Barlow Condensed | 600 | 1.5rem | 0.98 | -0.01em |
| Body copy | Barlow Condensed | 400 | 1.125rem | 1.2 | 0 |
| UI label | IBM Plex Mono | 500 | 0.6875rem | 1.2 | 0.08em |
| Evidence value | IBM Plex Mono | 500 | 0.8125rem | 1.35 | 0 |
| Case ID | IBM Plex Mono | 600 | 0.75rem | 1.2 | 0.03em |

Barlow Condensed is used for large readable statements and panel titles. IBM Plex Mono is reserved for machine-derived values, sources, identifiers, and timestamps.

## 5. Colour tokens

~~~css
:root {
  --bg-primary: #17191B;
  --bg-secondary: #222528;
  --bg-surface: #2B2F31;
  --bg-elevated: #34393B;

  --accent: #E8C547;
  --accent-hover: #F2D66B;
  --accent-glow: rgba(232, 197, 71, 0.14);

  --text-primary: #F0EEE7;
  --text-secondary: #B8BAB2;
  --text-muted: #787D7A;

  --border-subtle: rgba(240, 238, 231, 0.08);
  --border-default: rgba(240, 238, 231, 0.15);

  --success: #8CB58C;
  --error: #D16C62;
  --warning: #E8C547;
  --info: #8FAFBA;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-xl: 22px;

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.18);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.24);
  --shadow-lg: 0 20px 56px rgba(0, 0, 0, 0.30);

  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 650ms;
}
~~~

Core Tailwind classes:

~~~text
Page:       bg-[var(--bg-primary)] text-[var(--text-primary)]
Surface:    bg-[var(--bg-surface)] border border-[var(--border-default)]
Elevated:   bg-[var(--bg-elevated)]
Accent:     bg-[var(--accent)] text-[var(--bg-primary)]
Success:    bg-[color:var(--success)/0.16] text-[var(--success)]
Error:      bg-[color:var(--error)/0.16] text-[var(--error)]
Focus:      ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)]
~~~

Rules:

- Never use pure black or pure white.
- Signal yellow is not a success colour. It means active, unresolved, or primary action.
- Do not add purple or blue AI effects.
- Do not use gradients on the hero headline.
- Do not create a decorative glow around ordinary panels.

## 6. Global layout

Page shell:

~~~text
min-h-screen overflow-x-clip bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased
~~~

Main container:

~~~text
mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16
~~~

Section spacing:

~~~text
py-24 sm:py-32 lg:py-40
~~~

Primary panel:

~~~text
relative overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-7 lg:p-8
~~~

The primary grid uses a 12-column CSS Grid, not Flexbox as its top-level composition.

~~~text
grid grid-cols-1 gap-px bg-[var(--border-default)] md:grid-cols-12
~~~

## 7. Z-index contract

~~~text
z-0       page background
z-10      technical grid and noise texture
z-20      section content
z-30      evidence relationship lines
z-40      3D evidence layers
z-50      dual-pill navigation
z-[60]    tooltips and source popovers
z-[70]    handoff confirmation panel
z-[80]    transaction or call status interruption
~~~

No readable content may sit below z-20. The navigation must remain above the pinned hero content.

## 8. Noise and technical grid

Grid layer:

~~~text
pointer-events-none absolute inset-0 z-10 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(240,238,231,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(240,238,231,0.08)_1px,transparent_1px)] [background-size:48px_48px]
~~~

Noise layer:

~~~text
pointer-events-none absolute inset-0 z-10 opacity-[0.035]
~~~

Use the CSS-generated SVG turbulence texture from the approved implementation pattern. It must be a texture layer, not a visible illustration.

## 9. Navigation: dual-pill split

Desktop navigation wrapper:

~~~text
fixed left-0 right-0 top-0 z-50 flex items-start justify-between px-5 py-5 sm:px-8 lg:px-12 xl:px-16
~~~

Brand pill:

~~~text
inline-flex items-center rounded-full border border-[var(--border-default)] bg-[color:var(--bg-surface)/0.92] px-4 py-2.5 font-display text-xl font-semibold tracking-[-0.02em] text-[var(--text-primary)] backdrop-blur-md transition-colors duration-200 ease-out hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
~~~

The brand pill contains the text Braid only. No logo mark is required.

Action pill:

~~~text
flex items-center gap-1 rounded-full border border-[var(--border-default)] bg-[color:var(--bg-surface)/0.92] p-1.5 backdrop-blur-md
~~~

Navigation link:

~~~text
rounded-full px-3 py-2 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[var(--text-secondary)] transition-colors duration-200 ease-out hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
~~~

Primary nav action:

~~~text
rounded-full bg-[var(--accent)] px-4 py-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-colors duration-200 ease-out hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
~~~

Mobile navigation:

~~~text
fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-2xl border border-[var(--border-default)] bg-[color:var(--bg-surface)/0.96] p-2 backdrop-blur-md
~~~

On mobile, display Braid, the current section name, and one action. Do not compress all links into an unreadable row.

## 10. Hero: split-screen evidence braid

Hero wrapper:

~~~text
relative isolate min-h-[100svh] overflow-hidden border-b border-[var(--border-default)]
~~~

Hero grid:

~~~text
relative z-20 mx-auto grid min-h-[100svh] w-full max-w-[1440px] grid-cols-1 gap-px bg-[var(--border-default)] px-5 pb-8 pt-28 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:pt-32 xl:px-16
~~~

Left claim column:

~~~text
relative z-20 flex min-h-[34rem] flex-col justify-between bg-[var(--bg-primary)] p-6 sm:p-10 lg:min-h-[calc(100svh-8rem)] lg:p-12
~~~

Hero eyebrow:

~~~text
mb-8 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--accent)]
~~~

Hero headline:

~~~text
max-w-[8ch] font-display text-[clamp(3.5rem,9vw,9rem)] font-bold leading-[0.84] tracking-[-0.045em] text-[var(--text-primary)]
~~~

Hero body:

~~~text
mt-8 max-w-[28rem] font-display text-xl leading-[1.12] text-[var(--text-secondary)] sm:text-2xl
~~~

Case metadata row:

~~~text
mt-auto grid grid-cols-2 gap-px border border-[var(--border-default)] bg-[var(--border-default)]
~~~

Metadata cell:

~~~text
bg-[var(--bg-surface)] p-4
~~~

Metadata label:

~~~text
font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]
~~~

Metadata value:

~~~text
mt-2 font-mono text-xs font-medium text-[var(--text-primary)]
~~~

Hero action:

~~~text
mt-6 inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
~~~

Right evidence frame:

~~~text
relative z-20 min-h-[38rem] overflow-hidden bg-[var(--bg-secondary)] p-3 sm:min-h-[48rem] lg:min-h-[calc(100svh-8rem)] lg:p-5
~~~

Frame border:

~~~text
relative h-full min-h-[36rem] overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 sm:min-h-[44rem] sm:p-5
~~~

Transcript panel:

~~~text
absolute left-4 top-4 z-40 w-[min(19rem,calc(100%-2rem))] border border-[var(--border-default)] bg-[color:var(--bg-primary)/0.94] p-4 shadow-[var(--shadow-md)] backdrop-blur-sm sm:left-8 sm:top-8
~~~

Evidence panel:

~~~text
absolute bottom-4 right-4 z-40 w-[min(23rem,calc(100%-2rem))] border border-[var(--border-default)] bg-[color:var(--bg-elevated)/0.96] p-4 shadow-[var(--shadow-md)] backdrop-blur-sm sm:bottom-8 sm:right-8
~~~

Relationship rail:

~~~text
absolute left-1/2 top-0 z-30 h-full w-px -translate-x-1/2 bg-[color:var(--accent)/0.42]
~~~

The rail is a data relationship layer. It must not become a decorative divider.

## 11. Hero GSAP pinned sequence

Pinned region:

~~~text
relative min-h-[220vh]
~~~

Pinned frame:

~~~text
sticky top-0 z-20 flex min-h-screen items-center
~~~

GSAP configuration:

~~~text
pin: true
pinSpacing: true
scrub: 0.7
toggleActions: restart none none reset
start: top top
end: +=180%
ease: power2.inOut
~~~

Timeline states:

| Progress | Visible state | Motion |
| ---: | --- | --- |
| 0.00 to 0.32 | Voice record | Transcript opacity 1, evidence opacity 0.35, relationship rail width 0 |
| 0.32 to 0.62 | Evidence braid | Extracted facts translate from left to right by 64px, blur 8px to 0px |
| 0.62 to 0.84 | Contradiction | Contradiction marker scales from 0.8 to 1, accent changes to error token |
| 0.84 to 1.00 | Handoff ready | Adjuster panel translates from y 24px to 0, opacity 0 to 1 |

Exact motion values:

~~~text
evidence reveal initial: opacity 0, filter blur(8px), y 24px
evidence reveal final: opacity 1, filter blur(0px), y 0px
evidence reveal duration: 0.65s
evidence reveal ease: power2.out
contradiction scale: 0.8 to 1
contradiction duration: 0.35s
handoff duration: 0.55s
handoff ease: power3.out
~~~

The sequence must reverse when scrolling upward and restart when entering again. Never use a one-way play none none none configuration.

## 12. 3D parallax

The effect applies only to the evidence frame.

Frame perspective:

~~~text
relative [perspective:1200px]
~~~

Pointer-tracked wrapper:

~~~text
transform-gpu will-change-transform
~~~

Exact limits:

~~~text
rotateX: -2.5deg to 2.5deg
rotateY: -2.5deg to 2.5deg
translateZ background grid: 0px
translateZ transcript: 8px
translateZ evidence nodes: 14px
translateZ handoff panel: 18px
spring stiffness: 180
spring damping: 24
spring mass: 0.7
~~~

The pointer listener must be disabled below 768px and whenever prefers-reduced-motion: reduce is active.

## 13. Reusable scroll reveal

Every below-fold reveal must replay on scroll down and scroll up.

Preferred GSAP configuration:

~~~text
from: opacity 0, filter blur(10px), y 28px
to: opacity 1, filter blur(0px), y 0px
duration: 0.65s
ease: power3.out
stagger: 0.08s
toggleActions: restart none none reset
start: top 88%
end: top 52%
~~~

If using Framer Motion instead:

~~~text
initial: opacity 0, filter blur(10px), y 28px
whileInView: opacity 1, filter blur(0px), y 0px
viewport: once false, amount 0.1
transition: duration 0.65, ease [0.16, 1, 0.3, 1]
~~~

Never use once: true.

## 14. Section 2: workflow break

Job: educate.

Layout:

~~~text
relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-40 xl:px-16
~~~

Statement:

~~~text
max-w-[9ch] font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.86] tracking-[-0.04em] text-[var(--text-primary)]
~~~

Workflow strip:

~~~text
grid grid-cols-1 gap-px border border-[var(--border-default)] bg-[var(--border-default)] sm:grid-cols-5
~~~

Workflow node:

~~~text
min-h-36 bg-[var(--bg-surface)] p-4 transition-colors duration-200 ease-out hover:bg-[var(--bg-elevated)]
~~~

Show the actual handoffs without fabricated numbers. If elapsed-time data is unavailable, label it baseline required.

## 15. Section 3: case intake

Job: educate and demonstrate.

Layout:

~~~text
relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-px bg-[var(--border-default)] px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-12 xl:px-16
~~~

Transcript column:

~~~text
bg-[var(--bg-secondary)] p-6 sm:p-10 lg:min-h-[38rem] lg:p-12
~~~

Fact extraction column:

~~~text
bg-[var(--bg-surface)] p-6 sm:p-10 lg:min-h-[38rem] lg:p-12
~~~

Fact row:

~~~text
grid grid-cols-[1fr_auto] gap-4 border-b border-[var(--border-subtle)] py-4
~~~

Source badge:

~~~text
inline-flex items-center rounded-sm border border-[var(--border-default)] px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-[var(--text-secondary)]
~~~

## 16. Section 4: evidence braid

Job: demonstrate the differentiated mechanism.

Layout:

~~~text
relative z-20 mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-40 xl:px-16
~~~

Evidence layers:

~~~text
grid grid-cols-1 gap-px border border-[var(--border-default)] bg-[var(--border-default)] md:grid-cols-12
~~~

Layer placements:

~~~text
claimant account:    md:col-span-5 md:row-span-2
policy requirements: md:col-span-3
repair record:       md:col-span-4
system facts:        md:col-span-4
match summary:       md:col-span-3
~~~

Layer cell:

~~~text
relative min-h-44 bg-[var(--bg-surface)] p-5 transition-colors duration-200 ease-out hover:bg-[var(--bg-elevated)] hover:translate-y-[-2px]
~~~

Do not use a generic three-card feature row. Each layer must have a distinct data responsibility and size.

## 17. Section 5: contradiction desk

Job: compare and qualify.

Layout:

~~~text
relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-px bg-[var(--border-default)] px-5 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-12 xl:px-16
~~~

Primary contradiction card:

~~~text
min-h-[28rem] bg-[var(--bg-surface)] p-6 sm:p-10
~~~

Evidence comparison table:

~~~text
overflow-hidden border border-[var(--border-default)] bg-[var(--bg-secondary)]
~~~

Table row:

~~~text
grid grid-cols-[0.8fr_1fr_auto] gap-4 border-b border-[var(--border-subtle)] px-4 py-4 font-mono text-xs last:border-b-0
~~~

Risk state:

~~~text
inline-flex items-center rounded-sm border border-[var(--error)] bg-[color:var(--error)/0.14] px-2 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[var(--error)]
~~~

The contradiction message must say what differs, where the data came from, and why the agent cannot resolve it.

## 18. Section 6: human handoff

Job: convert evidence into a controlled institutional action.

Layout:

~~~text
relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:px-12 lg:py-40 xl:px-16
~~~

Handoff timeline:

~~~text
relative border-l border-[var(--border-default)] pl-6
~~~

Timeline item:

~~~text
relative pb-10 last:pb-0
~~~

Timeline marker:

~~~text
absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--accent)]
~~~

Primary handoff button:

~~~text
inline-flex min-h-14 w-full items-center justify-center rounded-md bg-[var(--accent)] px-5 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:cursor-not-allowed disabled:opacity-50
~~~

The button must remain disabled unless the case contains a transcript, extracted facts, source references, escalation reason, and human queue target.

## 19. Section 7: audit explorer

Job: reassure and prove.

Use a tabbed feature explorer. Tabs:

- Transcript
- Evidence
- Tool calls
- Policy sources
- Analysis

Tab list:

~~~text
flex flex-wrap gap-1 border-b border-[var(--border-default)] pb-2
~~~

Tab button:

~~~text
rounded-sm px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[var(--text-muted)] transition-colors duration-200 ease-out hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
~~~

Active tab:

~~~text
bg-[var(--accent)] text-[var(--bg-primary)]
~~~

The tool call tab must show request, response, timestamp, and result state. Never show a successful tool call without a recorded response.

## 20. Section 8: institutional integration

Job: reassure and explain.

Layout:

~~~text
relative z-20 mx-auto w-full max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32 xl:px-16
~~~

Architecture strip:

~~~text
grid grid-cols-1 gap-px border border-[var(--border-default)] bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-6
~~~

Node:

~~~text
min-h-40 bg-[var(--bg-surface)] p-5
~~~

Nodes:

~~~text
Caller / ElevenLabs Agent / Knowledge Base / Claims System / Adjuster Queue / Audit Store
~~~

Use inline SVG connectors only if they clarify direction. No third-party icon library is allowed. Text labels are sufficient.

## 21. Section 9: closing action

Job: convert.

Wrapper:

~~~text
relative z-20 mx-auto grid min-h-[42rem] w-full max-w-[1440px] place-items-center border-t border-[var(--border-default)] px-5 py-24 text-center sm:px-8 lg:px-12 lg:py-40 xl:px-16
~~~

Closing headline:

~~~text
max-w-[10ch] font-display text-[clamp(3.5rem,9vw,9rem)] font-bold leading-[0.84] tracking-[-0.045em] text-[var(--text-primary)]
~~~

Closing action:

~~~text
mt-10 inline-flex min-h-14 items-center justify-center rounded-md bg-[var(--accent)] px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--bg-primary)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]
~~~

Keep one conversion action throughout the page: Open a case.

## 22. Interaction states

Every data component must define:

- loading
- live
- stale
- unavailable
- empty
- error
- transcript processing
- evidence extracted
- contradiction found
- handoff pending
- handoff accepted
- handoff failed

Loading must use neutral skeleton blocks. Do not simulate voice activity with a fake waveform while no audio or transcript data exists.

## 23. Responsive behaviour

- Below 640px: one-column layout, no 3D pointer interaction, evidence layers stack by source priority.
- 640px to 1023px: two-column evidence layout where space permits, pinned scroll becomes a normal stacked sequence.
- 1024px and above: split-screen hero, 12-column evidence grid, pinned hero sequence.
- 1280px and above: full dual-pill navigation with independent brand and action clusters.

Mobile requirements:

- every interactive target is at least 44 by 44 pixels
- evidence rows expose source labels before values
- contradiction explanations are never hidden inside hover states
- the handoff action remains visible without horizontal scrolling
- pinned motion is disabled on touch devices
- focused content is never hidden under navigation

## 24. Accessibility

- Use semantic header, nav, main, section, article, aside, and footer landmarks.
- Give each section one unique heading.
- Provide a text transcript alongside any audio interaction.
- Do not communicate contradiction state through colour alone.
- Use aria-live="polite" for transcript updates.
- Use aria-live="assertive" only for handoff failure or critical call errors.
- Keep focus visible with the accent ring.
- Pause all non-essential animation when reduced motion is enabled.
- Make the pinned section keyboard navigable without requiring scroll.
- Never auto-escalate a case without an explicit configured rule and visible state.
- The 3D layer must be aria-hidden="true" with a nearby text explanation.

## 25. Global motion CSS

Scrollbar rules:

~~~css
html {
  scroll-behavior: smooth;
  scrollbar-width: none;
}

html::-webkit-scrollbar {
  display: none;
}
~~~

Reduced motion:

~~~css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
~~~

The static technical grid remains visible in reduced motion. The 3D frame becomes a flat frame. The pinned sequence becomes a normal three-state stacked layout.

## 26. Asset briefs

Braid does not require raster photography or video for Version 1. The product's proof is data and interaction.

| Asset | Type | Brief | Motion | Mood | Resolution | Tool | Hosting | Fallback |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Technical grid | CSS | Carbon field with low-contrast vertical and horizontal grid | None | Industrial, precise | Responsive | Code | CSS | Solid carbon field |
| Noise grain | CSS generated SVG | Fine monochrome grain at 3.5% opacity | None | Tactile, restrained | 256 by 256 tile | Code | Inline CSS | No grain |
| Evidence relationship rail | Inline SVG | Straight and branching connectors between transcript facts and evidence nodes | GSAP scrub, 0px to full path length | Analytical | viewBox 0 0 1200 900 | Code | Inline SVG | Source labels in text |
| Contradiction marker | Inline SVG | Small rectangular bracket around the conflicting field | Scale 0.8 to 1 on detected contradiction | Alerted, not decorative | viewBox 0 0 120 80 | Code | Inline SVG | Text error label |
| Case document preview | HTML or SVG | Abstract policy and repair record fields with no invented insurer mark | 3D depth only | Institutional | Responsive | Code | HTML or inline SVG | Text-only evidence rows |

No logo, sponsor mark, or insurer symbol is required. Ask for approval before adding one.

## 27. Composition recipe references

Use the following composition recipes as quality benchmarks:

- Split-screen for the hero and case intake.
- Architecture layers for evidence braid and institutional integration.
- Asymmetric bento grid for contradiction desk.
- Tabbed feature explorer for audit explorer.
- Stacked card reveal for the mobile evidence sequence.
- Framed portal hero for the hero frame boundary.

Do not reproduce the examples from those recipes. Use their structural discipline and implement Braid-specific content.

## 28. Component acceptance checklist

- Hero clearly shows spoken claim, structured evidence, and handoff state.
- Navigation uses two independent pills and no logo symbol.
- The pinned sequence reverses and replays on re-entry.
- The 3D effect is limited to the evidence frame.
- All scroll reveals replay whenever elements re-enter the viewport.
- All colour values come from tokens.
- No generic three-card feature row exists.
- No fake call waveform is used as the primary visual.
- Every contradiction has a source and explanation.
- The handoff action is disabled until required case data exists.
- Loading, stale, unavailable, empty, error, and handoff failure states exist.
- Reduced motion produces a functional flat layout.
- Every interaction has visible keyboard focus.
- No em dashes appear in the final specification or interface copy.

