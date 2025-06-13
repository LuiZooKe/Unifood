<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$user = 'root';
$pass = ''; // sua senha, se tiver
$db = 'unifood_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validação dos dados obrigatórios
if (
    !isset($data['nome']) || 
    !isset($data['email']) || 
    !isset($data['senha']) || 
    !isset($data['tipo_usuario'])
) {
    echo json_encode(['success' => false, 'message' => 'Dados obrigatórios faltando']);
    exit;
}

// Sanitização dos dados obrigatórios
$nome = $conn->real_escape_string(trim($data['nome']));
$email = $conn->real_escape_string(trim($data['email']));
$senha = password_hash($data['senha'], PASSWORD_DEFAULT);
$tipo_usuario = intval($data['tipo_usuario']);

// Dados opcionais (irão para a tabela de clientes)
$logradouro = isset($data['logradouro']) ? $conn->real_escape_string(trim($data['logradouro'])) : null;
$numero = isset($data['numero']) ? $conn->real_escape_string(trim($data['numero'])) : null;
$bairro = isset($data['bairro']) ? $conn->real_escape_string(trim($data['bairro'])) : null;
$cidade = isset($data['cidade']) ? $conn->real_escape_string(trim($data['cidade'])) : null;
$telefone = isset($data['telefone']) ? $conn->real_escape_string(trim($data['telefone'])) : null;
$saldo = isset($data['saldo']) ? floatval($data['saldo']) : 0.00;

// Verificar se já existe usuário com esse email
$verifica = $conn->query("SELECT * FROM users WHERE email = '$email'");
if ($verifica->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email já cadastrado']);
    exit;
}

// Inserir na tabela USERS (controle de login)
$sql_user = "INSERT INTO users (tipo_usuario, nome, email, senha) 
VALUES ($tipo_usuario, '$nome', '$email', '$senha')";

if (!$conn->query($sql_user)) {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar usuário: ' . $conn->error]);
    exit;
}

// Inserir na tabela CLIENTES (dados de contato iniciais)
$sql_cliente = "INSERT INTO clientes (
    nome, email, logradouro, numero, bairro, cidade, telefone, saldo
) VALUES (
    '$nome', '$email',
    " . ($logradouro ? "'$logradouro'" : "NULL") . ",
    " . ($numero ? "'$numero'" : "NULL") . ",
    " . ($bairro ? "'$bairro'" : "NULL") . ",
    " . ($cidade ? "'$cidade'" : "NULL") . ",
    " . ($telefone ? "'$telefone'" : "NULL") . ",
    $saldo
)";

if (!$conn->query($sql_cliente)) {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar cliente: ' . $conn->error]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Cadastro realizado com sucesso!']);
$conn->close();
?>
