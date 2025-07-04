<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔗 Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados']);
    exit;
}

// 📦 Coleta dos dados
$data = json_decode(file_get_contents("php://input"), true);
if (
    !$data ||
    !isset($data['id'], $data['itens'], $data['valor_total']) ||
    !is_numeric($data['valor_total']) ||
    !is_array($data['itens'])
) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
    exit;
}

$id = intval($data['id']);
$itens = $data['itens'];

// 🔢 Calcula o novo valor total com base nos itens
$valor_total = 0;
foreach ($itens as $item) {
    if (isset($item['preco'], $item['quantidade'])) {
        $preco = floatval($item['preco']);
        $quantidade = intval($item['quantidade']);
        $valor_total += $preco * $quantidade;
    }
}

// 🔍 Busca valor anterior do pedido e email do cliente
$buscaPedido = $conn->prepare("SELECT valor_total, email, status FROM pedidos WHERE id = ?");
$buscaPedido->bind_param("i", $id);
$buscaPedido->execute();
$resultPedido = $buscaPedido->get_result();

if (!$resultPedido || $resultPedido->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Pedido não encontrado.']);
    $buscaPedido->close();
    exit;
}

$row = $resultPedido->fetch_assoc();
$valor_anterior = floatval($row['valor_total']);
$email_cliente = $row['email'];
$status_pedido = strtoupper($row['status']);
$buscaPedido->close();

// ❌ Verifica se o pedido está finalizado
if ($status_pedido !== 'PENDENTE') {
    echo json_encode(['success' => false, 'message' => 'Não é possível editar um pedido finalizado.']);
    exit;
}

// 💰 Se o valor aumentou, tenta descontar do saldo do cliente
$diferenca = $valor_total - $valor_anterior;

if ($diferenca > 0) {
    // Busca saldo atual do cliente
    $buscaSaldo = $conn->prepare("SELECT saldo FROM clientes WHERE email = ?");
    $buscaSaldo->bind_param("s", $email_cliente);
    $buscaSaldo->execute();
    $resSaldo = $buscaSaldo->get_result();

    if (!$resSaldo || $resSaldo->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Cliente não encontrado.']);
        $buscaSaldo->close();
        exit;
    }

    $saldoAtual = floatval($resSaldo->fetch_assoc()['saldo']);
    $buscaSaldo->close();

    if ($saldoAtual < $diferenca) {
        echo json_encode(['success' => false, 'message' => 'Saldo insuficiente para cobrir a diferença de R$ ' . number_format($diferenca, 2, ',', '.')]);
        exit;
    }

    // Atualiza o saldo subtraindo a diferença
    $novoSaldo = $saldoAtual - $diferenca;
    $atualizaSaldo = $conn->prepare("UPDATE clientes SET saldo = ? WHERE email = ?");
    $atualizaSaldo->bind_param("ds", $novoSaldo, $email_cliente);
    $atualizaSaldo->execute();
    $atualizaSaldo->close();
}

// 📝 Atualiza o pedido
$jsonItens = json_encode($itens, JSON_UNESCAPED_UNICODE);

$update = $conn->prepare("UPDATE pedidos SET itens = ?, valor_total = ?, data_pedido = NOW(), hora_pedido = NOW() WHERE id = ?");
$update->bind_param("sdi", $jsonItens, $valor_total, $id);

if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Pedido atualizado com sucesso.', 'novo_valor' => $valor_total]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o pedido.']);
}

$update->close();
$conn->close();
?>
