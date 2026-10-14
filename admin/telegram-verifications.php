<?php
/**
 * SargodhaMart - Admin User Telegram Verification & Contact Moderation
 */

$adminTitle = 'User Telegram Verification - Admin Panel';
require_once __DIR__ . '/includes/admin_header.php';

// Handle Admin Actions: Approve / Reject / Revoke
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyCsrfOrDie();
    $action = $_POST['action'] ?? '';
    $userId = (int)($_POST['user_id'] ?? 0);
    $reason = trim($_POST['rejection_reason'] ?? '');

    if ($userId > 0) {
        $userStmt = $db->prepare("SELECT id, full_name, telegram_number FROM users WHERE id = :id");
        $userStmt->execute([':id' => $userId]);
        $targetUser = $userStmt->fetch();

        if ($targetUser) {
            $tgNum = $targetUser['telegram_number'] ?? '';
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

            if ($action === 'approve') {
                $db->prepare("
                    UPDATE users 
                    SET telegram_verification_status = 'APPROVED',
                        telegram_reviewed_by = :aid,
                        telegram_reviewed_at = NOW(),
                        telegram_rejection_reason = NULL,
                        updated_at = NOW()
                    WHERE id = :id
                ")->execute([':aid' => $admin['id'], ':id' => $userId]);

                // Create audit log
                try {
                    $db->prepare("
                        INSERT INTO user_telegram_verifications 
                        (user_id, telegram_number, status, action_type, reviewed_by, reviewed_at, ip_address, created_at)
                        VALUES (:uid, :tg, 'APPROVED', 'APPROVE', :aid, NOW(), :ip, NOW())
                    ")->execute([':uid' => $userId, ':tg' => $tgNum, ':aid' => $admin['id'], ':ip' => $ip]);
                } catch (Exception $e) {}

                logAdminAction($admin['id'], 'approve_telegram', 'users', $userId);
                redirect('/admin/telegram-verifications.php', "Telegram contact approved for {$targetUser['full_name']}.", 'success');

            } elseif ($action === 'reject') {
                $rejectionReason = !empty($reason) ? $reason : 'Telegram number failed verification check.';
                $db->prepare("
                    UPDATE users 
                    SET telegram_verification_status = 'REJECTED',
                        telegram_reviewed_by = :aid,
                        telegram_reviewed_at = NOW(),
                        telegram_rejection_reason = :reason,
                        updated_at = NOW()
                    WHERE id = :id
                ")->execute([':aid' => $admin['id'], ':reason' => $rejectionReason, ':id' => $userId]);

                // Create audit log
                try {
                    $db->prepare("
                        INSERT INTO user_telegram_verifications 
                        (user_id, telegram_number, status, action_type, reviewed_by, reviewed_at, rejection_reason, ip_address, created_at)
                        VALUES (:uid, :tg, 'REJECTED', 'REJECT', :aid, NOW(), :reason, :ip, NOW())
                    ")->execute([':uid' => $userId, ':tg' => $tgNum, ':aid' => $admin['id'], ':reason' => $rejectionReason, ':ip' => $ip]);
                } catch (Exception $e) {}

                logAdminAction($admin['id'], 'reject_telegram', 'users', $userId);
                redirect('/admin/telegram-verifications.php', "Telegram contact rejected for {$targetUser['full_name']}.", 'warning');

            } elseif ($action === 'revoke') {
                $db->prepare("
                    UPDATE users 
                    SET telegram_verification_status = 'PENDING',
                        telegram_reviewed_by = :aid,
                        telegram_reviewed_at = NOW(),
                        telegram_rejection_reason = 'Approval revoked by administrator.',
                        updated_at = NOW()
                    WHERE id = :id
                ")->execute([':aid' => $admin['id'], ':id' => $userId]);

                // Create audit log
                try {
                    $db->prepare("
                        INSERT INTO user_telegram_verifications 
                        (user_id, telegram_number, status, action_type, reviewed_by, reviewed_at, rejection_reason, ip_address, created_at)
                        VALUES (:uid, :tg, 'PENDING', 'REVOKE', :aid, NOW(), 'Approval revoked by administrator', :ip, NOW())
                    ")->execute([':uid' => $userId, ':tg' => $tgNum, ':aid' => $admin['id'], ':ip' => $ip]);
                } catch (Exception $e) {}

                logAdminAction($admin['id'], 'revoke_telegram', 'users', $userId);
                redirect('/admin/telegram-verifications.php', "Telegram approval revoked for {$targetUser['full_name']}.", 'warning');
            }
        }
    }
}

// Filter Options
$filter = trim($_GET['status'] ?? 'ALL');
$search = trim($_GET['search'] ?? '');

$where = ["u.telegram_number IS NOT NULL AND u.telegram_number != ''"];
$params = [];

if (in_array($filter, ['PENDING', 'APPROVED', 'REJECTED'])) {
    $where[] = "u.telegram_verification_status = :status";
    $params[':status'] = $filter;
}

if (!empty($search)) {
    $where[] = "(u.full_name LIKE :s OR u.email LIKE :s OR u.telegram_number LIKE :s OR u.mobile_number LIKE :s)";
    $params[':s'] = "%{$search}%";
}

$whereClause = implode(" AND ", $where);

// Fetch Verification Requests
$stmt = $db->prepare("
    SELECT u.*, 
           rev.full_name as reviewer_name
    FROM users u 
    LEFT JOIN users rev ON u.telegram_reviewed_by = rev.id
    WHERE {$whereClause}
    ORDER BY 
        CASE 
            WHEN u.telegram_verification_status = 'PENDING' THEN 1 
            WHEN u.telegram_verification_status = 'REJECTED' THEN 2 
            ELSE 3 
        END,
        u.telegram_submitted_at DESC
");
$stmt->execute($params);
$requests = $stmt->fetchAll();

// Counts for filter tabs
$countPending = (int)$db->query("SELECT COUNT(*) FROM users WHERE telegram_verification_status = 'PENDING' AND telegram_number IS NOT NULL AND telegram_number != ''")->fetchColumn();
$countApproved = (int)$db->query("SELECT COUNT(*) FROM users WHERE telegram_verification_status = 'APPROVED'")->fetchColumn();
$countRejected = (int)$db->query("SELECT COUNT(*) FROM users WHERE telegram_verification_status = 'REJECTED'")->fetchColumn();
$countAll = (int)$db->query("SELECT COUNT(*) FROM users WHERE telegram_number IS NOT NULL AND telegram_number != ''")->fetchColumn();

// Fetch Recent Audit Logs
$auditLogs = [];
try {
    $auditStmt = $db->query("
        SELECT utv.*, u.full_name as user_name, rev.full_name as admin_name
        FROM user_telegram_verifications utv
        LEFT JOIN users u ON utv.user_id = u.id
        LEFT JOIN users rev ON utv.reviewed_by = rev.id
        ORDER BY utv.id DESC
        LIMIT 25
    ");
    $auditLogs = $auditStmt->fetchAll();
} catch (Exception $e) {}
?>

<div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
    <div>
        <h3 class="fw-bold mb-1"><i class="bi bi-telegram text-info me-2"></i> Telegram Verification Queue</h3>
        <p class="text-muted small mb-0">Authorize and review seller Telegram contacts. Non-approved numbers remain private and hidden from public buyers.</p>
    </div>
</div>

<!-- Filter Tabs & Search -->
<div class="card border-0 shadow-sm p-3 bg-white mb-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <!-- Status Tabs -->
        <div class="btn-group btn-group-sm" role="group">
            <a href="/admin/telegram-verifications.php?status=ALL" class="btn <?= $filter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary' ?>">
                All (<?= $countAll ?>)
            </a>
            <a href="/admin/telegram-verifications.php?status=PENDING" class="btn <?= $filter === 'PENDING' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning text-dark' ?>">
                Pending (<?= $countPending ?>)
            </a>
            <a href="/admin/telegram-verifications.php?status=APPROVED" class="btn <?= $filter === 'APPROVED' ? 'btn-success' : 'btn-outline-success' ?>">
                Approved (<?= $countApproved ?>)
            </a>
            <a href="/admin/telegram-verifications.php?status=REJECTED" class="btn <?= $filter === 'REJECTED' ? 'btn-danger' : 'btn-outline-danger' ?>">
                Rejected (<?= $countRejected ?>)
            </a>
        </div>

        <!-- Search Form -->
        <form method="GET" action="/admin/telegram-verifications.php" class="d-flex gap-2">
            <input type="hidden" name="status" value="<?= e($filter) ?>">
            <input type="text" name="search" class="form-control form-control-sm" placeholder="Search user or telegram number..." value="<?= e($search) ?>" style="min-width: 240px;">
            <button type="submit" class="btn btn-dark btn-sm">Search</button>
            <?php if (!empty($search)): ?>
                <a href="/admin/telegram-verifications.php?status=<?= e($filter) ?>" class="btn btn-outline-secondary btn-sm">Reset</a>
            <?php endif; ?>
        </form>
    </div>
</div>

<!-- Verifications Table -->
<div class="card border-0 shadow-sm bg-white overflow-hidden mb-5">
    <div class="table-responsive">
        <table class="table table-hover align-middle small mb-0">
            <thead class="table-light">
                <tr>
                    <th>User</th>
                    <th>Telegram Number</th>
                    <th>Privacy & Visibility</th>
                    <th>Status</th>
                    <th>Submitted Date</th>
                    <th>Reviewed By</th>
                    <th>Reviewed Date</th>
                    <th>Rejection Reason</th>
                    <th class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($requests)): ?>
                    <tr>
                        <td colspan="9" class="text-center py-4 text-muted">
                            <i class="bi bi-inbox fs-3 d-block mb-1"></i>
                            No Telegram verification requests found for this filter.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($requests as $r): ?>
                        <tr>
                            <td>
                                <strong><?= e($r['full_name']) ?></strong><br>
                                <small class="text-muted"><?= e($r['email']) ?> • <?= e($r['city']) ?></small>
                            </td>
                            <td>
                                <code class="text-dark bg-light px-2 py-1 rounded fw-bold fs-6">
                                    <?= e($r['telegram_number']) ?>
                                </code>
                            </td>
                            <td>
                                <?php if (($r['telegram_visibility'] ?? 'HIDDEN') === 'VISIBLE'): ?>
                                    <span class="badge bg-info-subtle text-info border">Visible</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary-subtle text-secondary border">Hidden</span>
                                <?php endif; ?>
                                <br>
                                <small class="text-muted"><?= e($r['contact_privacy'] ?? 'SHOW_ALL') ?></small>
                            </td>
                            <td>
                                <?php if ($r['telegram_verification_status'] === 'APPROVED'): ?>
                                    <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                        <i class="bi bi-check-circle me-1"></i> APPROVED
                                    </span>
                                <?php elseif ($r['telegram_verification_status'] === 'PENDING'): ?>
                                    <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1">
                                        <i class="bi bi-clock-history me-1"></i> PENDING
                                    </span>
                                <?php elseif ($r['telegram_verification_status'] === 'REJECTED'): ?>
                                    <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                                        <i class="bi bi-x-circle me-1"></i> REJECTED
                                    </span>
                                <?php else: ?>
                                    <span class="badge bg-light text-muted border">NONE</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-muted text-nowrap">
                                <?= !empty($r['telegram_submitted_at']) ? date('d M Y, h:i A', strtotime($r['telegram_submitted_at'])) : '<span class="text-muted">-</span>' ?>
                            </td>
                            <td>
                                <?= !empty($r['reviewer_name']) ? '<strong>' . e($r['reviewer_name']) . '</strong>' : '<span class="text-muted">-</span>' ?>
                            </td>
                            <td class="text-muted text-nowrap">
                                <?= !empty($r['telegram_reviewed_at']) ? date('d M Y, h:i A', strtotime($r['telegram_reviewed_at'])) : '<span class="text-muted">-</span>' ?>
                            </td>
                            <td>
                                <?php if (!empty($r['telegram_rejection_reason'])): ?>
                                    <span class="text-danger small" title="<?= e($r['telegram_rejection_reason']) ?>">
                                        <?= e(mb_strimwidth($r['telegram_rejection_reason'], 0, 35, '...')) ?>
                                    </span>
                                <?php else: ?>
                                    <span class="text-muted">-</span>
                                <?php endif; ?>
                            </td>
                            <td class="text-end text-nowrap">
                                <a href="/seller.php?id=<?= $r['id'] ?>" target="_blank" class="btn btn-outline-secondary btn-sm py-1 px-2" title="View Seller Profile">
                                    <i class="bi bi-eye"></i>
                                </a>

                                <?php if ($r['telegram_verification_status'] !== 'APPROVED'): ?>
                                    <form method="POST" action="/admin/telegram-verifications.php" class="d-inline" onsubmit="return confirm('Approve Telegram contact for <?= e($r['full_name']) ?>?');">
                                        <?= getCsrfField() ?>
                                        <input type="hidden" name="action" value="approve">
                                        <input type="hidden" name="user_id" value="<?= $r['id'] ?>">
                                        <button type="submit" class="btn btn-success btn-sm py-1 px-2">
                                            <i class="bi bi-check2"></i> Approve
                                        </button>
                                    </form>
                                <?php endif; ?>

                                <?php if ($r['telegram_verification_status'] !== 'REJECTED'): ?>
                                    <button type="button" class="btn btn-outline-danger btn-sm py-1 px-2" data-bs-toggle="modal" data-bs-target="#rejectModal<?= $r['id'] ?>">
                                        <i class="bi bi-x"></i> Reject
                                    </button>

                                    <!-- Rejection Reason Modal -->
                                    <div class="modal fade" id="rejectModal<?= $r['id'] ?>" tabindex="-1" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered text-start">
                                            <div class="modal-content">
                                                <form method="POST" action="/admin/telegram-verifications.php">
                                                    <?= getCsrfField() ?>
                                                    <input type="hidden" name="action" value="reject">
                                                    <input type="hidden" name="user_id" value="<?= $r['id'] ?>">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title fw-bold text-danger"><i class="bi bi-shield-x me-1"></i> Reject Telegram Number</h5>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p class="small text-muted mb-3">
                                                            Please enter a reason for rejecting user <strong><?= e($r['full_name']) ?></strong>'s Telegram number <code><?= e($r['telegram_number']) ?></code>. The user will see this message and be instructed to update their contact.
                                                        </p>
                                                        <label class="form-label small fw-bold">Rejection Reason</label>
                                                        <textarea name="rejection_reason" class="form-control form-control-sm" rows="3" placeholder="e.g. Number not registered on Telegram, unreachable, or invalid format." required></textarea>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
                                                        <button type="submit" class="btn btn-danger btn-sm fw-bold">Confirm Rejection</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                <?php endif; ?>

                                <?php if ($r['telegram_verification_status'] === 'APPROVED'): ?>
                                    <form method="POST" action="/admin/telegram-verifications.php" class="d-inline" onsubmit="return confirm('Revoke Telegram approval for <?= e($r['full_name']) ?>?');">
                                        <?= getCsrfField() ?>
                                        <input type="hidden" name="action" value="revoke">
                                        <input type="hidden" name="user_id" value="<?= $r['id'] ?>">
                                        <button type="submit" class="btn btn-outline-warning btn-sm py-1 px-2" title="Revoke Approval">
                                            <i class="bi bi-arrow-counterclockwise"></i> Unverify
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Persistent Audit Trail Section -->
<div class="card border-0 shadow-sm bg-white p-4">
    <h5 class="fw-bold mb-3"><i class="bi bi-journal-text text-primary me-2"></i> Telegram Verification Audit Log</h5>
    <p class="text-muted small mb-3">Immutable record of all submission, approval, rejection, and invalidation actions across the platform.</p>

    <div class="table-responsive">
        <table class="table table-sm table-hover align-middle small mb-0">
            <thead class="table-light">
                <tr>
                    <th>Date & Time</th>
                    <th>User</th>
                    <th>Telegram Number</th>
                    <th>Action</th>
                    <th>Status</th>
                    <th>Reviewed By</th>
                    <th>Details / Reason</th>
                    <th>IP Address</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($auditLogs)): ?>
                    <tr>
                        <td colspan="8" class="text-center py-3 text-muted">No audit trail records logged yet.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($auditLogs as $log): ?>
                        <tr>
                            <td class="text-muted text-nowrap"><?= date('d M Y, h:i A', strtotime($log['created_at'])) ?></td>
                            <td><strong><?= e($log['user_name'] ?? ('User #' . $log['user_id'])) ?></strong></td>
                            <td><code><?= e($log['telegram_number']) ?></code></td>
                            <td>
                                <span class="badge bg-light text-dark border">
                                    <?= e($log['action_type']) ?>
                                </span>
                            </td>
                            <td>
                                <?php if ($log['status'] === 'APPROVED'): ?>
                                    <span class="badge bg-success-subtle text-success">APPROVED</span>
                                <?php elseif ($log['status'] === 'PENDING'): ?>
                                    <span class="badge bg-warning-subtle text-warning-emphasis">PENDING</span>
                                <?php elseif ($log['status'] === 'REJECTED'): ?>
                                    <span class="badge bg-danger-subtle text-danger">REJECTED</span>
                                <?php else: ?>
                                    <span class="badge bg-secondary-subtle text-secondary"><?= e($log['status']) ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?= !empty($log['admin_name']) ? e($log['admin_name']) : '-' ?></td>
                            <td class="text-muted"><?= !empty($log['rejection_reason']) ? e($log['rejection_reason']) : '-' ?></td>
                            <td><code class="text-muted"><?= e($log['ip_address'] ?? '-') ?></code></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin_footer.php'; ?>
