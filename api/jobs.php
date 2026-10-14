<?php
/**
 * SARGODHAMART - Jobs API
 * Employment and Labor Exchange Portal
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
// 1. GET: Fetch Jobs
// ----------------------------------------------------
if ($method === 'GET') {
    $city = trim($_GET['city'] ?? '');
    $type = trim($_GET['type'] ?? ''); // 'need_job' or 'need_worker'
    $q = trim($_GET['q'] ?? '');
    $category = trim($_GET['category'] ?? '');
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));

    $conditions = ["j.status = 'published'"];
    $params = [];

    if (!empty($city) && $city !== 'All' && $city !== 'All Hubs') {
        $conditions[] = "j.city = :city";
        $params[':city'] = $city;
    }

    if (!empty($type)) {
        $conditions[] = "j.post_type = :type";
        $params[':type'] = $type;
    }

    if (!empty($category) && $category !== 'all') {
        $conditions[] = "j.category = :category";
        $params[':category'] = $category;
    }

    if (!empty($q)) {
        $conditions[] = "(j.title LIKE :q OR j.description LIKE :q OR j.skills LIKE :q OR j.area LIKE :q)";
        $params[':q'] = '%' . $q . '%';
    }

    $whereClause = implode(' AND ', $conditions);

    try {
        $stmt = $db->prepare("
            SELECT 
                j.*,
                u.full_name as author_name,
                u.mobile_number as author_mobile,
                u.activation_status as author_activation
            FROM jobs j
            JOIN users u ON j.user_id = u.id
            WHERE {$whereClause}
            ORDER BY j.id DESC
            LIMIT {$limit}
        ");
        $stmt->execute($params);
        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'count' => count($jobs),
            'jobs' => $jobs
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to fetch jobs: ' . $e->getMessage()]);
        exit;
    }
}

// ----------------------------------------------------
// 2. POST: Create Job Post
// ----------------------------------------------------
if ($method === 'POST') {
    $userId = $_SESSION['user_id'] ?? (int)($jsonBody['user_id'] ?? $_POST['user_id'] ?? 0);

    if (!$userId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'You must be logged in to post a job advertisement.']);
        exit;
    }

    $title = trim($jsonBody['title'] ?? $_POST['title'] ?? '');
    $postType = trim($jsonBody['post_type'] ?? $_POST['post_type'] ?? 'need_worker');
    $category = trim($jsonBody['category'] ?? $_POST['category'] ?? 'General Labor');
    $skills = trim($jsonBody['skills'] ?? $_POST['skills'] ?? '');
    $salary = trim($jsonBody['salary_or_payment'] ?? $_POST['salary_or_payment'] ?? '');
    $city = trim($jsonBody['city'] ?? $_POST['city'] ?? 'Sargodha');
    $area = trim($jsonBody['area'] ?? $_POST['area'] ?? '');
    $description = trim($jsonBody['description'] ?? $_POST['description'] ?? '');
    $phone = trim($jsonBody['phone_number'] ?? $_POST['phone_number'] ?? '');
    $whatsapp = trim($jsonBody['whatsapp_number'] ?? $_POST['whatsapp_number'] ?? $phone);

    if (empty($title) || empty($description) || empty($phone) || empty($area)) {
        echo json_encode(['success' => false, 'error' => 'Please provide title, description, contact phone, and area.']);
        exit;
    }

    try {
        $stmt = $db->prepare("
            INSERT INTO jobs (
                user_id, post_type, title, category, skills, salary_or_payment,
                city, area, description, phone_number, whatsapp_number, status
            ) VALUES (
                :uid, :ptype, :title, :cat, :skills, :salary,
                :city, :area, :desc, :phone, :wa, 'published'
            )
        ");

        $stmt->execute([
            ':uid' => $userId,
            ':ptype' => $postType,
            ':title' => $title,
            ':cat' => $category,
            ':skills' => $skills,
            ':salary' => $salary,
            ':city' => $city,
            ':area' => $area,
            ':desc' => $description,
            ':phone' => $phone,
            ':wa' => $whatsapp,
        ]);

        $jobId = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'Job posting published successfully!',
            'job_id' => $jobId
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create job: ' . $e->getMessage()]);
        exit;
    }
}
