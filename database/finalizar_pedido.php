<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['nome']) ||
    !isset($data['email']) ||
    !isset($data['itens']) ||
    !isset($data['valor_total']) ||
    !isset($data['tipo_pagamento'])
) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$nome = $data['nome'];
$email = $data['email'];
$itens = json_encode($data['itens']);
$valor_total = floatval($data['valor_total']);
$tipo_pagamento = $data['tipo_pagamento'];

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit;
}

$result = $conn->query("SELECT saldo FROM clientes WHERE email = '$email'");
$cliente = $result->fetch_assoc();

if (!$cliente) {
    echo json_encode(['success' => false, 'message' => 'Cliente não encontrado']);
    exit;
}

$novoSaldo = $cliente['saldo'];

if ($tipo_pagamento === 'saldo') {
    if ($cliente['saldo'] < $valor_total) {
        echo json_encode(['success' => false, 'message' => 'Saldo insuficiente']);
        exit;
    }

    $novoSaldo = $cliente['saldo'] - $valor_total;
    $conn->query("UPDATE clientes SET saldo = $novoSaldo WHERE email = '$email'");
}

$stmt = $conn->prepare("
    INSERT INTO pedidos (nome_cliente, email_cliente, itens, valor_total, tipo_pagamento)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("sssds", $nome, $email, $itens, $valor_total, $tipo_pagamento);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Pedido finalizado com sucesso!',
        'novo_saldo' => $novoSaldo
    ]);
    $stmt->close();
    $conn->close();
    exit;
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao finalizar pedido']);
    $stmt->close();
    $conn->close();
    exit;
}
?>
