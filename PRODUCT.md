# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Kao, practising for himself: an adult who wants to get faster and more reliable at doing arithmetic in his head. Mostly uses it on a desktop computer, keyboard in reach.

## Product Purpose
Mental Math Lab teaches mental-arithmetic techniques from basic to advanced, then drills them with randomly generated problems. Success is both: understanding why each technique works (not memorising a recipe), then building speed until it is automatic.

## Positioning
Every problem is generated together with its own worked solution in that technique's steps, so the explanation always matches the exact numbers on screen (number-line jumps for add/subtract, area models for multiplication).

## Capabilities and Constraints
- 18 techniques in three levels (Basic, Intermediate, Advanced); each has an explanation, "when to use", a step-by-step worked example, and a practice loop with step-by-step hints.
- Mastery: 5 correct in a row without hints marks a technique as passed.
- Mixed test: random problems across chosen levels, Sprint (60 s) or untimed with solutions; end summary lists techniques to review.
- Progress is stored in the browser only (localStorage); it does not sync across devices.
- Single self-contained HTML file published as a claude.ai artifact; only Google Fonts and whitelisted CDNs load.
- UI language: Thai, with technique names in English.

## Brand Commitments
- Visual direction pinned by the user: "premium liquid glass, light".
- No generic AI-slop look.

## Evidence on Hand
No testimonials, users, or stats. Do not invent any.

## Product Principles
- Understanding before speed: the worked steps are the core of the product, not a hint afterthought.
- The keyboard loop (type, Enter, next) must never be slower than the math.
- Honest feedback: show the right answer and the method when wrong, no fake encouragement.
