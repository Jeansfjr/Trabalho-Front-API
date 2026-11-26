-- =====================================================
-- Tabela de filmes (rode no SQL Editor do Supabase)
-- =====================================================

CREATE TABLE IF NOT EXISTS filmes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    genero VARCHAR(40) NOT NULL,
    ano INT NOT NULL CHECK (ano BETWEEN 1888 AND 2100),
    nota NUMERIC(3,1) CHECK (nota BETWEEN 0 AND 10),
    assistido BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Segurança por linha: sem políticas, a API não enxerga a tabela.
-- As quatro políticas abaixo liberam ler, inserir, alterar e apagar para o papel "anon".
-- ATENÇÃO: isso deixa a tabela aberta a qualquer pessoa que tenha a chave do site.
-- Use esta tabela só para o trabalho (nunca para dados importantes).
ALTER TABLE filmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "filmes_leitura"   ON filmes FOR SELECT TO anon USING (true);
CREATE POLICY "filmes_insercao"  ON filmes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "filmes_alteracao" ON filmes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "filmes_exclusao"  ON filmes FOR DELETE TO anon USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON filmes TO anon;
GRANT USAGE, SELECT ON SEQUENCE filmes_id_seq TO anon;

-- Dados de exemplo (as notas são de exemplo)
INSERT INTO filmes (titulo, genero, ano, nota, assistido) VALUES
('Cidade de Deus',          'Crime',             2002, 9.5, TRUE),
('O Auto da Compadecida',   'Comédia',           2000, 9.0, TRUE),
('Interestelar',            'Ficção científica', 2014, 9.2, TRUE),
('Parasita',                'Suspense',          2019, 8.8, TRUE),
('Central do Brasil',       'Drama',             1998, 8.5, FALSE),
('Toy Story',               'Animação',          1995, 8.7, TRUE),
('Os Incríveis',            'Animação',          2004, 8.0, FALSE),
('O Poderoso Chefão',       'Crime',             1972, NULL, FALSE);
