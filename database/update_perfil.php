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
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

function tratarCampo($valor) {
    return (isset($valor) && trim($valor) !== '') ? trim($valor) : null;
}

$logradouro = tratarCampo($data['logradouro'] ?? null);
$numero     = tratarCampo($data['numero'] ?? null);
$bairro     = tratarCampo($data['bairro'] ?? null);
$cidade     = tratarCampo($data['cidade'] ?? null);
$telefone   = tratarCampo($data['telefone'] ?? null);
$email      = trim($data['email']);

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão: ' . $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE clientes 
    SET logradouro = ?, numero = ?, bairro = ?, cidade = ?, telefone = ? 
    WHERE email = ?
");

$stmt->bind_param(
    "ssssss",
    $logradouro,
    $numero,
    $bairro,
    $cidade,
    $telefone,
    $email
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Dados atualizados com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar dados']);
}

$stmt->close();
$conn->close();
?>
