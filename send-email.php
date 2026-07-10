<?php
// ============================================
// CONFIGURAÇÃO — edite os valores abaixo
// ============================================

$destinatarios = [
    'contato@valeteghostwriting.com',
    // adicione mais e-mails aqui, um por linha
];

$smtp = [
    'host'       => 'smtp.hostinger.com',
    'port'       => 465,
    'encryption' => 'ssl', // 'ssl' (porta 465) ou 'tls' (porta 587)
    'username'   => 'contato@valeteghostwriting.com',
    'password'   => 'COLOQUE_A_SENHA_AQUI',
];

$remetente_nome = 'Site Valete';
$assunto        = 'Nova solicitação de orçamento';
$redirect_sucesso     = '/obrigado/';
$tempo_minimo_segundos = 3; // rejeita envios mais rápidos que isso (provável bot)

// ============================================
// LÓGICA — não precisa editar daqui pra baixo
// ============================================

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function redirecionar($url) {
    header("Location: $url");
    exit;
}

function adicionar_param($url, $chave, $valor) {
    $separador = strpos($url, '?') === false ? '?' : '&';
    return $url . $separador . $chave . '=' . urlencode($valor);
}

$pagina_referencia = $_SERVER['HTTP_REFERER'] ?? '/contato/';
$redirect_erro = adicionar_param($pagina_referencia, 'envio', 'erro');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirecionar('/');
}

// Honeypot — se preenchido, é bot; finge sucesso sem enviar nada
if (!empty($_POST['website'])) {
    redirecionar($redirect_sucesso);
}

// Time trap — envio rápido demais, provável bot
$carregado_em = isset($_POST['form_loaded_at']) ? (float) $_POST['form_loaded_at'] / 1000 : null;
if ($carregado_em && (time() - $carregado_em) < $tempo_minimo_segundos) {
    redirecionar($redirect_sucesso);
}

// Validação básica
$nome     = trim($_POST['nome'] ?? '');
$telefone = trim($_POST['telefone'] ?? '');
$email    = trim($_POST['email'] ?? '');
$origem   = trim($_POST['origem'] ?? 'Site');

if ($nome === '' || $telefone === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirecionar($redirect_erro);
}

// Evita injeção de cabeçalhos de e-mail
function sanitizar($valor) {
    return str_replace(["\r", "\n"], '', $valor);
}
$nome     = sanitizar($nome);
$telefone = sanitizar($telefone);
$email    = sanitizar($email);
$origem   = sanitizar($origem);

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $smtp['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp['username'];
    $mail->Password   = $smtp['password'];
    $mail->SMTPSecure = $smtp['encryption'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $smtp['port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($smtp['username'], $remetente_nome);
    $mail->addReplyTo($email, $nome);

    foreach ($destinatarios as $destinatario) {
        $mail->addAddress($destinatario);
    }

    $mail->Subject = "$assunto — $origem";
    $mail->Body    = "Nova solicitação pelo site\n\n"
                    . "Página de origem: $origem\n"
                    . "Nome: $nome\n"
                    . "Telefone: $telefone\n"
                    . "E-mail: $email\n";

    $mail->send();
    redirecionar($redirect_sucesso);

} catch (Exception $e) {
    redirecionar($redirect_erro);
}
