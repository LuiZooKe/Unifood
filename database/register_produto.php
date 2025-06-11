<?php
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

header('Content-Type: application/json');

// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados.']);
    exit;
}

// Coleta dos campos
$nome             = $_POST['nome'] ?? '';
$descricao        = $_POST['descricao'] ?? '';
$preco            = $_POST['preco'] ?? 0;
$custo            = $_POST['custo'] ?? 0;
$quantidade       = $_POST['quantidade'] ?? 0;
$id_fornecedor    = $_POST['id_fornecedor'] ?? '';
$nome_fornecedor  = $_POST['nome_fornecedor'] ?? '';
$categoria        = $_POST['categoria'] ?? '';
$unidade_medida   = $_POST['unidade_medida'] ?? '';
$lucro            = $_POST['lucro'] ?? 0;
$imagem           = $_FILES['imagem'] ?? null;

// Validação básica
if (!$nome || !$descricao || !$preco || !$custo || !$categoria || !$unidade_medida) {
    echo json_encode(['success' => false, 'message' => 'Preencha todos os campos obrigatórios.']);
    exit;
}

// Upload de imagem
$caminhoImagem = null;
if ($imagem && $imagem['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/imgProdutos/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $ext = strtolower(pathinfo($imagem['name'], PATHINFO_EXTENSION));
    $nomeImagem = uniqid('produto_', true) . '.' . $ext;
    $caminhoFisico = $uploadDir . $nomeImagem;

    if (!move_uploaded_file($imagem['tmp_name'], $caminhoFisico)) {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar a imagem.']);
        exit;
    }

    $caminhoImagem = $nomeImagem;
}

// Prepara e executa a query
$stmt = $conn->prepare("INSERT INTO produtos (
    nome, descricao, preco, quantidade, imagem,
    custo, id_fornecedor, nome_fornecedor, categoria, unidade_medida, lucro
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param(
    "ssdisdssssd",
    $nome,
    $descricao,
    $preco,
    $quantidade,
    $caminhoImagem,
    $custo,
    $id_fornecedor,
    $nome_fornecedor,
    $categoria,
    $unidade_medida,
    $lucro
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Produto cadastrado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar o produto']);
}

$stmt->close();
$conn->close();
