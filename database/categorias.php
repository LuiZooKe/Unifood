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

// LISTAR CATEGORIAS
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

// CADASTRAR NOVA CATEGORIA
if ($action === 'cadastrar') {
    $input = json_decode(file_get_contents('php://input'), true);
    $nome = strtoupper(trim($input['nome'] ?? ''));

    // Validação do nome
    if ($nome === '' || !preg_match('/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+$/u', $nome)) {
        echo json_encode(["success" => false, "message" => "Nome inválido. Use apenas letras e espaços."]);
        exit;
    }

    // Verificar duplicidade
    $check = $conn->prepare("SELECT id FROM categorias WHERE nome = ?");
    $check->bind_param("s", $nome);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Categoria já existente."]);
        exit;
    }

    // Inserir nova categoria
    $stmt = $conn->prepare("INSERT INTO categorias (nome) VALUES (?)");
    $stmt->bind_param("s", $nome);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $conn->insert_id, "nome" => $nome]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao cadastrar categoria."]);
    }

    exit;
}

// EDITAR CATEGORIA EXISTENTE
if ($action === 'editar') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    $nome = strtoupper(trim($input['nome'] ?? ''));

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "ID inválido."]);
        exit;
    }

    // Validação do nome
    if ($nome === '' || !preg_match('/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]+$/u', $nome)) {
        echo json_encode(["success" => false, "message" => "Nome inválido. Use apenas letras e espaços."]);
        exit;
    }

    // Verificar se o novo nome já existe para outro ID
    $check = $conn->prepare("SELECT id FROM categorias WHERE nome = ? AND id != ?");
    $check->bind_param("si", $nome, $id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Já existe outra categoria com esse nome."]);
        exit;
    }

    // Atualizar nome da categoria
    $stmt = $conn->prepare("UPDATE categorias SET nome = ? WHERE id = ?");
    $stmt->bind_param("si", $nome, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $id, "nome" => $nome]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao editar categoria."]);
    }

    exit;
}

// EXCLUIR CATEGORIA
if ($action === 'deletar') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "ID inválido para exclusão."]);
        exit;
    }

    // Verifica se há produtos usando essa categoria
    $check = $conn->prepare("SELECT COUNT(*) FROM produtos WHERE categoria = (SELECT nome FROM categorias WHERE id = ?)");
    $check->bind_param("i", $id);
    $check->execute();
    $check->bind_result($total);
    $check->fetch();
    $check->close();

    if ($total > 0) {
        echo json_encode(["success" => false, "message" => "Não é possível excluir. Categoria em uso por produtos."]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM categorias WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Erro ao excluir categoria."]);
    }

    exit;
}

// Ação inválida
echo json_encode(["success" => false, "message" => "Ação inválida."]);
?>
