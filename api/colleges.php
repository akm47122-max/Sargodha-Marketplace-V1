<?php
/**
 * Sargodha Marketplace - Colleges, Admissions & Campus Ads API
 * Compatible with Hostinger PHP 8.x + MySQL
 */

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$db = getDB();

// 1. GET: Fetch approved college advertisements
if ($method === 'GET') {
    try {
        $stmt = $db->prepare("
            SELECT 
                id, user_id, institute_name, institute_type, tagline, location, city, area, address,
                phone, whatsapp, email, official_website, application_form_url, application_deadline,
                courses_offered, eligibility_criteria, description, poster_image, logo_image,
                package_price, duration_days, status, views, apply_clicks, call_clicks, whatsapp_clicks,
                submitted_at, approved_at, expires_at
            FROM college_ads
            WHERE status = 'APPROVED'
            ORDER BY id DESC
        ");
        $stmt->execute();
        $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse courses_offered if stored as comma-separated or json
        foreach ($ads as &$ad) {
            if (!empty($ad['courses_offered'])) {
                $decoded = json_decode($ad['courses_offered'], true);
                if (is_array($decoded)) {
                    $ad['courses_offered'] = $decoded;
                } else {
                    $ad['courses_offered'] = array_map('trim', explode(',', $ad['courses_offered']));
                }
            } else {
                $ad['courses_offered'] = [];
            }
        }

        echo json_encode([
            'success' => true,
            'count' => count($ads),
            'ads' => $ads
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database query failed: ' . $e->getMessage()
        ]);
        exit;
    }
}

// 2. POST: Submit a new College Admission Advertisement
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

    $instituteName = trim($input['institute_name'] ?? '');
    $instituteType = trim($input['institute_type'] ?? 'College');
    $tagline = trim($input['tagline'] ?? '');
    $location = trim($input['location'] ?? 'Sargodha');
    $city = trim($input['city'] ?? 'Sargodha');
    $area = trim($input['area'] ?? 'University Road');
    $address = trim($input['address'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $whatsapp = trim($input['whatsapp'] ?? '');
    $email = trim($input['email'] ?? '');
    $officialWebsite = trim($input['official_website'] ?? '');
    $applicationFormUrl = trim($input['application_form_url'] ?? '');
    $applicationDeadline = trim($input['application_deadline'] ?? '');
    $coursesOffered = $input['courses_offered'] ?? [];
    $eligibilityCriteria = trim($input['eligibility_criteria'] ?? '');
    $description = trim($input['description'] ?? '');
    $posterImage = trim($input['poster_image'] ?? '');
    $logoImage = trim($input['logo_image'] ?? '');
    $transactionReference = trim($input['transaction_reference'] ?? '');

    // Strict URL validation: allow only http:// and https://
    if (empty($instituteName) || empty($phone) || empty($whatsapp) || empty($applicationDeadline) || empty($applicationFormUrl) || empty($transactionReference)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Required fields missing: Institute name, phone, whatsapp, deadline, application link, and transaction reference.'
        ]);
        exit;
    }

    if (!filter_var($applicationFormUrl, FILTER_VALIDATE_URL) || (!str_starts_with($applicationFormUrl, 'http://') && !str_starts_with($applicationFormUrl, 'https://'))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid student application form URL. Only http:// and https:// links are allowed.'
        ]);
        exit;
    }

    $coursesJson = is_array($coursesOffered) ? json_encode($coursesOffered) : $coursesOffered;
    $userId = isLoggedIn() ? (int)currentUser()['id'] : 1;

    try {
        $stmt = $db->prepare("
            INSERT INTO college_ads (
                user_id, institute_name, institute_type, tagline, location, city, area, address,
                phone, whatsapp, email, official_website, application_form_url, application_deadline,
                courses_offered, eligibility_criteria, description, poster_image, logo_image,
                package_price, duration_days, transaction_reference, status
            ) VALUES (
                :uid, :name, :type, :tagline, :loc, :city, :area, :addr,
                :phone, :wa, :email, :web, :form_url, :deadline,
                :courses, :eligibility, :desc, :poster, :logo,
                3500, 30, :trx, 'PENDING'
            )
        ");

        $stmt->execute([
            ':uid' => $userId,
            ':name' => $instituteName,
            ':type' => $instituteType,
            ':tagline' => $tagline,
            ':loc' => $location,
            ':city' => $city,
            ':area' => $area,
            ':addr' => $address ?: $location,
            ':phone' => $phone,
            ':wa' => $whatsapp,
            ':email' => $email,
            ':web' => $officialWebsite,
            ':form_url' => $applicationFormUrl,
            ':deadline' => $applicationDeadline,
            ':courses' => $coursesJson,
            ':eligibility' => $eligibilityCriteria,
            ':desc' => $description,
            ':poster' => $posterImage,
            ':logo' => $logoImage,
            ':trx' => $transactionReference,
        ]);

        $newId = (int)$db->lastInsertId();

        echo json_encode([
            'success' => true,
            'message' => 'College advertisement submitted successfully. Awaiting payment verification.',
            'ad_id' => $newId
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save college ad: ' . $e->getMessage()
        ]);
        exit;
    }
}
