<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit;
}

// 🔥 Suporte tanto para GET quanto POST JSON
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';
} else {
    $email = $_GET['email'] ?? '';
}

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email não enviado']);
    exit;
}

// Valida se o email existe na tabela users
$check = $conn->query("SELECT * FROM users WHERE email = '$email'");
if ($check->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

// Busca os dados pessoais na tabela clientes
$result = $conn->query("SELECT * FROM clientes WHERE email = '$email'");

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'usuario' => [
            'nome' => $row['nome'] ?? '',
            'email' => $email,
            'logradouro' => $row['logradouro'] ?? '',
            'numero' => $row['numero'] ?? '',
            'bairro' => $row['bairro'] ?? '',
            'cidade' => $row['cidade'] ?? '',
            'celular' => $row['telefone'] ?? '',
            'saldo' => $row['saldo'] ?? 0,
            'numero_cartao' => $row['numero_cartao'] ?? '',
            'nome_cartao' => $row['nome_cartao'] ?? '',
            'validade_cartao' => $row['validade_cartao'] ?? '',
            'cvv_cartao' => $row['cvv_cartao'] ?? ''
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Dados do cliente não encontrados']);
}

$conn->close();
?>
