<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['senha'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$senha = $data['senha'];

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco']);
    exit;
}

$stmt = $conn->prepare("SELECT id, senha, tipo_usuario FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Conta não cadastrada']);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($senha, $user['senha'])) {
    echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Login realizado com sucesso',
    'tipo_usuario' => $user['tipo_usuario']
]);
