<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "unifood_db");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco de dados']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$filtro = $data['filtro'] ?? 'todos';

switch ($filtro) {
    case 'hoje':
        $condicaoData = "AND DATE(data_pedido) = CURDATE()";
        break;
    case 'semana':
        $condicaoData = "AND data_pedido >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;
    case 'mes':
        $condicaoData = "AND data_pedido >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
        break;
    default:
        $condicaoData = "";
}

$response = [
    'success' => true,
    'pagamentos' => [],
    'vendas' => [],
    'ticket' => [],
    'faturamento' => 0,
    'total_pedidos' => 0,
    'top_produtos' => [],
    'detalhes_produtos' => [],
];

// PAGAMENTOS
$sql1 = "
    SELECT tipo_pagamento, COUNT(*) as quantidade
    FROM pedidos
    WHERE status = 'FINALIZADO' $condicaoData
    GROUP BY tipo_pagamento
";
$res1 = $conn->query($sql1);
if ($res1) {
    while ($row = $res1->fetch_assoc()) {
        $response['pagamentos'][] = [
            'tipo_pagamento' => $row['tipo_pagamento'],
            'quantidade' => intval($row['quantidade'])
        ];
    }
}

// VENDAS
$sql2 = "
    SELECT tipo_venda, COUNT(*) as quantidade
    FROM pedidos
    WHERE status = 'FINALIZADO' $condicaoData
    GROUP BY tipo_venda
";
$res2 = $conn->query($sql2);
if ($res2) {
    while ($row = $res2->fetch_assoc()) {
        $response['vendas'][] = [
            'tipo_venda' => $row['tipo_venda'],
            'quantidade' => intval($row['quantidade'])
        ];
    }
}

// TICKET MÉDIO
$sql3 = "
    SELECT tipo_venda, SUM(valor_total) as soma_total, COUNT(*) as quantidade
    FROM pedidos
    WHERE status = 'FINALIZADO' $condicaoData
    GROUP BY tipo_venda
";
$res3 = $conn->query($sql3);
if ($res3) {
    while ($row = $res3->fetch_assoc()) {
        $quantidade = intval($row['quantidade']);
        $soma_total = floatval($row['soma_total']);
        $ticket_medio = $quantidade > 0 ? $soma_total / $quantidade : 0;
        $response['ticket'][] = [
            'tipo_venda' => $row['tipo_venda'],
            'ticket_medio' => round($ticket_medio, 2)
        ];
    }
}

// FATURAMENTO e total pedidos
$sql4 = "
    SELECT SUM(valor_total) as faturamento, COUNT(*) as total_pedidos
    FROM pedidos
    WHERE status = 'FINALIZADO' $condicaoData
";
$res4 = $conn->query($sql4);
if ($res4 && $row = $res4->fetch_assoc()) {
    $response['faturamento'] = floatval($row['faturamento'] ?? 0);
    $response['total_pedidos'] = intval($row['total_pedidos'] ?? 0);
}

// TOP 10 produtos
$sql5 = "
    SELECT p.nome, SUM(JSON_EXTRACT(itens, CONCAT('$[', numbers.n, '].quantidade'))) AS quantidade_total
    FROM pedidos
    JOIN (
        SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) numbers
    JOIN produtos p
      ON JSON_EXTRACT(pedidos.itens, CONCAT('$[', numbers.n, '].id')) = p.id
    WHERE pedidos.status = 'FINALIZADO' $condicaoData
    GROUP BY p.nome
    ORDER BY quantidade_total DESC
    LIMIT 10
";
$res5 = $conn->query($sql5);
if ($res5) {
    while ($row = $res5->fetch_assoc()) {
        $response['top_produtos'][] = [
            'nome' => $row['nome'],
            'quantidade_total' => intval($row['quantidade_total'])
        ];
    }
}

// DETALHES produtos
$sql6 = "
    SELECT p.nome, p.preco, p.custo, p.lucro as lucro_unitario,
           SUM(JSON_EXTRACT(itens, CONCAT('$[', numbers.n, '].quantidade'))) AS quantidade_total,
           SUM(JSON_EXTRACT(itens, CONCAT('$[', numbers.n, '].quantidade')) * p.lucro) AS lucro_total
    FROM pedidos
    JOIN (
        SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
    ) numbers
    JOIN produtos p
      ON JSON_EXTRACT(pedidos.itens, CONCAT('$[', numbers.n, '].id')) = p.id
    WHERE pedidos.status = 'FINALIZADO' $condicaoData
    GROUP BY p.nome, p.preco, p.custo, p.lucro
";
$res6 = $conn->query($sql6);
if ($res6) {
    while ($row = $res6->fetch_assoc()) {
        $response['detalhes_produtos'][] = [
            'nome' => $row['nome'],
            'preco' => floatval($row['preco']),
            'custo' => floatval($row['custo']),
            'lucro_unitario' => floatval($row['lucro_unitario']),
            'quantidade_total' => intval($row['quantidade_total']),
            'lucro_total' => floatval($row['lucro_total']),
        ];
    }
}

echo json_encode($response);
$conn->close();
?>
