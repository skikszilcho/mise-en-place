-- Migration 002: recipes table
-- Flat structure in Phase 1. Fields marked [Phase 2] will be
-- normalised into child tables (recipe_ingredients, recipe_steps)
-- without changing this table's primary key.

CREATE TABLE public.recipes (
  id             uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Core fields
  title          text         NOT NULL,
  description    text,

  -- Phase 1: free-text. Phase 2: normalised to recipe_ingredients table
  ingredients    text         NOT NULL,

  -- Phase 1: free-text. Phase 2: normalised to recipe_steps table
  steps          text         NOT NULL,

  -- Phase 1: plain URL string. Phase 2: Supabase Storage object path
  image_url      text,

  -- Array of tag strings — simple for Phase 1, queryable in Phase 5
  tags           text[]       DEFAULT '{}' NOT NULL,

  cuisine        text,
  prep_time_min  integer      CHECK (prep_time_min IS NULL OR prep_time_min > 0),
  cook_time_min  integer      CHECK (cook_time_min IS NULL OR cook_time_min > 0),
  servings       integer      CHECK (servings IS NULL OR servings > 0),

  created_at     timestamptz  DEFAULT now() NOT NULL,
  updated_at     timestamptz  DEFAULT now() NOT NULL
);

-- Index for fast per-user recipe queries
CREATE INDEX recipes_user_id_idx ON public.recipes(user_id);

-- Index for tag array queries (Phase 5: pantry / personalisation)
CREATE INDEX recipes_tags_idx ON public.recipes USING GIN(tags);
