<?php
// CORS - Permitir origem e headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Responder rápido o preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Definir o tipo de conteúdo JSON
header('Content-Type: application/json');

// Só aceitar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método inválido.']);
    exit;
}

// Recebe dados JSON do corpo da requisição
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email não fornecido.']);
    exit;
}

// Configuração do banco
$host = "localhost";
$user = "root";
$pass = "";
$dbName = "unifood_db";

$conn = new mysqli($host, $user, $pass, $dbName);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco.']);
    exit;
}

// Verifica se o email existe
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Para não revelar se email existe
    echo json_encode(['success' => true, 'message' => 'Se o email existir, um link foi enviado para redefinir a senha.']);
    $conn->close();
    exit;
}

// Gera token e expiração (1 hora)
$token = bin2hex(random_bytes(32));
$expira = date("Y-m-d H:i:s", time() + 3600);

// Atualiza token no banco
$stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_token_expira = ? WHERE email = ?");
$stmt->bind_param("sss", $token, $expira, $email);
$stmt->execute();

// Link para o frontend React (ajuste a URL se necessário)
$link = "http://localhost:3000/redefinir-senha?token=" . $token;

// Envia email (certifique-se que enviar-email.php está configurado e no caminho correto)
require 'enviar-email.php';

if (enviarEmailRedefinicao($email, $link)) {
    echo json_encode(['success' => true, 'message' => 'Se o email existir, um link foi enviado para redefinir a senha.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao enviar o e-mail.']);
}

$conn->close();
?>
