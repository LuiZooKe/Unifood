<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexão
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão']);
    exit;
}

$email = $_GET['email'] ?? $_POST['email'] ?? (json_decode(file_get_contents('php://input'), true)['email'] ?? '');

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email não enviado']);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        u.nome, 
        u.email, 
        u.senha, 
        u.tipo_usuario,
        c.logradouro, 
        c.numero, 
        c.bairro, 
        c.cidade, 
        c.telefone, 
        c.saldo, 
        c.numero_cartao, 
        c.nome_cartao, 
        c.validade_cartao, 
        c.cvv_cartao
    FROM users u
    LEFT JOIN clientes c ON u.email = c.email
    WHERE u.email = ?
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
    exit;
}

$dados = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'dados' => [
        'nome' => $dados['nome'],
        'email' => $dados['email'],
        'senha' => $dados['senha'],
        'tipo_usuario' => intval($dados['tipo_usuario']),
        'logradouro' => $dados['logradouro'] ?? '',
        'numero' => $dados['numero'] ?? '',
        'bairro' => $dados['bairro'] ?? '',
        'cidade' => $dados['cidade'] ?? '',
        'telefone' => $dados['telefone'] ?? '',
        'saldo' => $dados['saldo'] ?? 0,
        'numero_cartao' => $dados['numero_cartao'] ?? '',
        'nome_cartao' => $dados['nome_cartao'] ?? '',
        'validade_cartao' => $dados['validade_cartao'] ?? '',
        'cvv_cartao' => $dados['cvv_cartao'] ?? '',
    ]
]);

$conn->close();
?>
