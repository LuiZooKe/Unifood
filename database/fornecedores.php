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
    $result = $conn->query("SELECT * FROM fornecedor");
    $fornecedores = [];

    while ($row = $result->fetch_assoc()) {
        $fornecedores[] = $row;
    }

    echo json_encode(['success' => true, 'fornecedores' => $fornecedores]);
    exit;
}

if ($action === 'deletar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID inválido.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM fornecedor WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Fornecedor excluído.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir fornecedor.']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

if ($action === 'atualizar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID inválido.']);
        exit;
    }

    $fields = ['nome', 'email', 'cpf', 'cnpj', 'logradouro', 'numero', 'bairro', 'cidade', 'telefone'];
    $values = [];
    $params = '';

    foreach ($fields as $field) {
        $values[] = $data[$field] ?? '';
        $params .= 's';
    }
    $values[] = $id;
    $params .= 'i';

    $sql = "UPDATE fornecedor SET nome=?, email=?, cpf=?, cnpj=?, logradouro=?, numero=?, bairro=?, cidade=?, telefone=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($params, ...$values);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Fornecedor atualizado.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar fornecedor.']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida.']);
exit;
