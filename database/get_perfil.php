<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit;
}

// 🔥 Coleta o email de qualquer forma possível
$email = $_GET['email'] ??
         $_POST['email'] ??
         (json_decode(file_get_contents('php://input'), true)['email'] ?? '');

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email não enviado']);
    exit;
}

// 🔍 Verifica se o usuário existe na tabela users
$check = $conn->prepare("SELECT nome, tipo_usuario FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$resultUser = $check->get_result();

if ($resultUser->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

$userData = $resultUser->fetch_assoc();

// 🔍 Busca os dados na tabela clientes
$cliente = $conn->prepare("SELECT * FROM clientes WHERE email = ?");
$cliente->bind_param("s", $email);
$cliente->execute();
$resultCliente = $cliente->get_result();

if ($resultCliente->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Dados do cliente não encontrados']);
    exit;
}

$cli = $resultCliente->fetch_assoc();

echo json_encode([
    'success' => true,
    'dados' => [
        'nome' => $userData['nome'],
        'email' => $email,
        'tipo_usuario' => intval($userData['tipo_usuario']),
        'logradouro' => $cli['logradouro'] ?? '',
        'numero' => $cli['numero'] ?? '',
        'bairro' => $cli['bairro'] ?? '',
        'cidade' => $cli['cidade'] ?? '',
        'telefone' => $cli['telefone'] ?? '',
        'saldo' => $cli['saldo'] ?? 0,
        'numero_cartao' => $cli['numero_cartao'] ?? '',
        'nome_cartao' => $cli['nome_cartao'] ?? '',
        'validade_cartao' => $cli['validade_cartao'] ?? '',
        'cvv_cartao' => $cli['cvv_cartao'] ?? '',
    ]
]);

$conn->close();
?>
