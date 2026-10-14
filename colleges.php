<?php
/**
 * SARGODHAMART - Colleges, Admissions & Campus Ads
 * Buy • Sell • Jobs • Grow
 * Sargodha | Shaheenabad | Sillanwali
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$db = getDB();
$siteBrand = getSetting('website_name', 'SargodhaMart');
$pageTitle = "Colleges & University Admissions Sargodha | {$siteBrand}";
$metaDescription = "Explore verified colleges, university admissions, fee structures, courses, and apply directly via official application portals in Sargodha.";

$typeFilter = $_GET['type'] ?? 'ALL';
$cityFilter = $_GET['city'] ?? 'ALL';

$sql = "SELECT * FROM college_ads WHERE status = 'APPROVED'";
$params = [];

if ($typeFilter !== 'ALL') {
    $sql .= " AND institute_type = :itype";
    $params[':itype'] = $typeFilter;
}
if ($cityFilter !== 'ALL') {
    $sql .= " AND city = :city";
    $params[':city'] = $cityFilter;
}
$sql .= " ORDER BY id DESC";

$colleges = [];
try {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $colleges = $stmt->fetchAll();
} catch (Exception $e) {
    // Fallback
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white p-6 md:p-10 mb-8 shadow-xl">
        <div class="relative z-10 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
                <i class="bi bi-mortarboard-fill text-pink-300"></i> Higher Education &amp; Admissions 2026
            </span>
            <h1 class="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                Colleges, Admissions &amp; Campus Ads
            </h1>
            <p class="text-white/90 text-sm md:text-base font-medium mb-6">
                Explore approved undergraduate and postgraduate degree admissions, intermediate colleges, scholarships, and professional IT diplomas in Sargodha Division.
            </p>
            <div class="flex flex-wrap gap-3">
                <a href="https://wa.me/923098557159?text=<?= urlencode('Assalam-o-Alaikum! I represent an educational institute in Sargodha and want to publish an admission ad.') ?>" target="_blank" class="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5">
                    <i class="bi bi-megaphone-fill text-indigo-600"></i> Promote Your Institute (Rs. 3,500 / 30 Days)
                </a>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 opacity-15 text-[180px] pointer-events-none -mr-10 -mb-10">
            🎓
        </div>
    </div>

    <!-- Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        <a href="/colleges.php" class="px-3.5 py-1.5 rounded-xl text-xs font-bold <?= $typeFilter === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' ?>">
            All Institutes
        </a>
        <a href="/colleges.php?type=University" class="px-3.5 py-1.5 rounded-xl text-xs font-bold <?= $typeFilter === 'University' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' ?>">
            Universities
        </a>
        <a href="/colleges.php?type=College" class="px-3.5 py-1.5 rounded-xl text-xs font-bold <?= $typeFilter === 'College' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' ?>">
            Colleges (F.Sc / ICS)
        </a>
        <a href="/colleges.php?type=Academy" class="px-3.5 py-1.5 rounded-xl text-xs font-bold <?= $typeFilter === 'Academy' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' ?>">
            IT &amp; Skills Academies
        </a>
    </div>

    <!-- Colleges Grid -->
    <?php if (empty($colleges)): ?>
        <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
            <i class="bi bi-mortarboard text-indigo-500 text-4xl mb-3 block"></i>
            No active admission advertisements found for this selection.
        </div>
    <?php else: ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <?php foreach ($colleges as $c): ?>
                <?php
                $cleanPhone = preg_replace('/[^0-9]/', '', $c['phone']);
                $cleanWa = preg_replace('/[^0-9]/', '', $c['whatsapp']);
                if (str_starts_with($cleanWa, '0')) $cleanWa = '92' . substr($cleanWa, 1);
                $isExpired = strtotime($c['application_deadline']) < time();
                ?>
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group">
                    <div>
                        <!-- Poster Preview -->
                        <div class="relative h-48 bg-slate-900 overflow-hidden">
                            <img src="<?= e($c['poster_image']) ?>" alt="<?= e($c['institute_name']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase">
                                <?= e($c['institute_type']) ?>
                            </span>
                            <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold <?= $isExpired ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white' ?>">
                                <?= $isExpired ? 'Admissions Closed' : 'Admissions Open' ?>
                            </span>
                            <div class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent text-white">
                                <div class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                    <i class="bi bi-calendar-event text-amber-400"></i>
                                    <span>Deadline: <strong><?= date('d M Y', strtotime($c['application_deadline'])) ?></strong></span>
                                </div>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="p-5 space-y-3">
                            <h3 class="font-black text-slate-900 text-base leading-snug">
                                <?= e($c['institute_name']) ?>
                            </h3>
                            <?php if (!empty($c['tagline'])): ?>
                                <p class="text-xs text-indigo-700 font-bold leading-relaxed">
                                    <?= e($c['tagline']) ?>
                                </p>
                            <?php endif; ?>
                            <div class="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                                <i class="bi bi-geo-alt-fill text-rose-500"></i>
                                <span><?= e($c['location']) ?></span>
                            </div>

                            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <div class="text-[10px] font-black uppercase tracking-wider text-slate-400">Courses &amp; Degrees:</div>
                                <div class="text-xs text-slate-700 font-medium line-clamp-3">
                                    <?= e($c['courses_offered']) ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="p-5 pt-0 space-y-2">
                        <!-- Prominent Apply for Admission Button -->
                        <a href="<?= e($c['application_form_url']) ?>" target="_blank" rel="noopener noreferrer" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs text-center transition-all shadow-md flex items-center justify-center gap-2">
                            <span>Apply for Admission</span>
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>

                        <div class="flex items-center gap-2">
                            <a href="tel:<?= e($cleanPhone) ?>" class="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1">
                                <i class="bi bi-telephone-fill text-slate-600"></i> Call Desk
                            </a>
                            <a href="https://wa.me/<?= e($cleanWa) ?>?text=<?= urlencode("Assalam-o-Alaikum! I saw {$c['institute_name']} on SargodhaMart. I want to inquire about admissions.") ?>" target="_blank" class="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-xs">
                                <i class="bi bi-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
