<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbName = "unifood_db";

$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$conn->query("CREATE DATABASE IF NOT EXISTS $dbName");
$conn->select_db($dbName);

$sql1 = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    email_confirmado VARCHAR(10) NOT NULL DEFAULT 'nao',
    senha VARCHAR(255) NOT NULL,
    reset_token VARCHAR(64) NULL,
    reset_token_expira DATETIME NULL
)";

$sql2 = "CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    imagem VARCHAR(255),
    custo DECIMAL(10,2) NOT NULL,
    id_fornecedor INT NOT NULL,
    nome_fornecedor VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    unidade_medida VARCHAR(50) NOT NULL,
    lucro DECIMAL(10,2) NOT NULL
)";

$sql3 = "CREATE TABLE IF NOT EXISTS funcionario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    telefone VARCHAR(20),
    data_admissao DATE NOT NULL,
    cargo VARCHAR(50),
    salario DECIMAL(10,2)
)";

$sql4 = "CREATE TABLE IF NOT EXISTS fornecedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    cpf VARCHAR(14) UNIQUE,
    cnpj VARCHAR(18) UNIQUE,
    logradouro VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$conn->query($sql1);
$conn->query($sql2);
$conn->query($sql3);
$conn->query($sql4);
  echo "Banco e tabela criados com sucesso.";
$conn->close();
?>
