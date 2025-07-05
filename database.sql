-- Arquivo: database.sql
-- Este script cria as tabelas necessárias para a aplicação Amavi Project.
-- Por favor, revise e ajuste os tipos de dados, tamanhos e restrições (NOT NULL, UNIQUE, FOREIGN KEYs)
-- para corresponderem exatamente ao seu modelo de dados.

-- Criação do banco de dados (se não existir)
-- USE `railway`; -- Se você já está conectado ao banco 'railway', esta linha pode ser omitida ou ajustada.

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `senha` VARCHAR(255) NOT NULL -- Armazenar senhas hashadas
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS `produtos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `codigo` VARCHAR(255) NOT NULL UNIQUE,
    `tipo` VARCHAR(255),
    `valor` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50) DEFAULT 'disponivel' -- 'disponivel', 'vendido'
);

-- Tabela de Vendas
CREATE TABLE IF NOT EXISTS `vendas` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `produto_id` INT NOT NULL,
    `data_venda` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE
);

-- Tabela de Tipos de Produto (se usada para categorização)
CREATE TABLE IF NOT EXISTS `tipos_produto` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL UNIQUE
);

-- Tabela de Valores de Produto (se usada para valores pré-definidos)
CREATE TABLE IF NOT EXISTS `valores_produto` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `valor` DECIMAL(10, 2) NOT NULL UNIQUE
);

-- Você pode adicionar comandos INSERT aqui se quiser dados iniciais,
-- ou usar seu arquivo inserts.sql separadamente após criar as tabelas.
