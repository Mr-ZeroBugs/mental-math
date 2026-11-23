# mental-math

**Mental Math Lab** — interactive website for learning mental arithmetic, from basic to advanced.

- 18 techniques in 3 levels (Basic / Intermediate / Advanced), each with an explanation, a step-by-step worked example and visuals (number line, area model, "prism split")
- Random practice problems with step-by-step hints; 5 correct in a row = technique passed
- Mixed test: Sprint 60 s or untimed with solutions, plus a review summary
- "Recommended next" strip: points to the technique you are weakest at (under 70% after 3+ attempts), else the next one not yet passed
- Optional login (email + password via Supabase) to sync progress across devices. Without login everything still works and is saved in the browser (localStorage).

Single self-contained `index.html` — open it in a browser or host it on GitHub Pages.

## Supabase setup

- Schema and row-level security: `supabase/schema.sql` (each user can only touch their own rows)
- `index.html` contains the project URL and the **publishable** key (safe to expose; RLS does the protecting). Never put a `service_role` / secret key in this file.
- In the Supabase dashboard, set **Authentication → URL Configuration → Site URL** to the hosted address (e.g. the GitHub Pages URL) so email-confirmation links come back to the app. For personal use you can also turn off **Confirm email** under Authentication → Sign In / Providers → Email.
- Login needs the page to be hosted somewhere that can reach `*.supabase.co`. The claude.ai artifact preview blocks outside connections, so login only works on the hosted copy.

Design: light liquid glass, "Prism" direction — see `DESIGN.md` and `PRODUCT.md`.
