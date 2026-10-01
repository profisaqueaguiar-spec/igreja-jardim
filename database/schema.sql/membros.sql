-- Script de Criação do Banco de Dados para o Projeto "Jardim de Oração"

CREATE DATABASE IF NOT EXISTS `igrejajardim` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `igrejajardim`;

-- Estrutura da tabela `membros`
CREATE TABLE IF NOT EXISTS `membros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `cargo` varchar(50) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_alteracao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dados Fictícios de Exemplo (Opcional)
INSERT INTO `membros` (`nome`, `email`, `telefone`, `endereco`, `cargo`, `foto`) VALUES
('Membro Exemplo 1', 'membro1@teste.com', '11999999999', 'Rua Exemplo, 123', 'Membro', NULL),
('Líder Exemplo 2', 'lider@teste.com', '11988888888', 'Av. Principal, 456', 'Líder de Ministério', NULL);