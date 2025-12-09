CREATE TYPE difficulty_enum AS ENUM ('easy', 'medium', 'hard');
ALTER TABLE leetcode_problems
ADD COLUMN difficulty TEXT DEFAULT 'easy';