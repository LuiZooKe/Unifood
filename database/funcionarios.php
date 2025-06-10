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
    $result = $conn->query("SELECT * FROM funcionario");
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

    // Busca e exclui usuário vinculado ao funcionário
    $stmtSelect = $conn->prepare("SELECT email FROM funcionario WHERE id = ?");
    $stmtSelect->bind_param("i", $id);
    $stmtSelect->execute();
    $result = $stmtSelect->get_result();
    $email = $result->fetch_assoc()['email'] ?? null;
    $stmtSelect->close();

    if ($email) {
        $stmtDelUser = $conn->prepare("DELETE FROM users WHERE email = ?");
        $stmtDelUser->bind_param("s", $email);
        $stmtDelUser->execute();
        $stmtDelUser->close();
    }

    // Exclui da tabela funcionario
    $stmt = $conn->prepare("DELETE FROM funcionario WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Funcionário excluído.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao excluir funcionário.']);
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

    $fields = ['nome', 'email', 'cpf', 'data_nascimento', 'logradouro', 'numero', 'bairro', 'cidade', 'telefone', 'data_admissao', 'cargo', 'salario'];
    $values = [];
    $params = '';

    foreach ($fields as $field) {
        $values[] = $data[$field] ?? '';
        $params .= 's';
    }
    $values[] = $id;
    $params .= 'i';

    $stmt = $conn->prepare("UPDATE funcionario SET nome=?, email=?, cpf=?, data_nascimento=?, logradouro=?, numero=?, bairro=?, cidade=?, telefone=?, data_admissao=?, cargo=?, salario=? WHERE id=?");
    $stmt->bind_param($params, ...$values);
    $stmt->execute();
    $stmt->close();

    // Atualizar nome e email na tabela users, se existir
    $stmtUser = $conn->prepare("UPDATE users SET nome = ?, email = ? WHERE email = (SELECT email FROM (SELECT email FROM funcionario WHERE id = ?) AS temp)");
    $stmtUser->bind_param("ssi", $data['nome'], $data['email'], $id);
    $stmtUser->execute();
    $stmtUser->close();

    echo json_encode(['success' => true, 'message' => 'Funcionário atualizado.']);
    $conn->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida.']);
exit;
