<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['senha'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$email = trim($data['email']);
$senha = password_hash($data['senha'], PASSWORD_DEFAULT);

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão: ' . $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare("UPDATE users SET senha = ? WHERE email = ?");
$stmt->bind_param("ss", $senha, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Senha atualizada com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar a senha']);
}

$stmt->close();
$conn->close();
?>
