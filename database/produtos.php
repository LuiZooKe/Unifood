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
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID inválido.']);
        exit;
    }

    // Buscar a imagem atual do produto
    $stmt = $conn->prepare("SELECT imagem FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($imagem);
    $stmt->fetch();
    $stmt->close();

    // Deletar o arquivo da imagem, se existir
    if ($imagem) {
        $caminhoImagem = __DIR__ . '/imgProdutos/' . $imagem;
        if (file_exists($caminhoImagem)) {
            unlink($caminhoImagem);
        }
    }

    // Deletar o produto do banco
    $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Produto deletado com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao deletar produto.']);
    }

    $stmt->close();
    $conn->close();
    exit;
}


if ($action === 'atualizar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $nome = $_POST['nome'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $preco = $_POST['preco'] ?? 0;
    $quantidade = $_POST['quantidade'] ?? 0;

    if (!$id || !$nome || !$descricao || !$preco) {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
        exit;
    }

    $imagem_nome = null;

    // Se uma nova imagem foi enviada
    if (!empty($_FILES['imagem']['name'])) {
        // Buscar imagem anterior
        $res = $conn->query("SELECT imagem FROM produtos WHERE id = $id");
        if ($res && $row = $res->fetch_assoc()) {
            $imagem_antiga = $row['imagem'];
            if ($imagem_antiga && file_exists("imgProdutos/$imagem_antiga")) {
                unlink("imgProdutos/$imagem_antiga");
            }
        }

        $extensao = pathinfo($_FILES['imagem']['name'], PATHINFO_EXTENSION);
        $imagem_nome = uniqid() . "." . $extensao;
        move_uploaded_file($_FILES['imagem']['tmp_name'], "imgProdutos/" . $imagem_nome);

        $stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ?, imagem = ? WHERE id = ?");
        $stmt->bind_param("ssdiss", $nome, $descricao, $preco, $quantidade, $imagem_nome, $id);
    } else {
        $stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE id = ?");
        $stmt->bind_param("ssdii", $nome, $descricao, $preco, $quantidade, $id);
    }

    $stmt->execute();
    echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida']);
