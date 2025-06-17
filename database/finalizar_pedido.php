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

// 🔍 Buscar o telefone do cliente na tabela 'clientes'
$telefone = '';
$buscaTelefone = $conn->prepare("SELECT telefone FROM clientes WHERE email = ?");
$buscaTelefone->bind_param("s", $email);
$buscaTelefone->execute();
$resTelefone = $buscaTelefone->get_result();

if ($resTelefone && $resTelefone->num_rows > 0) {
    $row = $resTelefone->fetch_assoc();
    $telefone = $row['telefone'] ?? '';
}
$buscaTelefone->close();

// 🔥 Inserir o pedido
$stmt = $conn->prepare("INSERT INTO pedidos (
    nome_cliente, email_cliente, telefone_cliente, itens, valor_total, tipo_pagamento, status, observacoes, data_pedido
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

$jsonItens = json_encode($itens);

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
    echo json_encode(['success' => true, 'message' => 'Pedido finalizado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao finalizar pedido']);
}

$stmt->close();
$conn->close();
?>
