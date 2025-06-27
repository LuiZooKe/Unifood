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

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID do pedido ausente']);
    exit;
}

$id = intval($data['id']);

$update = $conn->prepare("UPDATE pedidos SET status = 'EXCLUÍDO' WHERE id = ?");
$update->bind_param("i", $id);

if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Pedido excluído com sucesso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao excluir pedido.']);
}

$update->close();
$conn->close();
?>
