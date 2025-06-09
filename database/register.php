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

if (!isset($data['nome'], $data['email'], $data['senha'], $data['tipo_usuario'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    exit;
}

$tipo_usuario = intval($data['tipo_usuario']);
$nome = htmlspecialchars(trim($data['nome']));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$senha = password_hash($data['senha'], PASSWORD_DEFAULT);

$cpf = htmlspecialchars(trim($data['cpf']));
$data_nascimento = $data['data_nascimento'];
$logradouro = htmlspecialchars(trim($data['logradouro']));
$numero = htmlspecialchars(trim($data['numero']));
$bairro = htmlspecialchars(trim($data['bairro']));
$cidade = htmlspecialchars(trim($data['cidade']));
$telefone = htmlspecialchars(trim($data['telefone']));
$data_admissao = $data['data_admissao'];
$cargo = htmlspecialchars(trim($data['cargo']));
$salario = floatval($data['salario']);

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro ao conectar ao banco']);
    exit;
}

// Verifica se o e-mail já existe
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email já cadastrado.']);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Inserir na tabela users
$stmt = $conn->prepare("INSERT INTO users (nome, email, senha, email_confirmado, tipo_usuario) VALUES (?, ?, ?, 'nao', ?)");
$stmt->bind_param("sssi", $nome, $email, $senha, $tipo_usuario);

if ($stmt->execute()) {
    $user_id = $stmt->insert_id;

    // Inserir na tabela funcionario
    $stmtFuncionario = $conn->prepare("INSERT INTO funcionario (
        nome, email, cpf, data_nascimento, logradouro, numero, bairro, cidade, telefone, data_admissao, cargo, salario
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmtFuncionario->bind_param(
        "sssssssssssd",
        $nome, $email, $cpf, $data_nascimento, $logradouro, $numero,
        $bairro, $cidade, $telefone, $data_admissao, $cargo, $salario
    );

    if ($stmtFuncionario->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuário e funcionário cadastrados com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao salvar funcionário']);
    }

    $stmtFuncionario->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar usuário']);
}

$stmt->close();
$conn->close();
?>
