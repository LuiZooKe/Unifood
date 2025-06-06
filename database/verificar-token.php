<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers - ajuste o origin para seu frontend
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");

// Permite preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Recebe o token via GET
$token = $_GET['token'] ?? '';

if (!$token) {
    echo json_encode(['success' => false, 'message' => 'Token não fornecido.']);
    exit;
}

// Configurações do banco
$host = "localhost";
$user = "root";
$pass = "";
$dbName = "unifood_db";

$conn = new mysqli($host, $user, $pass, $dbName);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco.']);
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expira > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Token inválido ou expirado.']);
    $conn->close();
    exit;
}

echo json_encode(['success' => true, 'message' => 'Token válido.']);

$conn->close();
?>
