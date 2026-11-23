# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Kao, practising for himself: an adult who wants to get faster and more reliable at doing arithmetic in his head. Mostly uses it on a desktop computer, keyboard in reach.

## Product Purpose
Calc Dojo (renamed from Mental Math Lab) is a training hall for mental arithmetic. The home page is for starting a game and seeing your own stats; the 18 techniques live on a separate Learn page. Success is both: understanding why each technique works, then building speed until it is automatic, measured against your own past self.

## Positioning
Every problem is generated together with its own worked solution in that technique's steps, so the explanation always matches the exact numbers on screen (number-line jumps for add/subtract, area models for multiplication).

## Capabilities and Constraints
- 18 techniques in three levels (Basic, Intermediate, Advanced); each has an explanation, "when to use", a step-by-step worked example, and a practice loop with step-by-step hints.
- Mastery: 5 correct in a row without hints marks a technique as passed.
- Mixed test: random problems across chosen levels, Sprint (60 s) or untimed with solutions; end summary lists techniques to review.
- Game: Sprint 60 s, untimed with solutions, and belt exams. XP is derived from correct answers (1/2/3 by level). Six belts (white to black); each belt has an exam (Sprint with a target score and accuracy). Targets and XP thresholds are first guesses, not calibrated.
- Competition is only against yourself: personal bests, daily goal (30 answers), day streak, GitHub-style heatmap (volume or accuracy), weekly accuracy trend. No leaderboard or duels.
- Pen mode (Play page): pen 1 writes the answer, read in the browser as a number (digits, decimal point, minus); pen 2 is scratch only. Low-confidence reads show "อ่านไม่ออก" and are not counted wrong. Real-handwriting accuracy is unmeasured until tested on the user's iPad.
- Data lives in localStorage and syncs to Supabase when signed in (technique_progress, daily_stats, play_runs; own-row RLS).
- Static multi-page site (index, learn, play) intended for GitHub Pages; login only works on a hosted copy.
- UI language: Thai, with technique names in English.

## Brand Commitments
- Visual direction pinned by the user: "premium liquid glass, light". Dojo direction chosen by the user: belts and training hall, calm and disciplined rather than arcade.
- No generic AI-slop look.

## Evidence on Hand
No testimonials, users, or stats. Do not invent any.

## Product Principles
- Understanding before speed: the worked steps are the core of the product, not a hint afterthought.
- The keyboard loop (type, Enter, next) must never be slower than the math.
- Honest feedback: show the right answer and the method when wrong, no fake encouragement.
