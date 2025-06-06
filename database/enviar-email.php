<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/PHPMailer.php';
require '../phpmailer/SMTP.php';
require '../phpmailer/Exception.php';

function enviarEmailRedefinicao($destinatario, $link) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'unifoodunifucamp@gmail.com';    // Seu email
        $mail->Password = 'rvjxmpovcjhdcdaz';              // Senha do app
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        $mail->setFrom('unifoodunifucamp@gmail.com', 'UNIFOOD');
        $mail->addAddress($destinatario);

        $mail->isHTML(true);
        $mail->Subject = 'Redefinição de senha - UNIFOOD';
        $mail->Body = "
            <p>Olá,</p>
            <p>Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
            <p><a href='$link'>$link</a></p>
            <p>Este link é válido por 1 hora.</p>
            <p>Se você não solicitou, ignore este email.</p>
        ";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Erro ao enviar email: " . $mail->ErrorInfo);
        return false;
    }
}
?>
