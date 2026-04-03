-- supabase/migrations/vibe_schema.sql
-- Enable the vector extension for high-dimensional vibe searching
create extension if not exists vector;

-- Create destination vibes table with embeddings
create table if not exists destination_vibes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  vibe_tag text,
  description text,
  location_type text, -- 'Coastal', 'Mountain', 'Urban', 'Wild'
  embedding vector(1536), -- Vector column for semantic similarity
  created_at timestamp with time zone default now()
);

-- Cosine Similarity Search function
create or replace function match_vibes (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  vibe_tag text,
  description text,
  similarity float
)
language sql stable
as $$
  select
    id,
    title,
    vibe_tag,
    description,
    1 - (embedding <=> query_embedding) as similarity
  from destination_vibes
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by (embedding <=> query_embedding) asc
  limit match_count;
$$;
