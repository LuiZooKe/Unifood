<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ler dados recebidos
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['saldo'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$email = $data['email'];
$valorAdicionar = floatval($data['saldo']);

if ($valorAdicionar <= 0 || $valorAdicionar > 9999.99) {
    echo json_encode(['success' => false, 'message' => 'Valor de saldo inválido']);
    exit;
}

// Conectar ao banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão']);
    exit;
}

// Buscar saldo atual
$sql = "SELECT saldo FROM clientes WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

$row = $result->fetch_assoc();
$saldoAtual = floatval($row['saldo']);

// Calcular novo saldo
$novoSaldo = $saldoAtual + $valorAdicionar;

// Atualizar saldo no banco
$sqlUpdate = "UPDATE clientes SET saldo = ? WHERE email = ?";
$stmtUpdate = $conn->prepare($sqlUpdate);
$stmtUpdate->bind_param("ds", $novoSaldo, $email);

if ($stmtUpdate->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Saldo atualizado com sucesso',
        'saldo_atual' => $novoSaldo
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar saldo']);
}

$stmt->close();
$stmtUpdate->close();
$conn->close();
?>
