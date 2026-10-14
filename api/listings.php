<?php
/**
 * SARGODHAMART - Listings API
 * Complete CRUD for product and item listings with PDO Prepared Statements
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
// 1. GET: Fetch Listings with Filters & Pagination
// ----------------------------------------------------
if ($method === 'GET') {
    $city = trim($_GET['city'] ?? '');
    $category = trim($_GET['category'] ?? '');
    $q = trim($_GET['q'] ?? '');
    $featuredOnly = !empty($_GET['featured']);
    $userId = (int)($_GET['user_id'] ?? 0);
    $limit = min(50, max(1, (int)($_GET['limit'] ?? 24)));
    $page = max(1, (int)($_GET['page'] ?? 1));
    $offset = ($page - 1) * $limit;

    $conditions = ["LOWER(l.status) = 'published'"];
    $params = [];

    if (!empty($city) && $city !== 'All' && $city !== 'All Hubs') {
        $conditions[] = "l.city = :city";
        $params[':city'] = $city;
    }

    if (!empty($category) && $category !== 'all') {
        $conditions[] = "(c.slug = :category OR c.name = :category)";
        $params[':category'] = $category;
    }

    if (!empty($q)) {
        $conditions[] = "(l.title LIKE :query OR l.description LIKE :query OR l.area LIKE :query)";
        $params[':query'] = '%' . $q . '%';
    }

    if ($featuredOnly) {
        $conditions[] = "l.is_featured = 1";
    }

    if ($userId > 0) {
        $conditions[] = "l.user_id = :user_id";
        $params[':user_id'] = $userId;
    }

    $whereClause = implode(' AND ', $conditions);

    try {
        // Count query
        $countStmt = $db->prepare("SELECT COUNT(*) FROM listings l JOIN categories c ON l.category_id = c.id WHERE {$whereClause}");
        $countStmt->execute($params);
        $totalCount = (int)$countStmt->fetchColumn();

        // Main data query
        $dataQuery = "
            SELECT 
                l.id, l.title, l.slug, l.price, l.description, l.item_condition,
                l.city, l.area, l.exact_location, l.phone_number, l.whatsapp_number,
                l.contact_preference, l.is_featured, l.views_count, l.created_at,
                c.id as category_id, c.name as category_name, c.slug as category_slug,
                u.id as user_id, u.full_name as seller_name, u.mobile_number as seller_mobile,
                u.activation_status as seller_activation, u.role as seller_role,
                (SELECT image_path FROM listing_images WHERE listing_id = l.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
            FROM listings l
            JOIN categories c ON l.category_id = c.id
            JOIN users u ON l.user_id = u.id
            WHERE {$whereClause}
            ORDER BY l.is_featured DESC, l.id DESC
            LIMIT {$limit} OFFSET {$offset}
        ";

        $stmt = $db->prepare($dataQuery);
        $stmt->execute($params);
        $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all images for each listing if needed
        foreach ($listings as &$item) {
            $imgStmt = $db->prepare("SELECT image_path FROM listing_images WHERE listing_id = :lid ORDER BY is_primary DESC, id ASC");
            $imgStmt->execute([':lid' => $item['id']]);
            $images = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
            $item['images'] = !empty($images) ? $images : ($item['primary_image'] ? [$item['primary_image']] : []);
            $item['is_featured'] = (bool)$item['is_featured'];
            $item['views_count'] = (int)$item['views_count'];
            $item['price'] = (float)$item['price'];
        }

        echo json_encode([
            'success' => true,
            'total' => $totalCount,
            'page' => $page,
            'limit' => $limit,
            'listings' => $listings
        ]);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to fetch listings: ' . $e->getMessage()
        ]);
        exit;
    }
}

// ----------------------------------------------------
// 2. POST: Create New Listing
// ----------------------------------------------------
if ($method === 'POST') {
    // Determine active user (session or body)
    $userId = $_SESSION['user_id'] ?? (int)($jsonBody['user_id'] ?? $_POST['user_id'] ?? 0);
    
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'You must be logged in to post an ad.']);
        exit;
    }

    $title = trim($jsonBody['title'] ?? $_POST['title'] ?? '');
    $price = (float)($jsonBody['price'] ?? $_POST['price'] ?? 0);
    $categoryId = (int)($jsonBody['category_id'] ?? $_POST['category_id'] ?? 1);
    $description = trim($jsonBody['description'] ?? $_POST['description'] ?? '');
    $city = trim($jsonBody['city'] ?? $_POST['city'] ?? 'Sargodha');
    $area = trim($jsonBody['area'] ?? $_POST['area'] ?? '');
    $phone = trim($jsonBody['phone_number'] ?? $_POST['phone_number'] ?? '');
    $whatsapp = trim($jsonBody['whatsapp_number'] ?? $_POST['whatsapp_number'] ?? $phone);
    $condition = trim($jsonBody['item_condition'] ?? $_POST['item_condition'] ?? 'Used');
    $images = $jsonBody['images'] ?? [];

    if (empty($title) || empty($description) || empty($phone) || empty($area)) {
        echo json_encode(['success' => false, 'error' => 'Please fill in all required fields (title, description, phone, area).']);
        exit;
    }

    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-')) . '-' . time();

    try {
        $db->beginTransaction();

        $stmt = $db->prepare("
            INSERT INTO listings (
                user_id, category_id, title, slug, price, description, item_condition,
                city, area, phone_number, whatsapp_number, status, is_featured
            ) VALUES (
                :uid, :cid, :title, :slug, :price, :desc, :cond,
                :city, :area, :phone, :wa, 'published', 0
            )
        ");

        $stmt->execute([
            ':uid' => $userId,
            ':cid' => $categoryId,
            ':title' => $title,
            ':slug' => $slug,
            ':price' => $price,
            ':desc' => $description,
            ':cond' => $condition,
            ':city' => $city,
            ':area' => $area,
            ':phone' => $phone,
            ':wa' => $whatsapp,
        ]);

        $listingId = (int)$db->lastInsertId();

        // Save images
        if (is_array($images) && count($images) > 0) {
            $isPrimary = 1;
            $imgStmt = $db->prepare("INSERT INTO listing_images (listing_id, image_path, is_primary) VALUES (:lid, :path, :primary)");
            foreach ($images as $imgPath) {
                if (!empty($imgPath)) {
                    $imgStmt->execute([
                        ':lid' => $listingId,
                        ':path' => $imgPath,
                        ':primary' => $isPrimary
                    ]);
                    $isPrimary = 0;
                }
            }
        }

        $db->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Listing published successfully!',
            'listing_id' => $listingId
        ]);
        exit;
    } catch (PDOException $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create listing: ' . $e->getMessage()]);
        exit;
    }
}

// ----------------------------------------------------
// 3. DELETE: Remove Listing
// ----------------------------------------------------
if ($method === 'DELETE') {
    $userId = $_SESSION['user_id'] ?? (int)($jsonBody['user_id'] ?? 0);
    $userRole = $_SESSION['user_role'] ?? '';
    $listingId = (int)($_GET['id'] ?? $jsonBody['id'] ?? 0);

    if (!$userId || !$listingId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing listing ID or unauthenticated.']);
        exit;
    }

    try {
        if (in_array($userRole, ['admin', 'super_admin'])) {
            $stmt = $db->prepare("DELETE FROM listings WHERE id = :id");
            $stmt->execute([':id' => $listingId]);
        } else {
            $stmt = $db->prepare("DELETE FROM listings WHERE id = :id AND user_id = :uid");
            $stmt->execute([':id' => $listingId, ':uid' => $userId]);
        }

        echo json_encode(['success' => true, 'message' => 'Listing removed.']);
        exit;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete listing.']);
        exit;
    }
}
