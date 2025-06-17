<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔥 Conecta ao banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit;
}

// 🔥 Recebe os dados
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$senha = $data['senha'] ?? '';

// 🔥 Validação básica
if (empty($email) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
    exit;
}

// 🔥 Consulta o usuário
$stmt = $conn->prepare("SELECT senha, tipo_usuario FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email não cadastrado']);
    exit;
}

$user = $result->fetch_assoc();

// 🔐 Verifica a senha
if (!password_verify($senha, $user['senha'])) {
    echo json_encode(['success' => false, 'message' => 'Senha incorreta']);
    exit;
}

// 🔥 Login bem-sucedido
echo json_encode([
    'success' => true,
    'message' => 'Login realizado com sucesso',
    'tipo_usuario' => $user['tipo_usuario'],
    'email' => $email
]);

$stmt->close();
$conn->close();
?>
