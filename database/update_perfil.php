<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "unifood_db");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Erro na conexão com o banco de dados."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['email'])
) {
    echo json_encode(["success" => false, "message" => "Email obrigatório."]);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$logradouro = isset($data['logradouro']) ? $conn->real_escape_string($data['logradouro']) : '';
$numero = isset($data['numero']) ? $conn->real_escape_string($data['numero']) : '';
$bairro = isset($data['bairro']) ? $conn->real_escape_string($data['bairro']) : '';
$cidade = isset($data['cidade']) ? $conn->real_escape_string($data['cidade']) : '';
$telefone = isset($data['telefone']) ? $conn->real_escape_string($data['telefone']) : '';

$sql = "UPDATE clientes SET 
    logradouro = '$logradouro', 
    numero = '$numero', 
    bairro = '$bairro', 
    cidade = '$cidade', 
    telefone = '$telefone' 
    WHERE email = '$email'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Dados atualizados com sucesso."]);
} else {
    echo json_encode(["success" => false, "message" => "Erro ao atualizar: " . $conn->error]);
}

$conn->close();
?>
