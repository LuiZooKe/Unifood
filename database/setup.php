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

$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    email_confirmado VARCHAR(10) NOT NULL DEFAULT 'nao',
    senha VARCHAR(255) NOT NULL
)";

$sql = "CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    imagem VARCHAR(255)
)";



$conn->query($sql);
  echo "Banco e tabela criados com sucesso.";
$conn->close();
?>
