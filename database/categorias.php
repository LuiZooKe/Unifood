<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");

// Conexão com o banco de dados
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro na conexão com o banco de dados."]));
}

// Captura a ação
$action = $_GET['action'] ?? '';

// 🔍 LISTAR CATEGORIAS
if ($action === 'listar') {
    $sql = "SELECT * FROM categorias ORDER BY nome";
    $result = $conn->query($sql);

    $categorias = [];
    while ($row = $result->fetch_assoc()) {
        $categorias[] = $row;
    }

    echo json_encode(["success" => true, "categorias" => $categorias]);
    exit;
}

// ➕ CADASTRAR NOVA CATEGORIA
if ($action === 'cadastrar') {
    $input = json_decode(file_get_contents('php://input'), true);
    $nome = trim($input['nome'] ?? '');

    if ($nome === '') {
        echo json_encode(["success" => false, "message" => "O nome da categoria é obrigatório."]);
        exit;
    }

    // Verificar se já existe a categoria
    $check = $conn->prepare("SELECT id FROM categorias WHERE nome = ?");
    $check->bind_param("s", $nome);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Categoria já existente."]);
        exit;
    }

    // Inserir a nova categoria
    $stmt = $conn->prepare("INSERT INTO categorias (nome) VALUES (?)");
    $stmt->bind_param("s", $nome);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "id" => $conn->insert_id,
            "nome" => $nome
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao cadastrar categoria."]);
    }

    exit;
}

// 🚫 Ação inválida
echo json_encode(["success" => false, "message" => "Ação inválida."]);
?>
