---
name: Mental Math Lab
description: Light liquid glass over a spectral field, where every technique is shown as a number splitting through a prism.
colors:
  ground: "#f3f5fb"
  ink: "#141833"
  ink-2: "#3b4163"
  mute: "#5a6082"
  disabled-ink: "#8a90ad"
  glass: "rgba(255,255,255,.48)"
  glass-hi: "rgba(255,255,255,.78)"
  glass-edge: "rgba(255,255,255,.85)"
  hair: "rgba(28,36,84,.10)"
  part-blue: "#2f5bea"
  part-orange: "#c4510f"
  part-magenta: "#b0247f"
  level-basic: "#0b7f6a"
  level-intermediate: "#a35d00"
  level-advanced: "#6a3be0"
  level-basic-soft: "#9fe3d1"
  level-intermediate-soft: "#ffd28a"
  level-advanced-soft: "#c7b4ff"
  field-peach: "#ffd9bf"
  field-pink: "#f5c8e6"
  field-periwinkle: "#bcd0ff"
  ok: "#14803c"
  bad: "#cf2d2d"
  primary-ink-top: "#2a3060"
  primary-ink-bottom: "#151a3a"
typography:
  display-number:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "46px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-1.2px"
    fontFeature: "\"tnum\""
  display-number-huge:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "64px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-2px"
    fontFeature: "\"tnum\""
  score-number:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-2.5px"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.6px"
  subtitle:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.6
  body-lead:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.6
  label:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
    lineHeight: 1.6
  caption:
    fontFamily: "Anuphan, Manrope, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.35
  part-number:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    fontFeature: "\"tnum\""
  answer-number:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    fontFeature: "\"tnum\""
rounded:
  xs: "6px"
  sm: "10px"
  control: "12px"
  md: "14px"
  field: "16px"
  lg: "20px"
  xl: "26px"
  pill: "50%"
spacing:
  hairline: "3px"
  chip-gap: "6px"
  row-gap: "8px"
  inset-sm: "10px"
  inset-md: "14px"
  gutter: "16px"
  pane-x: "22px"
  head-x: "26px"
components:
  button-primary:
    backgroundColor: "{colors.primary-ink-bottom}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "rgba(255,255,255,.62)"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    typography: "{typography.label}"
  button-secondary-hover:
    backgroundColor: "rgba(255,255,255,.92)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  button-ghost-hover:
    backgroundColor: "rgba(255,255,255,.6)"
  button-disabled:
    backgroundColor: "rgba(28,36,84,.05)"
    textColor: "{colors.disabled-ink}"
  answer-field:
    backgroundColor: "rgba(255,255,255,.82)"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "8px 16px"
    width: "200px"
    typography: "{typography.answer-number}"
  glass-pane:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.xl}"
    padding: "20px 22px 22px"
  glass-bar:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.lg}"
    padding: "10px 14px 10px 18px"
  tab-active:
    backgroundColor: "{colors.glass-hi}"
    textColor: "{colors.ink}"
    rounded: "9px"
    padding: "6px 14px"
  tab-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    rounded: "9px"
    padding: "6px 14px"
  toggle-chip:
    backgroundColor: "rgba(255,255,255,.55)"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
  toggle-chip-on:
    backgroundColor: "rgba(255,255,255,.95)"
    textColor: "{colors.ink}"
  rail-item-active:
    backgroundColor: "rgba(255,255,255,.9)"
    rounded: "{rounded.control}"
    padding: "8px 10px"
  part-chip:
    rounded: "{rounded.control}"
    padding: "6px 12px"
    typography: "{typography.part-number}"
  source-chip:
    backgroundColor: "rgba(255,255,255,.85)"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "6px 12px"
    typography: "{typography.part-number}"
  bead:
    size: "8px"
    rounded: "{rounded.pill}"
  timer-track:
    backgroundColor: "rgba(28,36,84,.08)"
    height: "6px"
    rounded: "6px"
---

# Design System: Mental Math Lab

## Overview

**Creative North Star: "Light Through a Prism"**

Every mental-math technique is the act of splitting a number into easy parts, and this system makes that split literal: white light enters a small glass prism and leaves as coloured parts. The interface around it is light liquid glass. Frosted panes sit over a white ground lit by soft, blurred colour pools, and they pick up that colour through backdrop blur and saturation. Nothing is opaque except the text and the one dark primary button.

It is an Operate surface, dense but calm: a sticky glass top bar, a glass rail of techniques, and two working panes side by side. Numbers carry the weight. They are set large and light in Manrope with tabular figures, while Thai UI text runs in Anuphan at ordinary reading sizes. Colour is reserved for meaning: three spectral part colours for decomposed numbers, three level hues for Basic / Intermediate / Advanced, and green/red only for right/wrong.

Motion is orchestration, not decoration. Rays draw, chips fan out, steps rise in sequence, all on one long-tail ease (cubic-bezier(.16,1,.3,1)); the colour field drifts only when the level changes. Reduced-motion users get everything instantly.

**Key Characteristics:**
- Frosted white glass panes (blur 22px, saturate 170%) with a specular top edge and soft lifted shadow.
- A fixed light field of five blurred colour pools; two of them take the current level's soft hue.
- The Prism Split: source chip → glass prism → coloured part chips, drawn per reveal.
- Spectral part roles (blue / orange / magenta) used identically in chips, step text, rays, number-line arcs and area models.
- Manrope tabular figures for every number; Anuphan for every Thai word.
- One stroke-icon family (1.8px, round caps) authored as inline SVG symbols.

## Colors

A cool white world tinted by spectral light, with deep indigo ink and colour that always means something.

### Primary
- **Prism Blue** (part-blue): the first part of every split (tens, the "easy" chunk), the first ray out of the prism, focus rings, caret, the answer field's focus border, inline links and the info icon. The most frequent accent; never decorative.

### Secondary
- **Ember Orange** (part-orange): the second part of a split (units, the remainder, row factors in area models).
- **Prism Magenta** (part-magenta): the third part, when a split has three; middle ray.

### Tertiary (level hues)
- **Basic Teal** (level-basic), **Intermediate Amber** (level-intermediate), **Advanced Violet** (level-advanced): mark which level a technique belongs to: the rail group glyph, filled progress beads, the passed check, the level dot and label in the technique header, and toggle-chip swatches. Their soft companions (level-*-soft) tint two of the five field pools so the whole room shifts with the level. In the Mixed test the level role falls back to ink and a periwinkle field.

### Feedback
- **Correct Green** (ok): correct answer border/ring, success copy, the final-result highlight in steps, the end point on a number line.
- **Error Red** (bad): wrong-answer border (with a short shake), error copy, "you answered" in the miss list.

### Neutral
- **Cool Ground** (ground): the page base under the light field.
- **Indigo Ink** (ink): headings, numbers, primary text.
- **Slate Ink** (ink-2): secondary headings, pane titles, group labels.
- **Muted Slate** (mute): meta text, captions, operators, the `=` sign.
- **Disabled Ink** (disabled-ink): disabled buttons and placeholders.
- **Hairline** (hair): step dividers and miss-list separators.
- **Glass / Glass-Hi / Glass-Edge**: the three white alphas that make panes, active tabs and pane borders.
- **Field Peach / Pink / Periwinkle**: fixed field pools that keep the spectrum present whatever the level.

### Named Rules
**The Spectral Roles Rule.** A decomposed part is always blue, then orange, then magenta, in that order, everywhere it appears: chip, ray, step text, arc, area-model label. Never use these three for chrome, status or level.

**The Colour Means Something Rule.** Level hues mark level, green/red mark correctness, part colours mark parts. Panes, buttons and the bar are white glass or ink; none of them takes an accent fill.

## Typography

**Display / Number Font:** Manrope (with system-ui, sans-serif)
**Body / UI Font:** Anuphan (with Manrope, system-ui, sans-serif)

**Character:** A light, wide geometric sans for numbers set big and thin, against a friendly Thai sans for everything you read. Numbers always use tabular figures so columns and answers never jitter.

### Hierarchy
- **Score Number** (300, 72px, lh 1, -2.5px): the mixed-test end score; the "/ total" drops to 28px muted.
- **Display Number Huge** (300, 64px, -2px; 46px under 820px): the problem in the Mixed test stage, centred.
- **Display Number** (300, 46px, lh 1.1, -1.2px; 36px under 820px): problems in the example and practice panes. The revealed result switches to 700 ink; `=` and `?` are muted.
- **Headline** (700, 34px, lh 1.15, -0.6px, balanced; 26px under 820px): technique name (English) and the Mixed test title.
- **Subtitle** (500, 18px, ink-2): the Thai technique name under the headline.
- **Body Lead** (400, 17px, max 68ch): the technique idea.
- **Body** (400, 16px, lh 1.6): base; steps run at 16.5px.
- **Title** (600, 15px, ink-2): pane headers and summary sub-heads.
- **Label** (500, 14.5px): buttons, tabs, toggle chips, notes.
- **Caption** (400, 12.5–13px, mute): rail sub-names, stat labels, split notes, keyboard hints.
- **Part Number** (700, 19px, tabular): source and part chips.
- **Answer Number** (600, 30px, tabular): the answer field.

### Named Rules
**The Tabular Number Rule.** Every number (problems, chips, steps, stats, beads count, scores, SVG labels) is Manrope with `tnum`. Thai text is never set in Manrope, and numbers are never set in Anuphan.

**The Light Problem Rule.** Problems are thin (300) and large; weight is spent only on the answer once revealed and on part chips.

## Layout

An app shell, not a page. A sticky glass top bar (12px from the top, 16px side margins) holds the prism mark and name, a two-tab segmented control, and three right-aligned quiet stats. Below it a two-column grid: a 286px sticky glass rail and a fluid main column, 16px gutter and 16px outer padding. The rail scrolls on its own within the viewport height.

Main opens with an unboxed technique head (22px / 26px inset), then two equal glass panes side by side (16px gap): worked example on the left, practice on the right. The Mixed test drops the rail and centres a single column at max 1080px.

Spacing is a tight, mostly even rhythm: 6px between chips, 8px between buttons in a row, 10–14px for inner insets, 16px for gutters, 20–26px for pane and head padding.

Responsive: at ≤1180px the two panes stack. At ≤820px the top bar wraps and stops being sticky, stats spread full width, the rail becomes a horizontal scrolling strip of technique pills (group labels, sub-names and beads hidden), and headline and problem sizes step down.

## Elevation & Depth

Depth is glass over light. Each pane is translucent white with backdrop blur and saturation, a 1px bright edge, a soft-light gradient sheen on its top 38%, and a layered shadow: an inset white top highlight, a faint inset bottom line, and a long, soft, negative-spread drop. The coloured field behind it is what makes the glass read as glass. Inner controls (active tab, active rail item, buttons, chips) are brighter white with their own small inset highlight and short soft drop.

### Shadow Vocabulary
- **Glass Pane** (`--shadow`: `0 1px 0 rgba(255,255,255,.9) inset, 0 -1px 0 rgba(20,28,70,.04) inset, 0 18px 40px -18px rgba(24,32,88,.22), 0 3px 8px -3px rgba(24,32,88,.08)`): top bar, rail, panes, note, stage.
- **Control Lift** (`0 1px 0 #fff inset, 0 4px 12px -6px rgba(24,32,88,.25)`; hover `0 8px 18px -8px rgba(24,32,88,.32)`): secondary buttons.
- **Selected Lift** (`0 1px 0 #fff inset, 0 6px 16px -8px rgba(24,32,88,.25)`): active rail item, pressed toggle chips (14px blur variant), active tab (2px 8px variant).
- **Ink Lift** (`0 1px 0 rgba(255,255,255,.22) inset, 0 8px 18px -8px rgba(20,24,58,.6)`): primary button.
- **Inset Well** (`inset 0 2px 6px rgba(24,32,88,.08)`): the answer field; focus adds a 4px Prism Blue ring at 14%.
- **Tinted Chip Glow** (`0 6px 14px -8px` part colour at 60%): part chips cast their own colour.

### Named Rules
**The Glass Needs Light Rule.** Glass panes only sit over the coloured field. Never put a glass pane on flat ground or over another glass pane; nested surfaces are brighter opaque-ish white, not another blur layer.

**The Soft Lift Rule.** All drops are soft, negative-spread and indigo-tinted. No hard offset shadows, no pure-black shadows.

## Shapes

Generously rounded, never sharp. Large containers use 26px (panes, rail, stage), the bar and note 20px, controls 12px (buttons, chips, toggle chips, rail items), the answer field 16px, the tab track 12px with 9px inner tabs, area-model cells 10px, keycaps 6px. Beads, level dots, step counters and toggle swatches are circles. The prism itself is the one sharp form: a triangle with a white specular edge and rounded joins, used as the brand mark, the level-group glyph and the split device.

## Components

### Buttons
Tactile glass keys with one dark key.
- **Shape:** gently rounded (12px), 8px 14px padding, 7px icon gap, label type.
- **Primary:** vertical ink gradient (#2a3060 → #151a3a) with white text; used for the single forward action in a pane (Check, Next step, Start, Play again). Hover lightens the gradient.
- **Secondary:** white glass (62%) with a bright 1px edge and Control Lift; hover to 92% white and a longer lift.
- **Ghost:** no fill, no border, ink-2 text; hover fills with 60% white. Used for New example, New problem, dismiss, change settings.
- **Active:** all buttons press 1px down. **Disabled:** flat 5% ink fill, muted text, no shadow.
- **Link:** inline Prism Blue, 600, underlined with 3px offset (review list in the summary).

### Chips
- **Toggle chip:** 55% white with a faint ink border; pressed state goes to 95% white, ink text, a border tinted by its level hue and Selected Lift. A 9px swatch dot carries the level colour, 35% opacity off, full on.
- **Part chip:** tinted by its spectral role (9% fill over white, 28% border, coloured glow), part-number type.
- **Source chip:** plain 85% white with an ink hairline, same size as part chips.

### Cards / Containers
- **Corner Style:** 26px for panes, rail and stage; 20px for the top bar and the note.
- **Background:** Glass (48% white) with blur(22px) saturate(170%) and a soft-light top sheen.
- **Shadow Strategy:** Glass Pane (see Elevation).
- **Border:** 1px Glass-Edge.
- **Internal Padding:** 20px 22px 22px for panes, 22px 26px 24px for the stage; 16px under 820px.

### Inputs / Fields
- **Answer field:** 200px wide, 30px tabular numerals, 16px radius, 82% white, inset well, 14% ink border. Focused on load.
- **Focus:** border turns Prism Blue with a 4px 14% blue ring.
- **Correct:** green border and ring. **Wrong:** red border and a 0.32s horizontal shake.

### Navigation
- **Tabs:** segmented control in a 6% ink track (3px inset); inactive tabs muted text, active tab glass-hi with a small lift.
- **Rail:** level groups headed by a level-tinted prism glyph and ink-2 label; each item shows the English name (600, 14px), the Thai name as an ellipsised caption, and five progress beads (or a passed check in the level hue). Hover 55% white, active 90% white with Selected Lift. On mobile it becomes a horizontal pill strip.
- **Stats:** three right-aligned label-over-number pairs in the bar (12.5px caption over 16px bold tabular number).

### Progress Beads
Five 8px circles. Empty: 10% ink fill with a 1.2px ink ring. Filled: the level hue with a 2px 20% halo. Five in a row become a passed-check icon in the level hue.

### Steps
A numbered list with hairline dividers; counters are 24px white circles with 12px bold numerals. Inline parts use spectral colours; the final result is a bold green number on a 10% green pill. Rows rise in with a 0.45s fade-up.

### The Prism Split (signature)
A split note in caption type, then one row: source chip → prism SVG → part chips with muted operators. The prism (viewBox 150×84, min 104px, max 150px, 22% of the row) is a white-gradient triangle with a white specular edge, a faint spectral band inside, and a grey incoming ray. One outgoing ray per distinct part colour, in that part's hex. On reveal, the prism glints, rays draw (from 0.35s, 80ms apart), then chips and operators fan in from the left with blur (from 0.45s, 90ms apart). In the summary miss list it renders static. The row never wraps; it scrolls horizontally if too narrow, and centres in the Mixed stage except inside the miss list, where it aligns left with its problem.

### Visual Models
- **Number line:** a white rail with ink-ringed stops; jumps are quadratic arcs with arrowheads in spectral order, each labelled ±n in its colour; the landing stop is green.
- **Area model:** cells with 10% spectral (and green) fills and 35% strokes on white, 10px corners; column factors in Prism Blue, row factors in Ember Orange, partial products bold ink, and the summed line beneath.

### Timer
A 6px track at 8% ink; the bar is a blue → magenta → orange spectrum gradient that scales down linearly.

## Do's and Don'ts

### Do:
- **Do** colour every decomposed part by its spectral role (blue, orange, magenta in order), identically in chips, rays, steps, arcs and area models.
- **Do** set every number in Manrope with tabular figures, and every Thai string in Anuphan.
- **Do** place glass panes over the coloured light field, with blur(22px) saturate(170%), a 1px white edge and the Glass Pane shadow.
- **Do** tint the field and level markers with the current level's hue (teal / amber / violet); fall back to ink and periwinkle when no level applies.
- **Do** keep one ink primary button per pane; everything else is secondary glass or ghost.
- **Do** run motion on cubic-bezier(.16,1,.3,1) with staggered delays, and honour prefers-reduced-motion.
- **Do** draw icons as single-stroke inline SVG (1.8px, round caps and joins, 18px).

### Don't:
- **Don't** use the part colours for buttons, status, levels or decoration.
- **Don't** stack glass on glass or put glass over flat ground.
- **Don't** use hard offset or black shadows; lifts are soft and indigo-tinted.
- **Don't** add accent-filled panes or a grey sidebar; panes and rail stay white glass.
- **Don't** let the prism row wrap; it scrolls instead.
- **Don't** use icon fonts, emoji or glyph characters as icons.
