<?php
/**
 * SARGODHAMART - Seller Activation & Payment Verification API
 * Manages Rs. 1,000 One-time Lifetime Seller Activation & Proof Submission
 * Compatible with Hostinger PHP 8.x + MySQL/MariaDB
 */

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$rawBody = file_get_contents('php://input');
$jsonBody = json_decode($rawBody, true) ?: [];

try {
    $db = getDB();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
    exit;
}

// ----------------------------------------------------
// 1. GET: Check activation status
// ----------------------------------------------------
if ($method === 'GET') {
    $userId = $_SESSION['user_id'] ?? (int)($_GET['user_id'] ?? 0);

    if (!$userId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Unauthenticated']);
        exit;
    }

    try {
        $stmt = $db->prepare("SELECT * FROM activation_payments WHERE user_id = :uid ORDER BY id DESC LIMIT 1");
        $stmt->execute([':uid' => $userId]);
        $payment = $stmt->fetch(PDO::FETCH_ASSOC);

        $userStmt = $db->prepare("SELECT activation_status, role FROM users WHERE id = :uid LIMIT 1");
        $userStmt->execute([':uid' => $userId]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'activation_status' => $user['activation_status'] ?? 'pending',
            'role' => $user['role'] ?? 'user',
            'latest_payment' => $payment ?: null
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

// ----------------------------------------------------
// 2. POST: Submit Activation Payment Proof
// ----------------------------------------------------
if ($method === 'POST') {
    $userId = $_SESSION['user_id'] ?? (int)($jsonBody['user_id'] ?? $_POST['user_id'] ?? 0);

    if (!$userId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'You must be logged in to submit activation payment.']);
        exit;
    }

    $paymentMethod = trim($jsonBody['payment_method'] ?? $_POST['payment_method'] ?? 'EasyPaisa');
    $senderNumber = trim($jsonBody['sender_number'] ?? $_POST['sender_number'] ?? '');
    $trxId = trim($jsonBody['transaction_id'] ?? $_POST['transaction_id'] ?? '');
    $paymentScreenshot = trim($jsonBody['payment_screenshot'] ?? $_POST['payment_screenshot'] ?? '');
    $whatsappScreenshot = trim($jsonBody['whatsapp_screenshot'] ?? $_POST['whatsapp_screenshot'] ?? '');

    if (empty($senderNumber) || empty($trxId)) {
        echo json_encode(['success' => false, 'error' => 'Please provide sender mobile number and Transaction ID.']);
        exit;
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO activation_payments (
                user_id, amount, payment_method, payment_number, account_name,
                sender_number, transaction_id, payment_screenshot, whatsapp_screenshot, status
            ) VALUES (
                :uid, :amt, :pm, :pnum, :aname,
                :snum, :trx, :pshot, :wshot, 'pending'
            )
        ");

        $stmt->execute([
            ':uid' => $userId,
            ':amt' => ONE_TIME_ACTIVATION_FEE,
            ':pm' => $paymentMethod,
            ':pnum' => OFFICIAL_PAYMENT_NUMBER,
            ':aname' => OFFICIAL_ACCOUNT_NAME,
            ':snum' => $senderNumber,
            ':trx' => $trxId,
            ':pshot' => $paymentScreenshot,
            ':wshot' => $whatsappScreenshot,
        ]);

        // Keep user activation status as pending
        $db->prepare("UPDATE users SET activation_status = 'pending' WHERE id = :uid")->execute([':uid' => $userId]);

        echo json_encode([
            'success' => true,
            'message' => 'Payment receipt submitted successfully! Verification takes 15-30 minutes.'
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save payment proof: ' . $e->getMessage()]);
        exit;
    }
}
