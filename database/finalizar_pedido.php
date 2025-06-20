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

// 🔥 Dados recebidos
$nome = $data['nome'] ?? $data['nome_cliente'] ?? 'PDV';
$email = $data['email'] ?? $data['email_cliente'] ?? 'pdv@unifood.com';
$telefone = $data['telefone'] ?? $data['telefone_cliente'] ?? '00000000000';
$itens = $data['itens'] ?? [];
$valor_total = floatval($data['valor_total'] ?? 0);
$tipo_pagamento = strtolower($data['tipo_pagamento'] ?? '');
$tipo_venda = strtoupper($data['tipo_venda'] ?? 'PDV');
$status = 'PENDENTE';
$observacoes = $data['observacoes'] ?? '';

// 🔥 Se for SITE → valida cliente
if ($tipo_venda === 'SITE') {
    $buscaCliente = $conn->prepare("SELECT nome, telefone, saldo FROM clientes WHERE email = ?");
    $buscaCliente->bind_param("s", $email);
    $buscaCliente->execute();
    $resCliente = $buscaCliente->get_result();

    if ($resCliente && $resCliente->num_rows > 0) {
        $cliente = $resCliente->fetch_assoc();
        $nome = $cliente['nome'] ?? $nome;
        $telefone = $cliente['telefone'] ?? $telefone;
    } else {
        echo json_encode(['success' => false, 'message' => 'Cliente não encontrado.']);
        exit;
    }
    $buscaCliente->close();

    // 🔥 Verifica saldo se for pagamento por saldo
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
}

// 🔥 Se for PDV, usa dados padrão se não vierem preenchidos
if ($tipo_venda === 'PDV') {
    if (empty($nome)) $nome = 'PDV';
    if (empty($email)) $email = 'pdv@unifood.com';
    if (empty($telefone)) $telefone = '00000000000';
}

// 🔥 Inserir pedido
$stmt = $conn->prepare("INSERT INTO pedidos (
    nome_cliente, email_cliente, telefone_cliente, itens, valor_total, tipo_pagamento, tipo_venda, status, observacoes, data_pedido, hora_pedido
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

$jsonItens = json_encode($itens, JSON_UNESCAPED_UNICODE);

$stmt->bind_param(
    "ssssdssss",
    $nome,
    $email,
    $telefone,
    $jsonItens,
    $valor_total,
    $tipo_pagamento,
    $tipo_venda,
    $status,
    $observacoes
);

if ($stmt->execute()) {
    $pedido_id = $stmt->insert_id;
    echo json_encode([
        'success' => true,
        'message' => 'Pedido finalizado com sucesso.',
        'pedido_id' => $pedido_id,
        'novo_saldo' => isset($novoSaldo) ? $novoSaldo : null
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao finalizar pedido']);
}

$stmt->close();
$conn->close();
?>
