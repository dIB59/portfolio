-- Promote the chapter copy that previously lived in lib/story.ts into the
-- projects table itself, so the admin CMS can edit narratives, pull-quotes,
-- transition lines, chapter order, and the post-chapter 3D interlude flag.
--
-- Additive only — no data is removed. Existing six chapters are backfilled
-- with the copy that was hardcoded in lib/story.ts before this change.

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS pull_quote       TEXT,
  ADD COLUMN IF NOT EXISTS narrative        TEXT,
  ADD COLUMN IF NOT EXISTS transition_after TEXT,
  ADD COLUMN IF NOT EXISTS chapter_order    INTEGER,
  ADD COLUMN IF NOT EXISTS interlude_after  TEXT;

ALTER TABLE projects
  ADD CONSTRAINT projects_interlude_after_chk
    CHECK (interlude_after IS NULL OR interlude_after IN ('triangle', 'particles'));

CREATE INDEX IF NOT EXISTS idx_projects_chapter_order
  ON projects (chapter_order NULLS LAST);

-- Backfill the six known chapters. WHERE-by-id means this is a no-op on a
-- fresh DB where these rows don't exist yet.

UPDATE projects SET
  pull_quote       = 'Built it in six hours.',
  narrative        = 'Built this in an afternoon when I should have been studying. It estimates how long it would take to play every game in my Steam library. Turns out the answer is longer than I''m probably going to live. First time touching Java.',
  transition_after = 'Next I wanted to try something with other people.',
  chapter_order    = 1
WHERE id = 'efde612f-0bdc-45eb-8ebf-a8c37eb80de5';

UPDATE projects SET
  pull_quote       = 'My first time shipping with a team.',
  narrative        = 'Group project that became a feedback board for big organisations. Employees post issues and fixes, upvote each other, and management actually sees what people think. Six of us, one semester. Honestly I learned more about how teams work than about any of the code. Two of us once spent a week on the same component without noticing. We ran a vote on the database schema, which I now know not to do.',
  transition_after = 'Working in a team was new for me. I wanted to know what running one felt like.',
  chapter_order    = 2
WHERE id = 'ee84183f-7680-472b-bed1-11f9aca7a494';

UPDATE projects SET
  pull_quote       = 'Led a team of three.',
  narrative        = 'First project I actually ran instead of just being on. It scans payroll data and flags pay gaps between people doing the same job at the same level. Three of us, one semester. The model itself was fine to build. What ate my time was just keeping track of where everyone else was. Every Monday I''d open Discord and try to piece together what state we were in.',
  transition_after = 'After Equity AI I needed a break from leading. I wanted to be back in the code, alone.',
  chapter_order    = 3
WHERE id = 'a6310f8b-dba8-46f3-a73d-c8ac86722a50';

UPDATE projects SET
  pull_quote       = 'Rendered one triangle. Rendered one circle.',
  narrative        = 'Spent a couple of weekends trying to write a renderer in Rust and WebGPU. Got a triangle. Eventually got a circle. That''s basically the whole repo. WebGPU is much harder than the tutorials make it look.',
  transition_after = 'A circle and a triangle wasn''t really the project. I came back for it later.',
  chapter_order    = 4,
  interlude_after  = 'triangle'
WHERE id = '79677700-de99-4ef7-a79e-b769400d5efd';

UPDATE projects SET
  pull_quote       = '25,000 on the CPU. 500,000 on the GPU.',
  narrative        = 'Started out as a CPU simulation handling around 25,000 particles. That was fine, but I wanted to see how much further the GPU could push it, so I rewrote the whole physics layer. Now it runs half a million of them in real time. Every particle gravitates toward every other one, they bounce off each other, and somehow my laptop doesn''t catch fire. Bevy does the rendering. I wrote the physics. First thing I built in Rust where I didn''t feel like I had to apologise for the code first.',
  transition_after = 'By this point I trusted Rust enough to build something I could imagine.',
  chapter_order    = 5,
  interlude_after  = 'particles'
WHERE id = '48d97a42-5f12-45cd-b3d5-56c5e08c3345';

UPDATE projects SET
  pull_quote       = 'One hundred thousand links.',
  narrative        = 'Desktop app that crawls a whole website and draws it as a graph you can pan around. About a thousand pages and a hundred thousand links is the comfortable upper limit. It caches everything locally and then asks an LLM what''s broken about your SEO and what to do about it. Tauri for the shell, Rust does the crawl, Next.js on top, SQLite under everything. I''ve been using it on my own sites since I built it, which is rare for me.',
  chapter_order    = 6
WHERE id = '8337a48c-f0d3-4d08-b444-d83112e2f944';
