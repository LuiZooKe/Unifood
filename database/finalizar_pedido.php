<?php
ob_clean();
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
$itens = $data['itens'] ?? [];
$valor_total = floatval($data['valor_total'] ?? 0);
$tipo_pagamento = $data['tipo_pagamento'] ?? '';

if (empty($email) || empty($itens) || $valor_total <= 0 || empty($tipo_pagamento)) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$checkUser = $conn->query("SELECT * FROM users WHERE email = '$email'");
if ($checkUser->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

$resCliente = $conn->query("SELECT * FROM clientes WHERE email = '$email'");
if ($resCliente->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Dados do cliente não encontrados']);
    exit;
}
$cliente = $resCliente->fetch_assoc();
$nome = $cliente['nome'] ?? '';

if ($tipo_pagamento === 'saldo') {
    $saldoAtual = floatval($cliente['saldo'] ?? 0);
    if ($saldoAtual < $valor_total) {
        echo json_encode(['success' => false, 'message' => 'Saldo insuficiente']);
        exit;
    }
    $novoSaldo = $saldoAtual - $valor_total;
    $conn->query("UPDATE clientes SET saldo = $novoSaldo WHERE email = '$email'");
} else {
    $novoSaldo = floatval($cliente['saldo'] ?? 0);
}

echo json_encode([
    'success' => true,
    'message' => 'Pedido finalizado com sucesso',
    'novo_saldo' => $novoSaldo
]);

$conn->close();
flush();
exit;
