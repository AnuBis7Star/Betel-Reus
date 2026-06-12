CREATE TABLE IF NOT EXISTS volley_tournament_states (
  id text PRIMARY KEY,
  title text NOT NULL DEFAULT 'Torneo voleibol 2026',
  state jsonb NOT NULL DEFAULT '{"groupScores": {}, "playoffScores": {}}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO volley_tournament_states (id, title, state)
VALUES ('volley-2026-06-13', 'Torneo voleibol 2026', '{"groupScores": {}, "playoffScores": {}}'::jsonb)
ON CONFLICT (id) DO NOTHING;
