<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_GET['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email não informado']);
    exit;
}

$email = $_GET['email'];

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão: ' . $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare("SELECT nome, email, logradouro, numero, bairro, cidade, telefone, saldo, numero_cartao, nome_cartao, validade_cartao, cvv_cartao FROM clientes WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $dados = $result->fetch_assoc();
    $dados['saldo'] = floatval($dados['saldo']) ?? 0;
    echo json_encode(['success' => true, 'dados' => $dados]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
}

$stmt->close();
$conn->close();
?>
