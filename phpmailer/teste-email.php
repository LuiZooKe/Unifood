<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'unifoodunifucamp@gmail.com';  // seu email
    $mail->Password = 'rvjxmpovcjhdcdaz';            // senha do app
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('unifoodunifucamp@gmail.com', 'UNIFOOD TESTE');
    $mail->addAddress('seu-email@exemplo.com'); // seu email para receber o teste

    $mail->isHTML(true);
    $mail->Subject = 'Teste PHPMailer';
    $mail->Body = '<p>Se você recebeu este email, o envio está funcionando!</p>';

    $mail->send();
    echo 'Email enviado com sucesso!';
} catch (Exception $e) {
    echo "Erro ao enviar email: {$mail->ErrorInfo}";
}
