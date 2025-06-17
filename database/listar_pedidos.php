<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexão com o banco
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados.']);
    exit;
}

// Receber o filtro (via GET)
$filtro = isset($_GET['filtro']) ? $_GET['filtro'] : '';

// Montar a condição de filtro
$condicao = "";

if ($filtro === 'dia') {
    $condicao = "WHERE DATE(data_pedido) = CURDATE()";
} elseif ($filtro === 'semana') {
    $condicao = "WHERE YEARWEEK(data_pedido, 1) = YEARWEEK(CURDATE(), 1)";
} elseif ($filtro === 'mes') {
    $condicao = "WHERE MONTH(data_pedido) = MONTH(CURDATE()) AND YEAR(data_pedido) = YEAR(CURDATE())";
}

// Query SQL
$sql = "SELECT * FROM pedidos $condicao ORDER BY data_pedido DESC";

$result = $conn->query($sql);

$pedidos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $pedidos[] = [
            'id' => $row['id'],
            'nome' => $row['nome_cliente'],
            'email' => $row['email_cliente'],
            'telefone' => $row['telefone_cliente'],
            'data' => date('d/m/Y', strtotime($row['data_pedido'])),
            'hora' => date('H:i', strtotime($row['data_pedido'])),
            'valor' => $row['valor_total'],
            'tipo_pagamento' => $row['tipo_pagamento'],
            'status' => $row['status'], // 🔥 Status adicionado aqui
            'itens' => json_decode($row['itens'], true),
            'observacoes' => $row['observacoes'] ?? '',
        ];
    }
}

echo json_encode(['success' => true, 'pedidos' => $pedidos]);

$conn->close();
?>
