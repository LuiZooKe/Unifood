<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dados = json_decode(file_get_contents("php://input"), true);

// Validação básica
if (!isset($dados['id']) || !isset($dados['itens']) || !isset($dados['valor'])) {
    echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    exit;
}

$id = $dados['id'];
$valor = floatval($dados['valor']);
$itens = $dados['itens'];

$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão.']);
    exit;
}

// Atualiza valor total
$updatePedido = $conn->prepare("UPDATE pedidos SET valor = ? WHERE id = ?");
$updatePedido->bind_param("di", $valor, $id);
$ok1 = $updatePedido->execute();
$updatePedido->close();

// Remove itens antigos
$delItens = $conn->prepare("DELETE FROM itens_pedido WHERE pedido_id = ?");
$delItens->bind_param("i", $id);
$ok2 = $delItens->execute();
$delItens->close();

// Insere novos itens
$ok3 = true;
foreach ($itens as $item) {
    $nome = $item['nome'];
    $preco = floatval(str_replace(',', '.', str_replace('R$', '', $item['preco'])));
    $quantidade = intval($item['quantidade']);
    $imagem = $item['imagem'] ?? '';

    $stmt = $conn->prepare("INSERT INTO itens_pedido (pedido_id, nome, preco, quantidade, imagem) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("isdiss", $id, $nome, $preco, $quantidade, $imagem);
    if (!$stmt->execute()) {
        $ok3 = false;
        break;
    }
    $stmt->close();
}

if ($ok1 && $ok2 && $ok3) {
    echo json_encode(['success' => true, 'message' => 'Pedido atualizado com sucesso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o pedido.']);
}

$conn->close();
?>
