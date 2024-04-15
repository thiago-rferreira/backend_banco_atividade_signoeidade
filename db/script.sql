-- Criação do banco de dados
CREATE DATABASE atividade_pratica_01;

-- Conecta-se ao banco de dados criado
\c atividade_pratica_01;

-- Criação da tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL,
    signo VARCHAR(20) NOT NULL,
    datanascimento DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    sexo VARCHAR(10) NOT NULL
);

-- Verifica se a tabela foi criada corretamente
\d users;
