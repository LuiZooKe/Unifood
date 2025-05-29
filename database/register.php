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

if (!isset($data['nome'], $data['email'], $data['senha'], $data['tipo_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$tipo_usuario = intval($data['tipo_usuario']);
$nome = htmlspecialchars(trim($data['nome']));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$senha = password_hash($data['senha'], PASSWORD_DEFAULT);

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO users (nome, email, senha, email_confirmado, tipo_usuario) VALUES (?, ?, ?, 'nao', ?)");
$stmt->bind_param("sssi", $nome, $email, $senha, $tipo_usuario);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Usuário cadastrado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar usuário']);
}

$stmt->close();
$conn->close();
