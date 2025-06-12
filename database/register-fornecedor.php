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

// Pegar e limpar dados
$nome       = isset($input['nome']) ? trim($input['nome']) : '';
$email      = isset($input['email']) ? trim($input['email']) : '';
$cpf        = isset($input['cpf']) && $input['cpf'] !== null && $input['cpf'] !== '' ? trim($input['cpf']) : null;
$cnpj       = isset($input['cnpj']) && $input['cnpj'] !== null && $input['cnpj'] !== '' ? trim($input['cnpj']) : null;
$logradouro = isset($input['logradouro']) ? trim($input['logradouro']) : '';
$numero     = isset($input['numero']) ? trim($input['numero']) : '';
$bairro     = isset($input['bairro']) ? trim($input['bairro']) : '';
$cidade     = isset($input['cidade']) ? trim($input['cidade']) : '';
$telefone   = isset($input['telefone']) && $input['telefone'] !== null && $input['telefone'] !== '' ? trim($input['telefone']) : null;

// Validações
if (!$nome) {
    echo json_encode(['success' => false, 'message' => 'O nome é obrigatório']);
    exit;
}

if (!$cpf && !$cnpj) {
    echo json_encode(['success' => false, 'message' => 'CPF ou CNPJ é obrigatório']);
    exit;
}

// Conexão
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco: ' . $conn->connect_error]);
    exit;
}

// Verificar duplicidade de CPF
if ($cpf !== null) {
    $verificaCpf = $conn->prepare("SELECT id FROM fornecedor WHERE cpf = ?");
    $verificaCpf->bind_param("s", $cpf);
    $verificaCpf->execute();
    $verificaCpf->store_result();

    if ($verificaCpf->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'CPF já cadastrado']);
        $verificaCpf->close();
        $conn->close();
        exit;
    }

    $verificaCpf->close();
}

// Verificar duplicidade de CNPJ
if ($cnpj !== null) {
    $verificaCnpj = $conn->prepare("SELECT id FROM fornecedor WHERE cnpj = ?");
    $verificaCnpj->bind_param("s", $cnpj);
    $verificaCnpj->execute();
    $verificaCnpj->store_result();

    if ($verificaCnpj->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'CNPJ já cadastrado']);
        $verificaCnpj->close();
        $conn->close();
        exit;
    }

    $verificaCnpj->close();
}

// Preparar INSERT
$stmt = $conn->prepare("INSERT INTO fornecedor (
    nome, email, cpf, cnpj, logradouro, numero, bairro, cidade, telefone
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erro na preparação da query: ' . $conn->error]);
    $conn->close();
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
