<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // sua senha, se tiver
$db = 'unifood';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("❌ Falha na conexão: " . $conn->connect_error);
}

echo "✅ Conectado com sucesso ao banco '$db'";
$conn->close();
?>
