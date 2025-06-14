<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "unifood");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Erro na conexão."]);
    exit;
}

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email não informado."]);
    exit;
}

$sql = "SELECT nome, email, logradouro, numero, bairro, cidade, telefone FROM clientes WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $dados = $result->fetch_assoc();
    echo json_encode(["success" => true, "dados" => $dados]);
} else {
    echo json_encode(["success" => false, "message" => "Usuário não encontrado."]);
}

$conn->close();
?>
