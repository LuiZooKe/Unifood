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

$data = json_decode(file_get_contents("php://input"), true);

// Validação básica
if (!isset($data['nome'], $data['descricao'], $data['preco'], $data['quantidade'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$nome = trim($data['nome']);
$descricao = trim($data['descricao']);
$preco = floatval($data['preco']);
$quantidade = intval($data['quantidade']);

// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco']);
    exit;
}

// Inserção no banco
$stmt = $conn->prepare("INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssdi", $nome, $descricao, $preco, $quantidade);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Produto cadastrado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar o produto']);
}

$stmt->close();
$conn->close();
?>
