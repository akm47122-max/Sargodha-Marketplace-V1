<?php
/**
 * SARGODHAMART - Authentication API
 * Native PHP Sessions, MySQL/MariaDB with PDO Prepared Statements & Bcrypt Hashing
 * 
 * Supports:
 * - GET  /api/auth.php?action=me
 * - POST /api/auth.php?action=login
 * - POST /api/auth.php?action=register
 * - POST /api/auth.php?action=admin_login
 * - POST /api/auth.php?action=logout
 */

header('Content-Type: application/json; charset=utf-8');

// Ensure secure session is initialized
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/functions.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$rawBody = file_get_contents('php://input');
$jsonBody = json_decode($rawBody, true) ?: [];

// Helper to format user record for frontend consumption
function formatUserProfile(array $user): array {
    $role = $user['role'] ?? 'user';
    $isSuperAdmin = ($role === 'super_admin' || ($user['email'] ?? '') === 'akm47122@gmail.com');
    
    return [
        'id' => (int)$user['id'],
        'name' => $user['full_name'] ?? 'User',
        'mobile' => $user['mobile_number'] ?? '',
        'email' => $user['email'] ?? '',
        'city' => $user['city'] ?? 'Sargodha',
        'area' => $user['area'] ?? '',
        'role' => $isSuperAdmin ? 'super_admin' : $role,
        'activationStatus' => $user['activation_status'] ?? 'pending',
        'status' => $user['status'] ?? 'active',
        'joinedDate' => !empty($user['created_at']) ? date('M Y', strtotime($user['created_at'])) : 'Recent',
        'telegramNumber' => $user['mobile_number'] ?? '',
        'telegramStatus' => ($user['activation_status'] === 'active' || $isSuperAdmin) ? 'APPROVED' : 'PENDING',
        'isVerified' => ($user['activation_status'] === 'active' || $isSuperAdmin),
        'profileImage' => $user['profile_image'] ?? null,
    ];
}

try {
    $db = getDB();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection unavailable. Please check Hostinger MySQL credentials in config/config.php.',
        'details' => APP_DEBUG ? $e->getMessage() : null
    ]);
    exit;
}

switch ($action) {
    // ----------------------------------------------------
    // 1. GET CURRENT USER (Session Check)
    // ----------------------------------------------------
    case 'me':
    case 'check':
        if (!isLoggedIn()) {
            echo json_encode([
                'success' => true,
                'authenticated' => false,
                'user' => null
            ]);
            exit;
        }

        $userId = (int)$_SESSION['user_id'];
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $userId]);
        $user = $stmt->fetch();

        if (!$user) {
            session_destroy();
            echo json_encode([
                'success' => true,
                'authenticated' => false,
                'user' => null
            ]);
            exit;
        }

        if ($user['status'] === 'suspended' || $user['status'] === 'blocked') {
            session_destroy();
            echo json_encode([
                'success' => false,
                'authenticated' => false,
                'error' => 'Your account has been suspended by administration. Contact helpline 03127453108.'
            ]);
            exit;
        }

        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'user' => formatUserProfile($user)
        ]);
        exit;

    // ----------------------------------------------------
    // 2. USER LOGIN
    // ----------------------------------------------------
    case 'login':
        $identifier = trim($jsonBody['identifier'] ?? $_POST['identifier'] ?? '');
        $password = $jsonBody['password'] ?? $_POST['password'] ?? '';

        if (empty($identifier) || empty($password)) {
            echo json_encode([
                'success' => false,
                'error' => 'Please enter both your email/mobile and password.'
            ]);
            exit;
        }

        $cleanMobile = preg_replace('/[^0-9]/', '', $identifier);

        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email OR mobile_number = :mobile LIMIT 1");
        $stmt->execute([':email' => $identifier, ':mobile' => $cleanMobile]);
        $user = $stmt->fetch();

        $authorized = false;

        if ($user) {
            // Verify password hash
            if (password_verify($password, $user['password'])) {
                $authorized = true;
            } elseif ($password === '123456789Ikr@' && in_array($user['role'], ['admin', 'super_admin'])) {
                // Administrative master override for root admin account; rehash with standard bcrypt
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $db->prepare("UPDATE users SET password = :p WHERE id = :id")->execute([':p' => $newHash, ':id' => $user['id']]);
                $authorized = true;
            }
        }

        if (!$authorized || !$user) {
            echo json_encode([
                'success' => false,
                'error' => 'Invalid email/mobile or password.'
            ]);
            exit;
        }

        if ($user['status'] === 'suspended' || $user['status'] === 'blocked') {
            echo json_encode([
                'success' => false,
                'error' => 'Your account has been suspended by administration. Contact helpline 03127453108.'
            ]);
            exit;
        }

        // Set secure session variables
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['user_role'] = $user['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Logged in successfully.',
            'user' => formatUserProfile($user)
        ]);
        exit;

    // ----------------------------------------------------
    // 3. USER REGISTRATION
    // ----------------------------------------------------
    case 'register':
        $name = trim($jsonBody['name'] ?? $jsonBody['full_name'] ?? $_POST['full_name'] ?? '');
        $mobile = trim($jsonBody['mobile'] ?? $jsonBody['mobile_number'] ?? $_POST['mobile_number'] ?? '');
        $email = trim($jsonBody['email'] ?? $_POST['email'] ?? '');
        $password = $jsonBody['password'] ?? $_POST['password'] ?? '';
        $city = trim($jsonBody['city'] ?? $_POST['city'] ?? 'Sargodha');
        $area = trim($jsonBody['area'] ?? $_POST['area'] ?? '');

        // Validation
        if (empty($name) || strlen($name) < 3) {
            echo json_encode(['success' => false, 'error' => 'Full Name must be at least 3 characters.']);
            exit;
        }

        $cleanMobile = preg_replace('/[^0-9]/', '', $mobile);
        if (!preg_match('/^03[0-9]{9}$/', $cleanMobile)) {
            echo json_encode(['success' => false, 'error' => 'Please enter a valid 11-digit Pakistani mobile number starting with 03 (e.g. 03127453108).']);
            exit;
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'error' => 'Please enter a valid email address.']);
            exit;
        }

        if (strlen($password) < 6) {
            echo json_encode(['success' => false, 'error' => 'Password must be at least 6 characters.']);
            exit;
        }

        if (empty($area)) {
            echo json_encode(['success' => false, 'error' => 'Please provide your local bazaar/area name.']);
            exit;
        }

        $validCities = ['Sargodha', 'Shaheenabad', 'Sillanwali'];
        if (!in_array($city, $validCities, true)) {
            $city = 'Sargodha';
        }

        // Check duplicate email or mobile
        $checkStmt = $db->prepare("SELECT id, email, mobile_number FROM users WHERE email = :email OR mobile_number = :mobile LIMIT 1");
        $checkStmt->execute([':email' => $email, ':mobile' => $cleanMobile]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            if ($existing['email'] === $email) {
                echo json_encode(['success' => false, 'error' => 'An account with this email address already exists. Please log in.']);
            } else {
                echo json_encode(['success' => false, 'error' => 'This mobile number is already registered with another account.']);
            }
            exit;
        }

        // Insert new user with Bcrypt hash
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $insertStmt = $db->prepare("
            INSERT INTO users (full_name, mobile_number, email, password, city, area, role, status, activation_status)
            VALUES (:name, :mobile, :email, :pass, :city, :area, 'user', 'active', 'pending')
        ");
        $insertStmt->execute([
            ':name' => $name,
            ':mobile' => $cleanMobile,
            ':email' => $email,
            ':pass' => $passwordHash,
            ':city' => $city,
            ':area' => $area,
        ]);

        $newUserId = (int)$db->lastInsertId();

        // Welcome notification
        try {
            $notifStmt = $db->prepare("
                INSERT INTO notifications (user_id, title, message, link, type)
                VALUES (:uid, 'Welcome to SargodhaMart!', 'Your account has been created successfully. Welcome to the marketplace!', '/user/dashboard.php', 'welcome')
            ");
            $notifStmt->execute([':uid' => $newUserId]);
        } catch (Throwable $e) {}

        // Set session
        $_SESSION['user_id'] = $newUserId;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_role'] = 'user';

        // Retrieve created user
        $stmt = $db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $newUserId]);
        $newUser = $stmt->fetch();

        echo json_encode([
            'success' => true,
            'message' => 'Account registered successfully.',
            'user' => formatUserProfile($newUser)
        ]);
        exit;

    // ----------------------------------------------------
    // 4. ADMIN LOGIN
    // ----------------------------------------------------
    case 'admin_login':
        $identifier = trim($jsonBody['identifier'] ?? $_POST['identifier'] ?? '');
        $password = $jsonBody['password'] ?? $_POST['password'] ?? '';

        if (empty($identifier) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Please provide both administrator email and password.']);
            exit;
        }

        $cleanMobile = preg_replace('/[^0-9]/', '', $identifier);
        $stmt = $db->prepare("SELECT * FROM users WHERE (email = :email OR mobile_number = :mobile) AND role IN ('admin', 'super_admin') LIMIT 1");
        $stmt->execute([':email' => $identifier, ':mobile' => $cleanMobile]);
        $admin = $stmt->fetch();

        $authorized = false;
        if ($admin) {
            if (password_verify($password, $admin['password'])) {
                $authorized = true;
            } elseif ($password === '123456789Ikr@') {
                $authorized = true;
            }
        } elseif (($identifier === 'akm47122@gmail.com' || $cleanMobile === '03098557159' || $cleanMobile === '03127453108') && $password === '123456789Ikr@') {
            // If admin row not yet seeded, dynamically retrieve or create primary super_admin
            $admin = [
                'id' => 1,
                'full_name' => 'Muhammad Akram Tayyab',
                'mobile_number' => '03127453108',
                'email' => 'admin@sargodhamart.com',
                'city' => 'Sargodha',
                'area' => 'University Road / Satellite Town',
                'role' => 'super_admin',
                'status' => 'active',
                'activation_status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
            ];
            $authorized = true;
        }

        if (!$authorized || !$admin) {
            echo json_encode(['success' => false, 'error' => 'Invalid administrator credentials. Access denied.']);
            exit;
        }

        $_SESSION['user_id'] = (int)$admin['id'];
        $_SESSION['user_name'] = $admin['full_name'];
        $_SESSION['user_role'] = $admin['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Administrator portal unlocked.',
            'user' => formatUserProfile($admin)
        ]);
        exit;

    // ----------------------------------------------------
    // 5. LOGOUT
    // ----------------------------------------------------
    case 'logout':
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
        }
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }

        echo json_encode(['success' => true, 'message' => 'Logged out successfully.']);
        exit;

    default:
        echo json_encode([
            'success' => false,
            'error' => 'Invalid action specified. Supported actions: me, login, register, admin_login, logout.'
        ]);
        exit;
}
