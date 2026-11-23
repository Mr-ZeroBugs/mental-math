---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface: Mental Math Lab (index.html)

Scope: the whole single-page app (Learn view + Mixed test view). Visitor mode: Operate.
Audience/job: Kao, adult, desktop with keyboard, practising mental arithmetic for himself; wants to understand each technique and then get fast.
Constraints: keep all 18 techniques, generators, mastery rule (5 in a row), sprint/untimed modes, localStorage progress, Thai UI.

## Direction contract

THESIS: Every technique is the act of splitting a number into easy parts; the surface shows that split as light through a prism. Refuses the category default of a flat quiz card with a grey sidebar and one accent.

OWN-WORLD: Light liquid glass over a white surface lit by a spectrum. Frosted panes (blur + saturate, specular top edge, soft offset shadow) refract a slow caustic field whose hue follows the current level (teal / amber / violet). Decomposed parts always carry spectral roles: blue, orange, magenta. Anuphan for Thai UI, Manrope tabular figures for every number. Authored SVG icons, one stroke.

STORY: Pick a technique in the rail, read the idea, watch the worked example split, then drill in the practice pane beside it until 5 beads fill; then test mixed under the clock.

FIRST VIEWPORT: Glass top bar (prism mark, Learn/Test tabs, three quiet stats). Glass rail left: 18 techniques in three level groups with 5-bead progress. Main: technique title + idea; below, two panes side by side on desktop: worked example (problem, prism split, steps, visual) and practice (problem, answer field, Check/Hint/New). Primary action = answer field, focused on load.

FORM: Operate shell (top bar + rail + two work panes), Impeccable's pick (my rank 1 of 7; roll assigned rank 4 "glass soroban", user chose the pick). seed:e9dc9c6495493aa7 (degraded roll, no challengers).
Signature interaction: the Prism Split — the operand passes through a small glass prism and fans out into colored part-chips (e.g. 38 → 30 + 8), drawn once per reveal with orchestrated rays.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
