<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 📥 Ler dados recebidos (espera um array de itens)
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['itens']) || !is_array($data['itens'])) {
    echo json_encode(['success' => false, 'message' => 'Dados dos itens não enviados corretamente']);
    exit;
}

// 🔗 Conectar ao banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco']);
    exit;
}

$sucesso = true;
$mensagens = [];

foreach ($data['itens'] as $item) {
    $nome = $item['nome'] ?? '';
    $quantidade = intval($item['quantidade'] ?? 0);

    if ($nome === '' || $quantidade <= 0) {
        $mensagens[] = "Dados inválidos para o item: " . json_encode($item);
        $sucesso = false;
        continue;
    }

    // 🔍 Verificar quantidade atual no estoque
    $sqlSelect = "SELECT quantidade FROM produtos WHERE nome = ?";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->bind_param("s", $nome);
    $stmtSelect->execute();
    $result = $stmtSelect->get_result();

    if ($result->num_rows === 0) {
        $mensagens[] = "Produto '$nome' não encontrado no estoque.";
        $sucesso = false;
        $stmtSelect->close();
        continue;
    }

    $row = $result->fetch_assoc();
    $quantidadeAtual = intval($row['quantidade']); // 🔥 Corrigido aqui
    $novaQuantidade = $quantidadeAtual - $quantidade;

    if ($novaQuantidade < 0) {
        $mensagens[] = "Estoque insuficiente para o produto '$nome'.";
        $sucesso = false;
        $stmtSelect->close();
        continue;
    }

    $stmtSelect->close();

    // 📝 Atualizar estoque
    $sqlUpdate = "UPDATE produtos SET quantidade = ? WHERE nome = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->bind_param("is", $novaQuantidade, $nome);

    if ($stmtUpdate->execute()) {
        $mensagens[] = "Estoque do produto '$nome' atualizado para $novaQuantidade.";
    } else {
        $mensagens[] = "Erro ao atualizar estoque do produto '$nome'.";
        $sucesso = false;
    }

    $stmtUpdate->close();
}

$conn->close();

echo json_encode([
    'success' => $sucesso,
    'messages' => $mensagens
]);
?>
