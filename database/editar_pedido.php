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
$valor_total = floatval(str_replace(',', '.', $data['valor_total']));

// 💥 Verifica se o pedido existe e está pendente
$verifica = $conn->prepare("SELECT status FROM pedidos WHERE id = ?");
$verifica->bind_param("i", $id);
$verifica->execute();
$result = $verifica->get_result();

if (!$result || $result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Pedido não encontrado.']);
    $verifica->close();
    exit;
}

$row = $result->fetch_assoc();
if (strtoupper($row['status']) !== 'PENDENTE') {
    echo json_encode(['success' => false, 'message' => 'Não é possível editar um pedido finalizado.']);
    $verifica->close();
    exit;
}
$verifica->close();

// 📝 Atualiza o pedido
$jsonItens = json_encode($itens, JSON_UNESCAPED_UNICODE);

$update = $conn->prepare("UPDATE pedidos SET itens = ?, valor_total = ?, data_pedido = NOW(), hora_pedido = NOW() WHERE id = ?");
$update->bind_param("sdi", $jsonItens, $valor_total, $id);

if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Pedido atualizado com sucesso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o pedido.']);
}

$update->close();
$conn->close();
?>
