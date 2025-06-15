<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Recebe os dados enviados
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email não fornecido']);
    exit;
}

$email = $data['email'];

// Conexão com o banco de dados
$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados']);
    exit;
}

// Se a ação for remover
if (isset($data['acao']) && $data['acao'] === 'remover') {
    $sql = "UPDATE clientes SET 
        numero_cartao = NULL, 
        nome_cartao = NULL, 
        validade_cartao = NULL, 
        cvv_cartao = NULL
        WHERE email = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cartão removido com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao remover cartão']);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// Caso contrário, é cadastro ou atualização de cartão
$numero = $data['numero_cartao'] ?? '';
$nome = $data['nome_cartao'] ?? '';
$validade = $data['validade_cartao'] ?? '';
$cvv = $data['cvv_cartao'] ?? '';

// Verificar se todos os dados foram fornecidos
if (!$numero || !$nome || !$validade || !$cvv) {
    echo json_encode(['success' => false, 'message' => 'Todos os dados do cartão são obrigatórios']);
    exit;
}

$sql = "UPDATE clientes SET 
    numero_cartao = ?, 
    nome_cartao = ?, 
    validade_cartao = ?, 
    cvv_cartao = ?
    WHERE email = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $numero, $nome, $validade, $cvv, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Cartão salvo com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar cartão']);
}

$stmt->close();
$conn->close();
?>
