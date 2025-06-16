<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');

// Libera CORS pré-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit();
}

// Recebendo o email (GET ou POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';
} else {
    $email = $_GET['email'] ?? '';
}

// Verifica se o email foi enviado
if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email não enviado']);
    exit();
}

// 🔐 Verifica se existe na tabela users
$stmtUser = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmtUser->bind_param("s", $email);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();

if ($resultUser->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit();
}

// 🔍 Busca os dados na tabela clientes
$stmtCliente = $conn->prepare("SELECT * FROM clientes WHERE email = ?");
$stmtCliente->bind_param("s", $email);
$stmtCliente->execute();
$resultCliente = $stmtCliente->get_result();

if ($resultCliente->num_rows > 0) {
    $row = $resultCliente->fetch_assoc();

    echo json_encode([
        'success' => true,
        'dados' => [
            'nome' => $row['nome'] ?? '',
            'email' => $email,
            'logradouro' => $row['logradouro'] ?? '',
            'numero' => $row['numero'] ?? '',
            'bairro' => $row['bairro'] ?? '',
            'cidade' => $row['cidade'] ?? '',
            'celular' => $row['telefone'] ?? '',
            'saldo' => floatval($row['saldo'] ?? 0),
            'numero_cartao' => $row['numero_cartao'] ?? '',
            'nome_cartao' => $row['nome_cartao'] ?? '',
            'validade_cartao' => $row['validade_cartao'] ?? '',
            'cvv_cartao' => $row['cvv_cartao'] ?? ''
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Dados do cliente não encontrados']);
}

$stmtUser->close();
$stmtCliente->close();
$conn->close();
?>
