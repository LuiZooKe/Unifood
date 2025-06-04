<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'listar') {
    $result = $conn->query("SELECT * FROM produtos");
    $produtos = [];

    while ($row = $result->fetch_assoc()) {
        $produtos[] = $row;
    }

    echo json_encode(['success' => true, 'produtos' => $produtos]);
    exit;
}

if ($action === 'deletar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID não informado']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Produto deletado com sucesso']);
    exit;
}

if ($action === 'atualizar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $id = $data['id'] ?? null;
    $nome = $data['nome'] ?? '';
    $descricao = $data['descricao'] ?? '';
    $preco = $data['preco'] ?? 0;
    $quantidade = $data['quantidade'] ?? 0;

    if (!$id || !$nome || !$descricao || !$preco) {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE id = ?");
    $stmt->bind_param("ssdii", $nome, $descricao, $preco, $quantidade, $id);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida']);
