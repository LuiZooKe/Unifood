<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers - ajuste o origin para seu frontend
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['senha'], $data['token'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    exit;
}

$senha = $data['senha'];
$token = $data['token'];

if (strlen($senha) < 6) {
    echo json_encode(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres.']);
    exit;
}

$host = "localhost";
$user = "root";
$pass = "";
$dbName = "unifood_db";

$conn = new mysqli($host, $user, $pass, $dbName);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco: ' . $conn->connect_error]);
    exit;
}

// Verifica se o token é válido e não expirou
$stmt = $conn->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expira > NOW()");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Token inválido ou expirado.']);
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();
$userId = $user['id'];

// Atualiza a senha com hash seguro
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$updateStmt = $conn->prepare("UPDATE users SET senha = ?, reset_token = NULL, reset_token_expira = NULL WHERE id = ?");
$updateStmt->bind_param("si", $senhaHash, $userId);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Senha redefinida com sucesso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar a senha.']);
}

$conn->close();
?>
