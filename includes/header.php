<?php
/**
 * Global Header Component - SARGODHAMART
 * Mobile-First Modern Design Matching AI Studio Preview
 * Universal Top Bar: Regional District Strip · Wordmark Brand · Navigation Links · Primary Action (Post Ad)
 */
require_once __DIR__ . '/functions.php';

$user = currentUser();
$unreadNotifs = $user ? getUnreadNotificationCount($user['id']) : 0;
$unreadMsgs = $user ? getUnreadMessageCount($user['id']) : 0;
$flash = getFlash();

$siteName = getSetting('website_name', SITE_NAME);
$siteTagline = getSetting('tagline', SITE_TAGLINE);
$whatsappNum = getSetting('official_whatsapp', '03098557159');
$cleanWaNum = preg_replace('/[^0-9]/', '', $whatsappNum);
if (str_starts_with($cleanWaNum, '0')) {
    $cleanWaNum = '92' . substr($cleanWaNum, 1);
}
$activationFee = getSetting('activation_fee', 1000);
$currentUri = $_SERVER['REQUEST_URI'] ?? '/';

$pageTitle = $pageTitle ?? ($siteName . ' - Buy • Sell • Jobs • Grow (Sargodha | Shaheenabad | Sillanwali)');
$metaDesc = $metaDescription ?? getSetting('default_seo_description', 'Dedicated local online marketplace and employment hub for Sargodha, Shaheenabad, and Sillanwali.');
$ogTitleFinal = $ogTitle ?? $pageTitle;
$ogDescFinal = $ogDescription ?? $metaDesc;
$ogUrlFinal = $ogUrl ?? $canonicalUrl ?? (SITE_URL . ($_SERVER['REQUEST_URI'] ?? '/'));
$ogImageFinal = $ogImage ?? getSetting('og_image_url', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80');
$ogTypeFinal = $ogType ?? 'website';

// Active Top Bar Announcements
$topAnnouncements = getActiveAnnouncementsPHP('top_bar');

// Maintenance Mode Enforcement (Admins bypass maintenance)
if (isMaintenanceModePHP() && !isAdmin() && !str_contains($_SERVER['REQUEST_URI'] ?? '', '/admin')) {
    $maintTitle = getSetting('maintenance_title', 'SargodhaMart Scheduled System Upgrade');
    $maintMsg = getSetting('maintenance_message', 'We are performing routine maintenance to improve your marketplace experience. We will be back online shortly.');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= e($maintTitle) ?> - <?= e($siteName) ?></title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    </head>
    <body class="bg-slate-50 flex items-center justify-center min-h-screen p-4 text-slate-800">
        <div class="max-w-md w-full bg-white border border-amber-300 rounded-3xl p-8 shadow-2xl text-center">
            <div class="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-300 flex items-center justify-center mx-auto mb-4">
                <i class="bi bi-tools text-3xl"></i>
            </div>
            <h2 class="text-2xl font-black text-slate-900 mb-2"><?= e($maintTitle) ?></h2>
            <p class="text-slate-600 text-xs leading-relaxed mb-6 font-medium"><?= nl2br(e($maintMsg)) ?></p>
            <div class="flex items-center justify-center gap-3">
                <a href="https://wa.me/<?= e($cleanWaNum) ?>" target="_blank" class="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md">
                    <i class="bi bi-whatsapp me-1"></i> WhatsApp Helpline
                </a>
                <a href="/admin/login.php" class="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-all">
                    <i class="bi bi-shield-lock me-1"></i> Admin Login
                </a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle) ?></title>
    <meta name="description" content="<?= e($metaDesc) ?>">
    <?php if (!empty($canonicalUrl)): ?>
        <link rel="canonical" href="<?= e($canonicalUrl) ?>">
    <?php endif; ?>

    <!-- OpenGraph Social Sharing Metadata -->
    <meta property="og:title" content="<?= e($ogTitleFinal) ?>">
    <meta property="og:description" content="<?= e($ogDescFinal) ?>">
    <meta property="og:url" content="<?= e($ogUrlFinal) ?>">
    <meta property="og:type" content="<?= e($ogTypeFinal) ?>">
    <meta property="og:site_name" content="<?= e($siteName) ?>">
    <?php if (!empty($ogImageFinal)): ?>
        <meta property="og:image" content="<?= e($ogImageFinal) ?>">
    <?php endif; ?>

    <!-- Twitter / X Card Metadata -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($twitterTitle ?? $ogTitleFinal) ?>">
    <meta name="twitter:description" content="<?= e($twitterDescription ?? $ogDescFinal) ?>">
    <?php if (!empty($ogImageFinal)): ?>
        <meta name="twitter:image" content="<?= e($twitterImage ?? $ogImageFinal) ?>">
    <?php endif; ?>

    <!-- Favicon & PWA Manifest -->
    <link rel="icon" type="image/svg+xml" href="/icon.svg">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0891b2">

    <!-- Tailwind CSS (Play CDN for modern instant design matching AI Studio) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#0891b2',
                    }
                }
            }
        };
    </script>

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <!-- Custom Marketplace Styles -->
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col font-sans">

<?php if (!empty($topAnnouncements)): ?>
    <!-- Top Bar Live Broadcast Announcements -->
    <?php foreach ($topAnnouncements as $ann): ?>
        <div class="text-center py-2 px-3 text-xs font-bold flex justify-center items-center gap-2 <?= $ann['is_highlighted'] ? 'bg-amber-100 text-amber-900 border-b border-amber-300' : 'bg-emerald-100 text-emerald-900 border-b border-emerald-300' ?>">
            <span><?= e($ann['title']) ?></span>
            <span class="hidden md:inline font-normal">| <?= e($ann['message']) ?></span>
            <?php if (!empty($ann['button_text']) && !empty($ann['button_url'])): ?>
                <a href="<?= e($ann['button_url']) ?>" target="_blank" class="px-2.5 py-0.5 rounded-full text-[11px] <?= $ann['is_highlighted'] ? 'bg-slate-900 text-white' : 'bg-emerald-700 text-white' ?>">
                    <?= e($ann['button_text']) ?> <i class="bi bi-arrow-right"></i>
                </a>
            <?php endif; ?>
        </div>
    <?php endforeach; ?>
<?php endif; ?>

<!-- 1. Regional District Selection Bar -->
<div class="bg-slate-100 border-b border-slate-200 py-1.5 px-4 text-xs">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <!-- District & Tehsils Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap py-0.5">
            <span class="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Division:
            </span>

            <a href="/index.php" class="px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all shrink-0 bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                Sargodha
            </a>
            <a href="/search.php?city=Khushab" class="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0">
                Khushab
            </a>
            <a href="/search.php?city=Mianwali" class="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0">
                Mianwali
            </a>
            <a href="/search.php?city=Bhakkar" class="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all shrink-0">
                Bhakkar
            </a>

            <!-- Tehsils Shortcut -->
            <div class="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-300 ml-1 shrink-0">
                <span class="text-[10px] uppercase font-bold text-slate-400">Tehsils:</span>
                <a href="/search.php?city=Sargodha" class="px-2 py-0.5 rounded-md text-[11px] text-slate-600 hover:bg-slate-200">Sargodha City</a>
                <a href="/search.php?city=Shaheenabad" class="px-2 py-0.5 rounded-md text-[11px] text-slate-600 hover:bg-slate-200">Shaheenabad</a>
                <a href="/search.php?city=Sillanwali" class="px-2 py-0.5 rounded-md text-[11px] text-slate-600 hover:bg-slate-200">Sillanwali</a>
                <a href="/search.php?q=Bhalwal" class="px-2 py-0.5 rounded-md text-[11px] text-slate-600 hover:bg-slate-200">Bhalwal</a>
            </div>
        </div>

        <!-- Right Activation & Official WhatsApp Channel -->
        <div class="hidden lg:flex items-center gap-3 text-slate-600 shrink-0 text-xs">
            <span>
                Lifetime Seller Activation: <strong class="text-cyan-700 font-bold">Rs. <?= number_format($activationFee) ?></strong>
            </span>
            <span>•</span>
            <a href="https://whatsapp.com/channel/0029Vb4qJ5s890123" target="_blank" rel="noreferrer" class="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1">
                <span>📲</span> Official WhatsApp Channel
            </a>
        </div>
    </div>
</div>

<!-- 2. Main Navigation Bar -->
<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Brand Logo & Tagline -->
        <a href="/index.php" class="flex items-center gap-2.5 group text-decoration-none">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <i class="bi bi-shop"></i>
            </div>
            <div>
                <div class="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1 leading-none">
                    <span>SARGODHA</span><span class="text-cyan-600">MART</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div class="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mt-0.5">
                    BUY • SELL • JOBS • FREIGHT
                </div>
            </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-600">
            <a href="/index.php" class="px-3 py-1.5 rounded-xl transition-all <?= ($currentUri === '/' || $currentUri === '/index.php') ? 'bg-cyan-50 text-cyan-800 border border-cyan-300' : 'hover:text-slate-950 hover:bg-slate-100' ?>">
                Marketplace
            </a>
            <a href="/categories.php" class="px-3 py-1.5 rounded-xl transition-all <?= str_contains($currentUri, 'categories') ? 'bg-cyan-50 text-cyan-800 border border-cyan-300' : 'hover:text-slate-950 hover:bg-slate-100' ?>">
                Categories
            </a>
            <a href="/food.php" class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 <?= str_contains($currentUri, 'food') ? 'bg-amber-50 text-amber-800 border border-amber-300' : 'hover:text-slate-950 hover:bg-slate-100' ?>">
                <i class="bi bi-cup-hot text-amber-500"></i> Food Deals
            </a>
            <a href="/jobs.php" class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 <?= str_contains($currentUri, 'jobs') ? 'bg-blue-50 text-blue-800 border border-blue-300' : 'hover:text-slate-950 hover:bg-slate-100' ?>">
                <i class="bi bi-briefcase text-blue-600"></i> Jobs
            </a>
            <a href="/skills.php" class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 <?= str_contains($currentUri, 'skills') ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'hover:text-slate-950 hover:bg-slate-100' ?>">
                <i class="bi bi-stars text-emerald-600"></i> Digital Skills
            </a>
            <a href="/transport.php" class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 <?= str_contains($currentUri, 'transport') ? 'bg-amber-50 text-amber-800 border border-amber-300' : 'hover:text-slate-950 hover:bg-slate-100' ?>">
                <i class="bi bi-truck text-amber-600"></i> Truck Freight
            </a>
            <a href="/colleges.php" class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 <?= str_contains($currentUri, 'colleges') ? 'bg-indigo-50 text-indigo-800 border border-indigo-300' : 'hover:text-indigo-900 hover:bg-indigo-50 text-indigo-700' ?>">
                <i class="bi bi-mortarboard-fill text-indigo-600"></i> Colleges &amp; Admissions
            </a>
            <a href="/search.php?featured=1" class="px-3 py-1.5 rounded-xl transition-all text-amber-700 hover:bg-amber-50">
                ⭐ Featured
            </a>
        </nav>

        <!-- Right Action Buttons -->
        <div class="flex items-center gap-2">
            <!-- + Post an Ad Primary Button -->
            <a href="/post-ad.php" class="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 via-blue-600 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white shadow-md shadow-cyan-500/25 transition-all flex items-center gap-1.5 hover:scale-102">
                <i class="bi bi-plus-circle"></i>
                <span class="hidden sm:inline">Post an Ad</span>
                <span class="sm:hidden">Post</span>
            </a>

            <?php if ($user): ?>
                <!-- Logged In User Dropdown -->
                <div class="relative group">
                    <button class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all">
                        <span class="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px] font-black">
                            <?= strtoupper(substr($user['full_name'], 0, 1)) ?>
                        </span>
                        <span class="hidden md:inline max-w-[100px] truncate"><?= e(explode(' ', $user['full_name'])[0]) ?></span>
                        <i class="bi bi-chevron-down text-[10px] text-slate-500"></i>
                    </button>

                    <!-- Dropdown Menu -->
                    <div class="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 hidden group-hover:block hover:block z-50">
                        <div class="px-3 py-2 border-b border-slate-100">
                            <div class="text-xs font-black text-slate-900 truncate"><?= e($user['full_name']) ?></div>
                            <div class="text-[10px] text-slate-500"><?= e($user['city']) ?> (<?= e($user['role']) ?>)</div>
                        </div>
                        <a href="/user/dashboard.php" class="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                            <i class="bi bi-speedometer2 me-1.5 text-cyan-600"></i> Seller Dashboard
                        </a>
                        <a href="/user/my-listings.php" class="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                            <i class="bi bi-collection me-1.5 text-slate-500"></i> My Listings
                        </a>
                        <a href="/user/messages.php" class="block px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                            <i class="bi bi-chat-dots me-1.5 text-slate-500"></i> Messages
                        </a>
                        <?php if (isAdmin()): ?>
                            <a href="/admin/index.php" class="block px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-50 border-t border-slate-100">
                                <i class="bi bi-shield-lock me-1.5"></i> Admin Panel
                            </a>
                        <?php endif; ?>
                        <a href="/logout.php" class="block px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border-t border-slate-100">
                            <i class="bi bi-box-arrow-right me-1.5"></i> Logout
                        </a>
                    </div>
                </div>
            <?php else: ?>
                <!-- Guest Login / Register -->
                <a href="/login.php" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all">
                    Login
                </a>
                <a href="/register.php" class="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-all">
                    Register
                </a>
            <?php endif; ?>
        </div>
    </div>
</header>

<!-- Global Flash Messages -->
<?php if ($flash): ?>
    <div class="max-w-7xl mx-auto px-4 mt-4">
        <div class="p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xs <?= $flash['type'] === 'danger' ? 'bg-rose-50 text-rose-800 border border-rose-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-300' ?>">
            <div class="flex items-center gap-2">
                <i class="bi bi-info-circle-fill"></i>
                <span><?= e($flash['message']) ?></span>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-700">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    </div>
<?php endif; ?>

<main class="flex-1 pb-20 md:pb-8">
