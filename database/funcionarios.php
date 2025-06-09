<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Permite requisições de qualquer origem (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexão com banco
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'listar') {
    // Listar funcionários com tipo_usuario = 0
    $result = $conn->query("SELECT id, nome, email FROM users WHERE tipo_usuario = 3");
    $funcionarios = [];

    while ($row = $result->fetch_assoc()) {
        $funcionarios[] = $row;
    }

    echo json_encode(['success' => true, 'funcionarios' => $funcionarios]);
    exit;
}

if ($action === 'deletar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID inválido.']);
        exit;
    }

    // Deletar funcionário com tipo_usuario = 0 e id informado
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND tipo_usuario = 0");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Funcionário deletado com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao deletar funcionário.']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

if ($action === 'atualizar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe JSON para atualizar (não é multipart/form-data, pois não tem upload de arquivo)
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    $nome = $data['nome'] ?? '';
    $email = $data['email'] ?? '';

    if (!$id || !$nome || !$email) {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE users SET nome = ?, email = ? WHERE id = ? AND tipo_usuario = 0");
    $stmt->bind_param("ssi", $nome, $email, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Funcionário atualizado com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar funcionário.']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// Caso a ação não seja reconhecida
echo json_encode(['success' => false, 'message' => 'Ação inválida']);
exit;
