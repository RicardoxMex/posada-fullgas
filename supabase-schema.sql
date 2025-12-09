-- Crear tabla de votos
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  nominee_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_votes_session_id ON votes(session_id);
CREATE INDEX IF NOT EXISTS idx_votes_category_id ON votes(category_id);
CREATE INDEX IF NOT EXISTS idx_votes_nominee_id ON votes(nominee_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT a todos (sin autenticación)
CREATE POLICY "Permitir insertar votos a todos"
  ON votes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Política para permitir SELECT a todos (sin autenticación)
CREATE POLICY "Permitir leer votos a todos"
  ON votes
  FOR SELECT
  TO anon
  USING (true);

-- Opcional: Política para evitar votos duplicados en la misma sesión y categoría
-- (esto se puede manejar también en el cliente, pero es una capa extra de seguridad)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_vote_per_session_category 
  ON votes(session_id, category_id);
