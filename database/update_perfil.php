<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Dados não recebidos']);
    exit;
}

$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email não enviado']);
    exit;
}

$logradouro = $data['logradouro'] ?? '';
$numero = $data['numero'] ?? '';
$bairro = $data['bairro'] ?? '';
$cidade = $data['cidade'] ?? '';
$telefone = $data['telefone'] ?? '';
$numero_cartao = $data['numero_cartao'] ?? '';
$nome_cartao = $data['nome_cartao'] ?? '';
$validade_cartao = $data['validade_cartao'] ?? '';
$cvv_cartao = $data['cvv_cartao'] ?? '';

$stmt = $conn->prepare("UPDATE clientes SET 
    logradouro = ?, 
    numero = ?, 
    bairro = ?, 
    cidade = ?, 
    telefone = ?, 
    numero_cartao = ?, 
    nome_cartao = ?, 
    validade_cartao = ?, 
    cvv_cartao = ? 
WHERE email = ?");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erro na preparação da query']);
    exit;
}

$stmt->bind_param(
    "ssssssssss", 
    $logradouro, 
    $numero, 
    $bairro, 
    $cidade, 
    $telefone, 
    $numero_cartao, 
    $nome_cartao, 
    $validade_cartao, 
    $cvv_cartao, 
    $email
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar os dados']);
}

$stmt->close();
$conn->close();
?>
