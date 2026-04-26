---
name: portfolio-product
description: 'Build a portfolio website as a high-end product. Use when: creating or extending portfolio pages, building Hero sections, adding motion with GSAP, structuring Next.js components, writing Tailwind layout for cinematic/editorial style, connecting overview pages to detail pages. Stack: Next.js + Tailwind CSS + GSAP. Style: minimal, cinematic, strong typography.'
argument-hint: 'section or component to build (e.g. Hero, CasePreview, WorkPage)'
---

# Portfolio as a Product

## Philosophy

This is not a landing page. It is a product — designed with intention, paced like cinema, and judged by how it feels to navigate. Every decision (spacing, motion, type, structure) serves the experience. Less is more. Restraint is the craft.

## When to Use

- Creating a new page or section
- Adding or refining GSAP animations
- Structuring component architecture
- Applying typography, spacing, or layout decisions
- Connecting overview → detail navigation
- Reviewing if a component matches the visual language

---

## Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | Next.js (App Router) | File-based routing, `page.tsx` per route |
| Styling | Tailwind CSS | Utility-first, no CSS modules unless necessary |
| Motion | GSAP | Locally scoped, inside `useEffect` or `useGSAP` |
| Fonts | Variable or editorial fonts | Loaded via `next/font`, applied globally |

---

## Structure

```
app/
  page.tsx              ← Home: Hero + work previews
  work/
    page.tsx            ← Work index (optional)
    [slug]/
      page.tsx          ← Case detail page
components/
  layout/               ← Header, Footer, Nav
  sections/             ← Hero, WorkGrid, CaseIntro…
  ui/                   ← Button, Tag, Cursor, etc.
lib/
  gsap/                 ← GSAP helpers / plugin registration
  content/              ← Static data or CMS fetch helpers
```

---

## Page Architecture

### Home (`/`)

The entry point = cinematic overview.

1. **Hero** — full-screen, scene-setting. One headline, one visual, one motion.
2. **Work Previews** — 2–4 selected projects. Each preview links to a detail page.
3. **Footer** — minimal. Contact, social.

No scrolljacking. Let the browser scroll naturally; GSAP animates elements *within* scroll.

### Detail Pages (`/work/[slug]`)

Deep dive into one project.

1. **Case Intro** — title, role, year, one-line summary
2. **Media blocks** — full-width images/video, side-by-side comparisons
3. **Text sections** — challenge, approach, outcome
4. **Navigation** — prev / next case

---

## Visual Language

### Typography

```tsx
// Use large, confident type. Avoid decorative fonts.
// Hierarchy: display → headline → body → caption

<h1 className="text-[clamp(3rem,8vw,9rem)] font-light tracking-tight leading-[0.9]">
  Selected Work
</h1>
```

Rules:
- Display type: very large, light weight, tight tracking
- Body: comfortable line-height (1.6–1.7), medium weight
- No more than 2 typefaces
- Letter-spacing: tight on large, normal on small

### Spacing

```tsx
// Use generous padding. Negative space IS the design.
<section className="px-6 md:px-16 py-24 md:py-40">
```

Rules:
- Sections: `py-24` minimum, `py-40` preferred on desktop
- Containers: `max-w-screen-xl mx-auto`
- Gaps between elements: generous (`gap-12`, `gap-20`)

### Color

- Default: near-black background (`#0a0a0a`), off-white text (`#f0f0ee`)
- Accents: one subtle tone only (warm gray, muted gold, or desaturated hue)
- No gradients unless they serve depth (e.g. behind the Hero visual)

---

## Motion Principles

> One primary motion at a time. Animation supports — never distracts.

### Rules

1. **Entrance only** — elements animate in, not out (unless navigation)
2. **Stagger sparingly** — max 3–4 staggered children per group
3. **Duration** — 0.6s–1.2s. Nothing faster than 0.4s for content
4. **Ease** — `power2.out` or `expo.out` for entrances; `power1.inOut` for loops
5. **No autoplay loops** — avoid infinite spinning or bouncing elements
6. **Scroll-triggered** — use `ScrollTrigger` for reveal animations

### Standard Hero Entrance

```tsx
useGSAP(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.from(headlineRef.current, { y: 40, opacity: 0, duration: 1 })
    .from(sublineRef.current, { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
    .from(ctaRef.current,     { y: 16, opacity: 0, duration: 0.6 }, '-=0.4');
}, []);
```

### Scroll Reveal (per card/section)

```tsx
useGSAP(() => {
  gsap.from(cardRef.current, {
    y: 32,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: cardRef.current,
      start: 'top 85%',
    },
  });
}, []);
```

### GSAP Setup (once, globally)

```tsx
// lib/gsap/index.ts
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

---

## Component Guidelines

Each section is a **self-contained component**:

```
components/sections/Hero/
  index.tsx       ← markup + GSAP
  types.ts        ← props interface (if needed)
```

Rules:
- No business logic inside visual components
- GSAP lives in `useEffect` / `useGSAP`, scoped to the component
- Props are typed, minimal, explicit
- No global state unless it's navigation or theme
- Avoid HOCs and render props — keep the tree flat and readable

---

## Procedure: Building a New Section

1. **Define the purpose** — one sentence: what does this section communicate?
2. **Sketch the layout** — mobile-first Tailwind skeleton, no content yet
3. **Add content** — type, images, data
4. **Add motion last** — entrance animation, then scroll trigger if needed
5. **Check restraint** — remove any flourish that doesn't add meaning
6. **Connect navigation** — ensure links to/from other pages are in place

---

## Quality Checklist

Before marking a section done:

- [ ] Reads well on mobile (375px) and desktop (1440px)
- [ ] Typography hierarchy is clear at a glance
- [ ] Negative space feels intentional, not empty
- [ ] Motion plays once, not on every interaction
- [ ] No animation fires before the page is ready (`useGSAP` / `useEffect`)
- [ ] GSAP context is cleaned up (`gsap.context().revert()` or `useGSAP` cleanup)
- [ ] Component props are typed
- [ ] No unused imports or dead code

---

## Anti-Patterns to Avoid

| Avoid | Instead |
|-------|---------|
| Hover animations on everything | Animate only interactive focal points |
| Parallax on every image | Use sparingly — only on the Hero visual |
| Auto-rotating carousels | Static grids with deliberate navigation |
| CSS animation + GSAP on same element | Pick one system per element |
| Long scroll pages with no breathing room | Break into sections with generous vertical padding |
| More than 2 typefaces | Stick to 1–2, vary weight and size |
| Overly complex component trees | Flat, readable, isolated |
