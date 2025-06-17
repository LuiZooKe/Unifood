<?php
// Configurações de cabeçalho para permitir acesso externo (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header('Content-Type: application/json');

// Tratamento para requisição OPTIONS (pré-flight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conectar ao banco de dados
$conn = new mysqli("localhost", "root", "", "unifood_db");

// Verificar conexão
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro na conexão com o banco de dados: ' . $conn->connect_error
    ]);
    exit;
}

// Ler os dados recebidos via JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar dados recebidos
if (
    !isset($data['nome']) ||
    !isset($data['email']) ||
    !isset($data['itens']) ||
    !isset($data['valor_total']) ||
    !isset($data['tipo_pagamento'])
) {
    echo json_encode([
        'success' => false,
        'message' => 'Dados incompletos. Verifique se nome, email, itens, valor_total e tipo_pagamento foram enviados corretamente.'
    ]);
    exit;
}

// Atribuir os dados recebidos às variáveis
$nome = $data['nome'];
$email = $data['email'];
$itens = json_encode($data['itens'], JSON_UNESCAPED_UNICODE); // Salvar itens como JSON
$valor_total = $data['valor_total'];
$tipo_pagamento = $data['tipo_pagamento'];

// Preparar a query SQL para inserir o pedido
$sql = "INSERT INTO pedidos (nome_cliente, email_cliente, itens, valor_total, tipo_pagamento) 
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

// Verificar se a preparação da query foi bem-sucedida
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'message' => 'Erro na preparação da query: ' . $conn->error
    ]);
    exit;
}

// Associar os parâmetros
$stmt->bind_param("sssds", $nome, $email, $itens, $valor_total, $tipo_pagamento);

// Executar a query
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Pedido finalizado e salvo com sucesso.',
        'id_pedido' => $stmt->insert_id // Retorna o ID do pedido criado
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao salvar o pedido: ' . $stmt->error
    ]);
}

// Fechar a conexão
$stmt->close();
$conn->close();
?>
