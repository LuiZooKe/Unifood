<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['saldo'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$email = $data['email'];
$saldo = floatval($data['saldo']);

if ($saldo < 0 || $saldo > 9999.99) {
    echo json_encode(['success' => false, 'message' => 'Valor de saldo inválido']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão']);
    exit;
}

$stmt = $conn->prepare("UPDATE clientes SET saldo = ? WHERE email = ?");
$stmt->bind_param("ds", $saldo, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Saldo atualizado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar saldo']);
}

$stmt->close();
$conn->close();
?>
