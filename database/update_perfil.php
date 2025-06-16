<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email não enviado']);
    exit;
}

$logradouro = $data['logradouro'] ?? '';
$numero = $data['numero'] ?? '';
$bairro = $data['bairro'] ?? '';
$cidade = $data['cidade'] ?? '';
$celular = $data['celular'] ?? '';

$numero_cartao = $data['numero_cartao'] ?? '';
$nome_cartao = $data['nome_cartao'] ?? '';
$validade_cartao = $data['validade_cartao'] ?? '';
$cvv_cartao = $data['cvv_cartao'] ?? '';

// Atualiza os dados na tabela clientes
$sql = "UPDATE clientes SET 
    logradouro = '$logradouro',
    numero = '$numero',
    bairro = '$bairro',
    cidade = '$cidade',
    celular = '$celular',
    numero_cartao = '$numero_cartao',
    nome_cartao = '$nome_cartao',
    validade_cartao = '$validade_cartao',
    cvv_cartao = '$cvv_cartao'
WHERE email = '$email'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar os dados']);
}

$conn->close();
?>
