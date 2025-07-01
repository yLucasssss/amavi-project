
USE amavi_db;

-- Inserindo produtos
INSERT INTO produtos (nome, tipo, valor) VALUES
('Colar de Pérolas', 'colar', 120.00),
('Pulseira de Prata', 'pulseira', 85.50),
('Anel Solitário', 'anel', 250.00),
('Brincos de Argola', 'brincos', 45.00),
('Tornozeleira de Conchas', 'tornozeleira', 30.00),
('Bracelete Cravejado', 'bracelete', 180.00);

-- Inserindo vendas (assumindo que os IDs dos produtos existem)
INSERT INTO vendas (produto_id) VALUES
(1), -- Colar de Pérolas
(3), -- Anel Solitário
(2), -- Pulseira de Prata
(1), -- Colar de Pérolas
(4); -- Brincos de Argola

-- Inserindo usuários
INSERT INTO usuarios (nome, email, senha) VALUES
('Gigi', 'gigi@amavi.com', 'senha123'),
('Lucas', 'lucas@amavi.com', 'minhasenha');
