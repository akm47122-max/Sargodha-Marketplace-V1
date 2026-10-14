<?php
/**
 * SARGODHAMART - Mobile-First Homepage
 * Matching the Latest Approved AI Studio Design
 * Sargodha | Shaheenabad | Sillanwali Local Marketplace
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$pageTitle = 'SargodhaMart - Buy • Sell • Jobs • Grow (Sargodha | Shaheenabad | Sillanwali)';
$metaDescription = 'Dedicated local online marketplace and employment portal for Sargodha, Shaheenabad, and Sillanwali. Buy & sell livestock, citrus crops, Honda 125, mobiles, property, and find local jobs.';

$db = getDB();

// 1. Fetch Categories
$categories = [];
try {
    $catStmt = $db->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC LIMIT 15");
    $categories = $catStmt->fetchAll();
} catch (Exception $e) {
    // Fallback categories if database is fresh
}

// Category icons map
$categoryIcons = [
    'mobiles' => '📱',
    'laptops-computers' => '💻',
    'electronics' => '📺',
    'cars' => '🚗',
    'bikes' => '🏍️',
    'property' => '🏢',
    'animals-livestock' => '🐄',
    'animal-feed-wanda' => '🌾',
    'clothes-shoes' => '👕',
    'furniture' => '🪑',
    'home-appliances' => '🔌',
    'jobs' => '💼',
    'agriculture' => '🍊',
    'services' => '🛠️',
    'food' => '🍔',
];

// 2. Fetch Featured Listings (case-insensitive for status)
$featuredListings = [];
try {
    $featStmt = $db->query("
        SELECT l.*, c.name as category_name, c.slug as category_slug, u.full_name as seller_name, u.mobile_number as seller_mobile,
               (SELECT image_path FROM listing_images WHERE listing_id = l.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
        FROM listings l
        JOIN categories c ON l.category_id = c.id
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.status) = 'published' AND l.is_featured = 1
        ORDER BY l.id DESC
        LIMIT 4
    ");
    $featuredListings = $featStmt->fetchAll();
} catch (Exception $e) {}

// Fallback featured if empty
if (empty($featuredListings)) {
    $featuredListings = [
        [
            'id' => 1,
            'title' => 'Export Quality Sargodha Fresh Kinnow + High Protein Dairy Wanda',
            'price' => 1450,
            'category_name' => 'Agriculture & Wanda',
            'city' => 'Sillanwali',
            'item_condition' => 'New',
            'phone_number' => '03098557159',
            'whatsapp_number' => '03098557159',
            'primary_image' => 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80',
            'created_at' => date('Y-m-d H:i:s', time() - 660),
            'seller_name' => 'Al-Makkah Kinnow Mandi',
        ],
        [
            'id' => 2,
            'title' => 'Pure Sahiwal Breed Milk Cow (18L Daily Yield) - Vaccinated',
            'price' => 385000,
            'category_name' => 'Animals & Livestock',
            'city' => 'Shaheenabad',
            'item_condition' => 'Used',
            'phone_number' => '03098557159',
            'whatsapp_number' => '03098557159',
            'primary_image' => 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
            'created_at' => date('Y-m-d H:i:s', time() - 660),
            'seller_name' => 'Malik Tariq Dairy Farm',
        ]
    ];
}

// 3. Fetch Latest Published Listings
$latestListings = [];
try {
    $latestStmt = $db->query("
        SELECT l.*, c.name as category_name, c.slug as category_slug, u.full_name as seller_name, u.mobile_number as seller_mobile,
               (SELECT image_path FROM listing_images WHERE listing_id = l.id ORDER BY is_primary DESC, id ASC LIMIT 1) as primary_image
        FROM listings l
        JOIN categories c ON l.category_id = c.id
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.status) = 'published'
        ORDER BY l.id DESC
        LIMIT 8
    ");
    $latestListings = $latestStmt->fetchAll();
} catch (Exception $e) {}

if (empty($latestListings)) {
    $latestListings = [
        [
            'id' => 3,
            'title' => 'iPhone 15 Pro Max 256GB Natural Titanium (PTA Approved Official)',
            'price' => 420000,
            'category_name' => 'Mobiles & Tech',
            'city' => 'Sargodha',
            'item_condition' => 'Used',
            'phone_number' => '03098557159',
            'whatsapp_number' => '03098557159',
            'primary_image' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
            'created_at' => date('Y-m-d H:i:s', time() - 660),
            'seller_name' => 'Trust Plaza Mobile Zone',
        ],
        [
            'id' => 4,
            'title' => 'Honda CG 125 Special Edition 2024 - Punjab Sargodha Registered',
            'price' => 275000,
            'category_name' => 'Bikes',
            'city' => 'Sargodha',
            'item_condition' => 'Used',
            'phone_number' => '03098557159',
            'whatsapp_number' => '03098557159',
            'primary_image' => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
            'created_at' => date('Y-m-d H:i:s', time() - 660),
            'seller_name' => 'Usman Motors Kutchery Road',
        ],
        [
            'id' => 1,
            'title' => 'Export Quality Sargodha Fresh Kinnow + High Protein Dairy Wanda',
            'price' => 1450,
            'category_name' => 'Agriculture',
            'city' => 'Sillanwali',
            'item_condition' => 'New',
            'phone_number' => '03098557159',
            'whatsapp_number' => '03098557159',
            'primary_image' => 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80',
            'created_at' => date('Y-m-d H:i:s', time() - 660),
            'seller_name' => 'Al-Makkah Kinnow Mandi',
        ],
        [
            'id' => 2,
            'title' => 'Pure Sahiwal Breed Milk Cow (18L Daily Yield) - Vaccinated',
            'price' => 385000,
            'category_name' => 'Animals & Livestock',
            'city' => 'Shaheenabad',
            'item_condition' => 'Used',
            'phone_number' => '03098557159',
            'whatsapp_number' => '03098557159',
            'primary_image' => 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
            'created_at' => date('Y-m-d H:i:s', time() - 660),
            'seller_name' => 'Malik Tariq Dairy Farm',
        ]
    ];
}

require_once __DIR__ . '/includes/header.php';
?>

<!-- ========================================== -->
<!-- 1. OFFICIAL WHATSAPP CHANNEL ANNOUNCEMENT  -->
<!-- ========================================== -->
<div class="max-w-7xl mx-auto px-4 pt-4">
    <div class="max-w-4xl mx-auto mb-6 p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-sm">
                <i class="bi bi-megaphone-fill text-lg"></i>
            </div>
            <div>
                <div class="font-black text-slate-900 text-sm flex items-center gap-2">
                    <span>Official WhatsApp Channel Announcement</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">Notice</span>
                </div>
                <div class="text-slate-600 text-xs font-medium mt-0.5">
                    Follow SargodhaMart official channel for instant alerts on cows, citrus crops, Honda 125, mobile deals &amp; jobs in Sargodha, Shaheenabad &amp; Sillanwali!
                </div>
            </div>
        </div>
        <a href="https://whatsapp.com/channel/0029Vb4qJ5s890123" target="_blank" rel="noreferrer" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-sm">
            <span>Join WhatsApp Channel</span>
            <i class="bi bi-box-arrow-up-right"></i>
        </a>
    </div>
</div>

<!-- ========================================== -->
<!-- 2. MODERN HERO BANNER & SEARCH CONTAINER   -->
<!-- ========================================== -->
<section class="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-cyan-50/30 border-b border-cyan-100 py-10 md:py-16">
    <!-- Background Neon Mesh Halos -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-400/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-4 text-center">
        <!-- Local District Network Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-cyan-300 text-xs text-slate-700 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
            </span>
            <span class="font-semibold text-slate-900">Local District Network:</span>
            <span class="text-cyan-700 font-extrabold">Sargodha • Shaheenabad • Sillanwali</span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-4xl mx-auto mb-4">
            Buy • Sell • Jobs • Grow <br>
            <span class="bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-xs">
                Your Local Online Marketplace
            </span>
        </h1>

        <!-- Supporting Introduction -->
        <p class="text-slate-600 text-xs md:text-sm max-w-2xl mx-auto mb-8 font-medium">
            The premier trading &amp; employment portal for Sargodha, Shaheenabad, and Sillanwali. Direct call &amp; WhatsApp dealing, verified Rs. 1,000 lifetime seller activation, zero middleman fees.
        </p>

        <!-- Search Field, Category Selector, City Selector and Find Button -->
        <div class="max-w-4xl mx-auto bg-white/95 backdrop-blur-2xl border border-cyan-200/90 p-2.5 md:p-3 rounded-3xl shadow-[0_15px_40px_-10px_rgba(6,182,212,0.18)] mb-8">
            <form action="/search.php" method="GET" class="grid grid-cols-1 md:grid-cols-12 gap-2 text-left">
                <!-- Search Input -->
                <div class="md:col-span-5 relative">
                    <i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-600"></i>
                    <input
                        type="text"
                        name="q"
                        value="<?= e($_GET['q'] ?? '') ?>"
                        placeholder="Search mobiles, cows, bikes, wanda, tractors..."
                        class="w-full pl-10 pr-3 py-2.5 bg-slate-50/90 border border-slate-200 rounded-2xl text-slate-900 text-xs md:text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all font-medium"
                    >
                </div>

                <!-- Category Selector -->
                <div class="md:col-span-3">
                    <select
                        name="category"
                        class="w-full px-3 py-2.5 bg-slate-50/90 border border-slate-200 rounded-2xl text-slate-800 text-xs md:text-sm focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                    >
                        <option value="">All Categories</option>
                        <?php foreach ($categories as $c): ?>
                            <option value="<?= e($c['slug']) ?>" <?= (($_GET['category'] ?? '') === $c['slug']) ? 'selected' : '' ?>>
                                <?= $categoryIcons[$c['slug']] ?? '📦' ?> <?= e($c['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- City Selector -->
                <div class="md:col-span-2">
                    <select
                        name="city"
                        class="w-full px-3 py-2.5 bg-slate-50/90 border border-slate-200 rounded-2xl text-slate-800 text-xs md:text-sm focus:outline-none focus:border-cyan-500 focus:bg-white font-medium"
                    >
                        <option value="">All Cities</option>
                        <option value="Sargodha" <?= (($_GET['city'] ?? '') === 'Sargodha') ? 'selected' : '' ?>>Sargodha</option>
                        <option value="Shaheenabad" <?= (($_GET['city'] ?? '') === 'Shaheenabad') ? 'selected' : '' ?>>Shaheenabad</option>
                        <option value="Sillanwali" <?= (($_GET['city'] ?? '') === 'Sillanwali') ? 'selected' : '' ?>>Sillanwali</option>
                    </select>
                </div>

                <!-- Find Button -->
                <div class="md:col-span-2">
                    <button
                        type="submit"
                        class="w-full h-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer"
                    >
                        <i class="bi bi-search"></i>
                        <span>Find</span>
                    </button>
                </div>
            </form>
        </div>

        <!-- 3. Product Filter Tabs -->
        <div class="flex items-center justify-center flex-wrap gap-2 max-w-4xl mx-auto mb-6 overflow-x-auto pb-2">
            <a href="/index.php" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all <?= empty($_GET['category']) && empty($_GET['verified']) ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white border border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-300' ?>">
                All Products
            </a>
            <a href="/search.php?verified=1" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 <?= !empty($_GET['verified']) ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] ring-2 ring-blue-300' : 'bg-blue-50/90 border border-blue-300 text-blue-700 hover:bg-blue-100 shadow-xs' ?>">
                <i class="bi bi-patch-check-fill text-blue-500"></i>
                <span>Verified Sellers Only</span>
            </a>
            <?php foreach (array_slice($categories, 0, 7) as $cat): ?>
                <a href="/search.php?category=<?= e($cat['slug']) ?>" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-300 shadow-xs transition-all flex items-center gap-1.5">
                    <span><?= $categoryIcons[$cat['slug']] ?? '📦' ?></span>
                    <span><?= e($cat['name']) ?></span>
                </a>
            <?php endforeach; ?>
            <a href="/colleges.php" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1">
                <span>🎓</span> Colleges &amp; Admissions
            </a>
            <a href="/food.php" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all flex items-center gap-1">
                <span>🍔</span> Food Deals
            </a>
        </div>
    </div>
</section>

<!-- ========================================== -->
<!-- 4. POPULAR CATEGORIES GRID                 -->
<!-- ========================================== -->
<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            Popular Categories
        </h2>
        <a href="/categories.php" class="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1">
            <span>View All 15 Categories</span>
            <i class="bi bi-arrow-right"></i>
        </a>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
        <?php foreach (array_slice($categories, 0, 12) as $cat): ?>
            <a href="/search.php?category=<?= e($cat['slug']) ?>" class="p-3.5 bg-white border border-slate-200 rounded-2xl hover:border-cyan-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-center group">
                <div class="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                    <?= $categoryIcons[$cat['slug']] ?? '📦' ?>
                </div>
                <div class="font-bold text-xs text-slate-800 group-hover:text-cyan-700 transition-colors line-clamp-1">
                    <?= e($cat['name']) ?>
                </div>
            </a>
        <?php endforeach; ?>
    </div>

    <!-- ========================================== -->
    <!-- 5. FEATURED LISTINGS (SPOTLIGHT)           -->
    <!-- ========================================== -->
    <div class="mb-12">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>⭐</span> Featured Listings
                </h2>
                <p class="text-slate-500 text-xs font-medium">
                    Promoted by verified local dealers in Sargodha &amp; surrounding areas
                </p>
            </div>
            <a href="/search.php?featured=1" class="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1">
                <span>View All Featured</span>
                <i class="bi bi-arrow-right"></i>
            </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <?php foreach ($featuredListings as $feat): ?>
                <?php
                $cleanPhone = preg_replace('/[^0-9]/', '', $feat['phone_number']);
                $cleanWa = preg_replace('/[^0-9]/', '', $feat['whatsapp_number']);
                if (str_starts_with($cleanWa, '0')) $cleanWa = '92' . substr($cleanWa, 1);
                $imgUrl = !empty($feat['primary_image']) ? $feat['primary_image'] : 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80';
                ?>
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
                    <div>
                        <!-- Image Container with Badges -->
                        <div class="relative h-44 bg-slate-100 overflow-hidden">
                            <img src="<?= e($imgUrl) ?>" alt="<?= e($feat['title']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                            <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-xs flex items-center gap-1">
                                <span>⭐</span> FEATURED
                            </span>
                            <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                                <?= e($feat['item_condition'] ?? 'Used') ?>
                            </span>
                        </div>

                        <!-- Card Body -->
                        <div class="p-4 space-y-1.5">
                            <div class="text-base font-black text-emerald-700">
                                Rs. <?= number_format((float)$feat['price']) ?>
                            </div>
                            <h3 class="font-bold text-slate-900 text-xs md:text-sm line-clamp-2 leading-snug">
                                <a href="/product.php?id=<?= $feat['id'] ?>" class="hover:text-cyan-700 transition-colors text-decoration-none text-slate-900">
                                    <?= e($feat['title']) ?>
                                </a>
                            </h3>
                            <div class="text-[11px] text-slate-500 flex items-center gap-2 pt-1 font-medium">
                                <span>🏷️ <?= e($feat['category_name']) ?></span>
                            </div>
                            <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                                <span>📍 <?= e($feat['city']) ?></span>
                                <span><?= timeAgo($feat['created_at']) ?></span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Call & WhatsApp CTAs -->
                    <div class="p-4 pt-0 flex items-center gap-2">
                        <a href="tel:<?= e($cleanPhone) ?>" class="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1">
                            <i class="bi bi-telephone-fill text-slate-600"></i> Call
                        </a>
                        <a href="https://wa.me/<?= e($cleanWa) ?>?text=<?= urlencode("Assalam-o-Alaikum! I saw your '{$feat['title']}' ad on SargodhaMart.") ?>" target="_blank" class="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-xs">
                            <i class="bi bi-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- 6. LATEST LISTINGS                         -->
    <!-- ========================================== -->
    <div class="mb-12">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                    Latest Listings
                </h2>
                <p class="text-slate-500 text-xs font-medium">
                    Recent ads posted across Sargodha, Shaheenabad &amp; Sillanwali
                </p>
            </div>
            <a href="/search.php" class="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1">
                <span>See More (<?= count($latestListings) ?>)</span>
                <i class="bi bi-arrow-right"></i>
            </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <?php foreach ($latestListings as $item): ?>
                <?php
                $cleanPhone = preg_replace('/[^0-9]/', '', $item['phone_number']);
                $cleanWa = preg_replace('/[^0-9]/', '', $item['whatsapp_number']);
                if (str_starts_with($cleanWa, '0')) $cleanWa = '92' . substr($cleanWa, 1);
                $imgUrl = !empty($item['primary_image']) ? $item['primary_image'] : 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=600&q=80';
                ?>
                <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
                    <div>
                        <!-- Image Container -->
                        <div class="relative h-44 bg-slate-100 overflow-hidden">
                            <img src="<?= e($imgUrl) ?>" alt="<?= e($item['title']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                            <?php if (!empty($item['is_featured'])): ?>
                                <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-xs">
                                    ⭐ FEATURED
                                </span>
                            <?php endif; ?>
                            <span class="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                                <?= e($item['item_condition'] ?? 'Used') ?>
                            </span>
                        </div>

                        <!-- Card Body -->
                        <div class="p-4 space-y-1.5">
                            <div class="text-base font-black text-emerald-700">
                                Rs. <?= number_format((float)$item['price']) ?>
                            </div>
                            <h3 class="font-bold text-slate-900 text-xs md:text-sm line-clamp-2 leading-snug">
                                <a href="/product.php?id=<?= $item['id'] ?>" class="hover:text-cyan-700 transition-colors text-decoration-none text-slate-900">
                                    <?= e($item['title']) ?>
                                </a>
                            </h3>
                            <div class="text-[11px] text-slate-500 flex items-center gap-2 pt-1 font-medium">
                                <span>🏷️ <?= e($item['category_name']) ?></span>
                            </div>
                            <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                                <span>📍 <?= e($item['city']) ?></span>
                                <span><?= timeAgo($item['created_at']) ?></span>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="p-4 pt-0 flex items-center gap-2">
                        <a href="tel:<?= e($cleanPhone) ?>" class="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1">
                            <i class="bi bi-telephone-fill text-slate-600"></i> Call
                        </a>
                        <a href="https://wa.me/<?= e($cleanWa) ?>?text=<?= urlencode("Assalam-o-Alaikum! I saw your '{$item['title']}' ad on SargodhaMart.") ?>" target="_blank" class="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-xs">
                            <i class="bi bi-whatsapp"></i> WhatsApp
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- 7. COLLEGES & CAMPUS ADS SHOWCASE          -->
    <!-- ========================================== -->
    <div class="mb-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 max-w-xl text-center md:text-left">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-pink-300 text-xs font-black uppercase tracking-wider border border-white/20">
                <i class="bi bi-mortarboard-fill"></i> Higher Education
            </span>
            <h2 class="text-2xl md:text-3xl font-black tracking-tight">
                Colleges, Admissions &amp; Campus Ads
            </h2>
            <p class="text-slate-300 text-xs md:text-sm font-medium leading-relaxed">
                Explore approved undergraduate degree admissions, intermediate colleges, scholarships, and professional IT diplomas in Sargodha. Apply directly online with verified links.
            </p>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a href="/colleges.php" class="px-6 py-3 rounded-2xl bg-white text-indigo-950 font-black text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2">
                <span>View Admissions &amp; Prospectus</span>
                <i class="bi bi-arrow-right"></i>
            </a>
            <a href="https://wa.me/923098557159?text=<?= urlencode('Assalam-o-Alaikum! I want to publish college admission advertisement on SargodhaMart.') ?>" target="_blank" class="px-5 py-3 rounded-2xl bg-indigo-800/60 hover:bg-indigo-800 text-white border border-indigo-500/30 font-bold text-xs transition-all flex items-center gap-1.5">
                <i class="bi bi-plus-circle"></i> Submit College Ad
            </a>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- 8. HOW SARGODHA MANDI WORKS                -->
    <!-- ========================================== -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-cyan-700">Transparent Local Commerce</span>
                <h2 class="text-xl font-black text-slate-900">How Sargodha Mandi Works</h2>
                <p class="text-slate-500 text-xs font-medium">A secure, scam-free local marketplace. Public browsing is 100% free; an affordable one-time Rs. 1,000 fee activates unlimited lifetime seller privileges.</p>
            </div>
            <a href="/post-ad.php" class="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 shrink-0 flex items-center gap-1.5 transition-all">
                <i class="bi bi-plus-circle"></i> Post Your Ad
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mb-2">1</div>
                <h3 class="font-bold text-slate-900 text-xs mb-1">Free Account &amp; Ad Details</h3>
                <p class="text-[11px] text-slate-500 leading-relaxed font-medium">Create your free account with your mobile number. Fill in title, photos, price, condition, and specify your area in Sargodha, Shaheenabad or Sillanwali.</p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mb-2">2</div>
                <h3 class="font-bold text-slate-900 text-xs mb-1">One-Time Activation (Rs. 1,000)</h3>
                <p class="text-[11px] text-slate-500 leading-relaxed font-medium">Send one-time fee to official number <strong>03098557159</strong> (Muhammad Akram Tayyab) via JazzCash / EasyPaisa. Submit your TRX ID for instant activation.</p>
            </div>

            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mb-2">3</div>
                <h3 class="font-bold text-slate-900 text-xs mb-1">Admin Verifies &amp; Publishes</h3>
                <p class="text-[11px] text-slate-500 leading-relaxed font-medium">Our local team checks the payment and content. Once approved, your ad is published instantly and local buyers can call, WhatsApp, or chat with you!</p>
            </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <i class="bi bi-exclamation-triangle-fill text-amber-600 mt-0.5 shrink-0"></i>
            <div>
                <strong>Important Buyer Safety Notice:</strong> Always meet sellers in safe public locations (such as Kutchery Bazaar, Trust Plaza, Canal Colony, or local Police Khidmat Markaz). Verify products, bio-metrics, and livestock in person before handing over money.
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
