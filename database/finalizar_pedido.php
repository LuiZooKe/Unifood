<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔗 Conexão
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Dados não recebidos']);
    exit;
}

$nome = $data['nome'] ?? '';
$email = $data['email'] ?? '';
$itens = $data['itens'] ?? [];
$valor_total = $data['valor_total'] ?? 0;
$tipo_pagamento = $data['tipo_pagamento'] ?? '';
$status = 'PENDENTE';
$observacoes = $data['observacoes'] ?? '';

// 🔍 Buscar os dados do cliente
$cliente = null;
$buscaCliente = $conn->prepare("SELECT nome, telefone, saldo FROM clientes WHERE email = ?");
$buscaCliente->bind_param("s", $email);
$buscaCliente->execute();
$resCliente = $buscaCliente->get_result();

if ($resCliente && $resCliente->num_rows > 0) {
    $cliente = $resCliente->fetch_assoc();
} else {
    echo json_encode(['success' => false, 'message' => 'Cliente não encontrado.']);
    exit;
}
$buscaCliente->close();

// Verifica e atualiza o saldo se necessário
if ($tipo_pagamento === 'saldo') {
    $saldoAtual = floatval($cliente['saldo'] ?? 0);
    if ($saldoAtual < $valor_total) {
        echo json_encode(['success' => false, 'message' => 'Saldo insuficiente.']);
        exit;
    }

    $novoSaldo = $saldoAtual - $valor_total;
    $atualizaSaldo = $conn->prepare("UPDATE clientes SET saldo = ? WHERE email = ?");
    $atualizaSaldo->bind_param("ds", $novoSaldo, $email);
    if (!$atualizaSaldo->execute()) {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar saldo.']);
        exit;
    }
    $atualizaSaldo->close();
}

// 🔥 Inserir o pedido
$stmt = $conn->prepare("INSERT INTO pedidos (
    nome_cliente, email_cliente, telefone_cliente, itens, valor_total, tipo_pagamento, status, observacoes, data_pedido
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

$jsonItens = json_encode($itens);
$telefone = $cliente['telefone'] ?? '';

$stmt->bind_param(
    "ssssdsss",
    $nome,
    $email,
    $telefone,
    $jsonItens,
    $valor_total,
    $tipo_pagamento,
    $status,
    $observacoes
);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Pedido finalizado com sucesso.',
        'novo_saldo' => $tipo_pagamento === 'saldo' ? $novoSaldo : null
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao finalizar pedido']);
}

$stmt->close();
$conn->close();
?>
