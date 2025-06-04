<?php
// Ativa exibição de erros para depuração
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

// Define tipo de retorno
header('Content-Type: application/json');

// Coleta os dados
$nome = $_POST['nome'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$preco = $_POST['preco'] ?? '';
$quantidade = $_POST['quantidade'] ?? '';
$imagem = $_FILES['imagem'] ?? null;

// Validação básica
if (!$nome || !$descricao || !$preco || !$quantidade || !$imagem) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    exit;
}

// Upload da imagem
$uploadDir = __DIR__ . '/imgProdutos/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = pathinfo($imagem['name'], PATHINFO_EXTENSION);
$nomeArquivo = uniqid('produto_') . '.' . $ext;
$caminhoCompleto = $uploadDir . $nomeArquivo;

if (!move_uploaded_file($imagem['tmp_name'], $caminhoCompleto)) {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar a imagem.']);
    exit;
}

// Caminho salvo no banco (relativo à raiz do projeto)
$caminhoImagem = 'imgProdutos/' . $nomeArquivo;

// Conexão com banco de dados
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco de dados.']);
    exit;
}

// Prepara e executa inserção no banco
$stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, quantidade, imagem) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdss", $nome, $descricao, $preco, $quantidade, $caminhoImagem);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Produto cadastrado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar o produto']);
}

$stmt->close();
$conn->close();
?>
