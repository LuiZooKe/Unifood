<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔗 Conexão
$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados.']);
    exit;
}

// 🔍 Filtros
$email = $_GET['email'] ?? null;
$filtro = $_GET['filtro'] ?? null;

$condicoes = [];
$params = [];
$tipos = "";

// 🔥 Filtro por email (se houver)
if ($email) {
    $condicoes[] = "email_cliente = ?";
    $params[] = $email;
    $tipos .= "s";
}

// 🔥 Filtro por data
if ($filtro === 'dia') {
    $condicoes[] = "DATE(data_pedido) = CURDATE()";
}
if ($filtro === 'semana') {
    $condicoes[] = "YEARWEEK(data_pedido, 1) = YEARWEEK(CURDATE(), 1)";
}
if ($filtro === 'mes') {
    $condicoes[] = "MONTH(data_pedido) = MONTH(CURDATE()) AND YEAR(data_pedido) = YEAR(CURDATE())";
}

// 🔥 Monta a query
$sql = "SELECT * FROM pedidos";
if (count($condicoes) > 0) {
    $sql .= " WHERE " . implode(" AND ", $condicoes);
}
$sql .= " ORDER BY data_pedido DESC";

$stmt = $conn->prepare($sql);
if ($tipos !== "") {
    $stmt->bind_param($tipos, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$pedidos = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $pedidos[] = [
            'id' => intval($row['id']),
            'nome' => $row['nome_cliente'],
            'email' => $row['email_cliente'],
            'telefone' => $row['telefone_cliente'] ?? 'Não informado',
            'data' => date('d/m/Y', strtotime($row['data_pedido'])),
            'hora' => date('H:i', strtotime($row['data_pedido'])),
            'valor' => floatval($row['valor_total']),
            'tipo_pagamento' => $row['tipo_pagamento'],
            'status' => $row['status'],
            'itens' => json_decode($row['itens'], true),
            'observacoes' => $row['observacoes'] ?? '',
        ];
    }
}

echo json_encode(['success' => true, 'pedidos' => $pedidos]);

$conn->close();
?>
