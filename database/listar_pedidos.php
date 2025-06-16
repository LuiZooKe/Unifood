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

if (!isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email não informado']);
    exit;
}

$email = $data['email'];

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão']);
    exit;
}

$sql = "SELECT * FROM pedidos WHERE email_cliente = ? ORDER BY data_pedido DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$pedidos = [];

while ($row = $result->fetch_assoc()) {
    $row['itens'] = json_decode($row['itens']);
    $pedidos[] = $row;
}

echo json_encode(['success' => true, 'pedidos' => $pedidos]);

$conn->close();
?>
