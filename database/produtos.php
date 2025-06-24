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

    $stmt = $conn->prepare("SELECT imagem FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($imagem);
    $stmt->fetch();
    $stmt->close();

    if ($imagem) {
        $caminhoImagem = __DIR__ . '/imgProdutos/' . $imagem;
        if (file_exists($caminhoImagem)) {
            unlink($caminhoImagem);
        }
    }

    $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Produto deletado com sucesso.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao deletar produto.']);
    }
    $stmt->close();
    exit;
}

if ($action === 'atualizar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $nome = $_POST['nome'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $preco = $_POST['preco'] ?? 0;
    $custo = $_POST['custo'] ?? 0;
    $quantidade = $_POST['quantidade'] ?? 0;
    $id_fornecedor = $_POST['id_fornecedor'] ?? '';
    $nome_fornecedor = $_POST['nome_fornecedor'] ?? '';
    $categoria = $_POST['categoria'] ?? '';
    $unidade_medida = $_POST['unidade_medida'] ?? '';
    $lucro = $_POST['lucro'] ?? 0;

    if (!$id || !$nome || !$descricao || !$preco || !$custo || !$categoria || !$unidade_medida) {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
        exit;
    }

    $imagem_nome = null;

    if (!empty($_FILES['imagem']['name'])) {
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

        $stmt = $conn->prepare("UPDATE produtos SET 
            nome = ?, descricao = ?, preco = ?, custo = ?, quantidade = ?, imagem = ?, 
            id_fornecedor = ?, nome_fornecedor = ?, categoria = ?, unidade_medida = ?, lucro = ? 
            WHERE id = ?");
        $stmt->bind_param("ssddisssssdi", $nome, $descricao, $preco, $custo, $quantidade, $imagem_nome,
            $id_fornecedor, $nome_fornecedor, $categoria, $unidade_medida, $lucro, $id);
    } else {
        $stmt = $conn->prepare("UPDATE produtos SET 
            nome = ?, descricao = ?, preco = ?, custo = ?, quantidade = ?, 
            id_fornecedor = ?, nome_fornecedor = ?, categoria = ?, unidade_medida = ?, lucro = ? 
            WHERE id = ?");
        $stmt->bind_param("ssddissssdi", $nome, $descricao, $preco, $custo, $quantidade,
            $id_fornecedor, $nome_fornecedor, $categoria, $unidade_medida, $lucro, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar produto']);
    }
    $stmt->close();
    exit;
}

if ($action === 'atualizar_estoque_rapido' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $quantidade = $_POST['quantidade'] ?? null;

    if (!$id || $quantidade === null) {
        echo json_encode(['success' => false, 'message' => 'ID ou quantidade inválidos.']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE produtos SET quantidade = ? WHERE id = ?");
    $stmt->bind_param("ii", $quantidade, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Estoque atualizado com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar estoque.']);
    }
    $stmt->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida']);
?>
