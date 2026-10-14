<?php
/**
 * SARGODHAMART - Notifications API
 * Fetch and manage user notifications
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

$userId = $_SESSION['user_id'] ?? (int)($_GET['user_id'] ?? $jsonBody['user_id'] ?? 0);

if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthenticated']);
    exit;
}

if ($method === 'GET') {
    try {
        $stmt = $db->prepare("SELECT * FROM notifications WHERE user_id = :uid ORDER BY id DESC LIMIT 30");
        $stmt->execute([':uid' => $userId]);
        $notifs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $unreadCountStmt = $db->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = :uid AND is_read = 0");
        $unreadCountStmt->execute([':uid' => $userId]);
        $unreadCount = (int)$unreadCountStmt->fetchColumn();

        echo json_encode([
            'success' => true,
            'unread_count' => $unreadCount,
            'notifications' => $notifs
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        exit;
    }
}

if ($method === 'POST') {
    $action = $_GET['action'] ?? $jsonBody['action'] ?? 'mark_read';

    if ($action === 'mark_read') {
        $notifId = (int)($jsonBody['id'] ?? 0);
        try {
            if ($notifId > 0) {
                $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE id = :id AND user_id = :uid");
                $stmt->execute([':id' => $notifId, ':uid' => $userId]);
            } else {
                $stmt = $db->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = :uid");
                $stmt->execute([':uid' => $userId]);
            }
            echo json_encode(['success' => true, 'message' => 'Notifications updated']);
            exit;
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }
    }
}
