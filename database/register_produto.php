<?php
// Ativa exibição de erros
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Tipo de retorno
header('Content-Type: application/json');

// Conexão com banco de dados
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados.']);
    exit;
}

// Coleta os dados
$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? '';
$quantidade = $_POST['quantidade'] ?? '';
$imagem = $_FILES['imagem'] ?? null;

// Validação básica (imagem não obrigatória)
if (!$nome || !$descricao || !$preco || !$quantidade) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    exit;
}

// Inicializa variável do nome da imagem no banco como NULL
$caminhoImagem = null;

// Se enviou imagem, processa upload
if ($imagem && $imagem['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/imgProdutos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $ext = pathinfo($imagem['name'], PATHINFO_EXTENSION);
    $ext = strtolower($ext);
    $nomeImagem = uniqid('produto_', true) . '.' . $ext;
    $caminhoFisico = $uploadDir . $nomeImagem;

    if (!move_uploaded_file($imagem['tmp_name'], $caminhoFisico)) {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar a imagem.']);
        exit;
    }

    $caminhoImagem = $nomeImagem;
}

// Prepara a query com ou sem imagem
if ($caminhoImagem) {
    $stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, quantidade, imagem) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdss", $nome, $descricao, $preco, $quantidade, $caminhoImagem);
} else {
    $stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssd", $nome, $descricao, $preco, $quantidade);
}

// Executa e responde
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Produto cadastrado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar o produto']);
}

$stmt->close();
$conn->close();
