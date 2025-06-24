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
    echo json_encode(['success' => false, 'message' => 'Erro na conexão com o banco.']);
    exit;
}

date_default_timezone_set('America/Sao_Paulo');

// 🔧 Função para processar itens
function processarItens($pedido) {
    $itens = json_decode($pedido['itens'], true);
    $pedido['itens'] = $itens ?? [];

    $total = 0;

    foreach ($pedido['itens'] as &$item) {
        if (isset($item['preco'])) {
            $precoLimpo = str_replace(['R$', ' ', ','], ['', '', '.'], $item['preco']);
            $item['preco'] = floatval($precoLimpo);
        } else {
            $item['preco'] = 0;
        }

        if (!isset($item['quantidade'])) {
            $item['quantidade'] = 1;
        }

        $total += $item['preco'] * $item['quantidade'];
    }

    $pedido['valor_total'] = number_format($total, 2, '.', '');

    return $pedido;
}

// 🔍 Se houver ID → Busca individual (QR Code)
if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    $sql = "
        SELECT 
            p.*, 
            COALESCE(NULLIF(p.nome_cliente, ''), u.nome, 'Sem nome') AS nome_cliente, 
            COALESCE(u.email, p.email_cliente) AS email_cliente, 
            COALESCE(c.telefone, 'Não informado') AS telefone_cliente
        FROM pedidos p
        LEFT JOIN users u ON u.email = p.email_cliente
        LEFT JOIN clientes c ON c.email = p.email_cliente
        WHERE p.id = $id
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $pedido = $result->fetch_assoc();
        $pedido = processarItens($pedido);

        $pedido['data'] = date('d/m/Y', strtotime($pedido['data_pedido']));
        $pedido['hora'] = $pedido['hora_pedido'];

        echo json_encode(['success' => true, 'pedido' => $pedido]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Pedido não encontrado']);
    }

    $conn->close();
    exit();
}

// 🔍 Se não houver ID → Listagem geral ou por filtros
$filtro = $_GET['filtro'] ?? 'dia';
$email = $_GET['email'] ?? null;

$data_inicio = '';
$data_fim = date('Y-m-d');

if ($filtro === 'dia') {
    $data_inicio = date('Y-m-d');
} elseif ($filtro === 'semana') {
    $data_inicio = date('Y-m-d', strtotime('-6 days'));
} elseif ($filtro === 'mes') {
    $data_inicio = date('Y-m-01');
} else {
    $data_inicio = date('Y-m-d');
}

// 🔗 Montar SQL com ou sem filtro por email
$sql = "
    SELECT 
        p.*, 
        COALESCE(NULLIF(p.nome_cliente, ''), u.nome, 'Sem nome') AS nome_cliente, 
        COALESCE(u.email, p.email_cliente) AS email_cliente, 
        COALESCE(c.telefone, 'Não informado') AS telefone_cliente
    FROM pedidos p
    LEFT JOIN users u ON u.email = p.email_cliente
    LEFT JOIN clientes c ON c.email = p.email_cliente
    WHERE DATE(p.data_pedido) BETWEEN '$data_inicio' AND '$data_fim'
";

if ($email) {
    $sql .= " AND p.email_cliente = '$email'";
}

$sql .= " ORDER BY p.data_pedido DESC, p.hora_pedido DESC";

$result = $conn->query($sql);

$pedidos = [];

if ($result && $result->num_rows > 0) {
    while ($pedido = $result->fetch_assoc()) {
        $pedido = processarItens($pedido);

        $pedido['data'] = date('d/m/Y', strtotime($pedido['data_pedido']));
        $pedido['hora'] = $pedido['hora_pedido'];

        $pedidos[] = [
            'id' => intval($pedido['id']),
            'nome' => $pedido['nome_cliente'],
            'email' => $pedido['email_cliente'],
            'telefone' => $pedido['telefone_cliente'] ?? 'Não informado',
            'data' => $pedido['data'],
            'hora' => $pedido['hora'],
            'valor' => floatval($pedido['valor_total']),
            'tipo_pagamento' => $pedido['tipo_pagamento'],
            'tipo_venda' => $pedido['tipo_venda'],
            'status' => $pedido['status'],
            'itens' => $pedido['itens'],
            'observacoes' => $pedido['observacoes'] ?? '',
        ];
    }
}

echo json_encode(['success' => true, 'pedidos' => $pedidos]);

$conn->close();
?>
