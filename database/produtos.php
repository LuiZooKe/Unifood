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

    // Pega o nome da imagem antiga para excluir o arquivo
    $stmt = $conn->prepare("SELECT imagem FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($imagemAntiga);
    $stmt->fetch();
    $stmt->close();

    if ($imagemAntiga) {
        $caminhoImagem = __DIR__ . '/imgProdutos/' . $imagemAntiga;
        if (file_exists($caminhoImagem)) {
            unlink($caminhoImagem);
        }
    }

    $stmt = $conn->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Produto deletado com sucesso']);
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

    // Pega o nome da imagem antiga
    $stmt = $conn->prepare("SELECT imagem FROM produtos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($imagemAntiga);
    $stmt->fetch();
    $stmt->close();

    $novaImagemNome = $imagemAntiga;

    if (isset($_FILES['imagem']) && $_FILES['imagem']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['imagem']['tmp_name'];
        $nomeOriginal = basename($_FILES['imagem']['name']);
        $ext = strtolower(pathinfo($nomeOriginal, PATHINFO_EXTENSION));

        $novoNomeArquivo = "img_{$id}_" . time() . "." . $ext;

        $pastaDestino = __DIR__ . '/imgProdutos/';
        $destinoCompleto = $pastaDestino . $novoNomeArquivo;

        if (move_uploaded_file($tmpName, $destinoCompleto)) {
            // Excluir imagem antiga
            if ($imagemAntiga && $imagemAntiga !== $novoNomeArquivo) {
                $caminhoImagemAntiga = $pastaDestino . $imagemAntiga;
                if (file_exists($caminhoImagemAntiga)) {
                    unlink($caminhoImagemAntiga);
                }
            }
            $novaImagemNome = $novoNomeArquivo;
        } else {
            echo json_encode(['success' => false, 'message' => 'Falha ao mover arquivo de imagem']);
            exit;
        }
    }

    $stmt = $conn->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ?, imagem = ? WHERE id = ?");
    $stmt->bind_param("ssdisi", $nome, $descricao, $preco, $quantidade, $novaImagemNome, $id);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Produto atualizado com sucesso']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Ação inválida']);
