<?php
// Configurações de erro para desenvolvimento (desative em produção)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=utf-8');

// Ler o JSON enviado pelo frontend
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'JSON inválido']);
    exit;
}

// Verifica campos obrigatórios básicos
$nome      = trim($input['nome'] ?? '');
$email     = trim($input['email'] ?? '');
$cpf       = trim($input['cpf'] ?? '');
$cnpj      = trim($input['cnpj'] ?? '');
$logradouro= trim($input['logradouro'] ?? '');
$numero    = trim($input['numero'] ?? '');
$bairro    = trim($input['bairro'] ?? '');
$cidade    = trim($input['cidade'] ?? '');
$telefone  = trim($input['telefone'] ?? '');

if (!$nome) {
    echo json_encode(['success' => false, 'message' => 'O nome é obrigatório']);
    exit;
}

// Você pode adicionar outras validações (email, cpf/cnpj, telefone)...

// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco: ' . $conn->connect_error]);
    exit;
}

// Exemplo de validação simples para CPF ou CNPJ
if (!$cpf && !$cnpj) {
    echo json_encode(['success' => false, 'message' => 'CPF ou CNPJ é obrigatório']);
    exit;
}

// Preparar insert (ajuste os nomes dos campos conforme sua tabela)
$stmt = $conn->prepare("INSERT INTO fornecedor (
    nome, email, cpf, cnpj, logradouro, numero, bairro, cidade, telefone
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erro na preparação da query: ' . $conn->error]);
    exit;
}

$stmt->bind_param(
    "sssssssss",
    $nome,
    $email,
    $cpf,
    $cnpj,
    $logradouro,
    $numero,
    $bairro,
    $cidade,
    $telefone
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Fornecedor cadastrado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar fornecedor: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
exit;
