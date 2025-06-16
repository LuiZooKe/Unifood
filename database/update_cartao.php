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

if (!isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email não informado']);
    exit;
}

$email = $data['email'];
$numero_cartao = $data['numero_cartao'] ?? null;
$nome_cartao = $data['nome_cartao'] ?? null;
$validade_cartao = $data['validade_cartao'] ?? null;
$cvv_cartao = $data['cvv_cartao'] ?? null;

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão']);
    exit;
}

$sql = "UPDATE clientes SET 
    numero_cartao = ?, 
    nome_cartao = ?, 
    validade_cartao = ?, 
    cvv_cartao = ? 
    WHERE email = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssss",
    $numero_cartao,
    $nome_cartao,
    $validade_cartao,
    $cvv_cartao,
    $email
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cartão atualizado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar cartão']);
}

$stmt->close();
$conn->close();
?>
