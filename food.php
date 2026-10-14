<?php
/**
 * SARGODHAMART - Food Deals & Local Restaurants
 * Buy • Sell • Jobs • Grow
 * Sargodha | Shaheenabad | Sillanwali
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$db = getDB();
$siteBrand = getSetting('website_name', 'SargodhaMart');
$pageTitle = "Food Deals & Restaurants in Sargodha | {$siteBrand}";
$metaDescription = "Explore the best local restaurants, fast food deals, biryani, burgers, and family platters in Sargodha, Shaheenabad, and Sillanwali.";

// Fetch food deals from database
$deals = [];
$restaurants = [];
try {
    $dealsStmt = $db->query("
        SELECT d.*, r.name as restaurant_name, r.address as restaurant_address, r.phone as restaurant_phone, r.whatsapp as restaurant_whatsapp, r.city as restaurant_city
        FROM food_deals d
        JOIN restaurants r ON d.restaurant_id = r.id
        WHERE d.is_active = 1
        ORDER BY d.id DESC
        LIMIT 24
    ");
    $deals = $dealsStmt->fetchAll();

    $restStmt = $db->query("SELECT * FROM restaurants ORDER BY rating DESC LIMIT 12");
    $restaurants = $restStmt->fetchAll();
} catch (Exception $e) {
    // Fallback if table not populated
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Header Hero -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white p-6 md:p-10 mb-8 shadow-xl">
        <div class="relative z-10 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
                <i class="bi bi-fire"></i> Hot Sargodha Food Deals
            </span>
            <h1 class="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                Taste Sargodha’s Best Deals &amp; Dine
            </h1>
            <p class="text-white/90 text-sm md:text-base font-medium mb-6">
                Discover mouth-watering pizza combos, club burgers, handi platters, and authentic biryani from top verified kitchens in Sargodha, Shaheenabad &amp; Sillanwali.
            </p>
            <div class="flex flex-wrap gap-3">
                <a href="#deals" class="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5">
                    <i class="bi bi-tag-fill text-amber-500"></i> Browse Deals
                </a>
                <a href="https://wa.me/923098557159?text=<?= urlencode('Assalam-o-Alaikum! I want to list my restaurant deals on SargodhaMart.') ?>" target="_blank" class="px-5 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-white border border-white/30 font-bold text-xs transition-all flex items-center gap-1.5">
                    <i class="bi bi-plus-circle"></i> List Your Food Outlet
                </a>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 opacity-15 text-[180px] pointer-events-none -mr-10 -mb-10">
            🍔
        </div>
    </div>

    <!-- Active Food Deals Grid -->
    <div id="deals" class="mb-10">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-xl font-black text-slate-900">Featured Food Deals</h2>
                <p class="text-slate-500 text-xs">Direct WhatsApp &amp; Call ordering with verified local eateries.</p>
            </div>
            <span class="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <?= count($deals) ?> Deals Active
            </span>
        </div>

        <?php if (empty($deals)): ?>
            <div class="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
                <i class="bi bi-cup-hot text-amber-500 text-3xl mb-2 block"></i>
                Fresh daily deals updating shortly. Call support at <strong class="text-slate-800">0309 8557159</strong> to feature your restaurant deal!
            </div>
        <?php else: ?>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <?php foreach ($deals as $deal): ?>
                    <?php
                    $cleanPhone = preg_replace('/[^0-9]/', '', $deal['restaurant_phone'] ?? '03098557159');
                    $cleanWa = preg_replace('/[^0-9]/', '', $deal['restaurant_whatsapp'] ?? '03098557159');
                    if (str_starts_with($cleanWa, '0')) $cleanWa = '92' . substr($cleanWa, 1);
                    ?>
                    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                        <div>
                            <div class="relative h-44 bg-slate-100 overflow-hidden">
                                <?php if (!empty($deal['image'])): ?>
                                    <img src="<?= e($deal['image']) ?>" alt="<?= e($deal['title']) ?>" class="w-full h-full object-cover">
                                <?php else: ?>
                                    <div class="w-full h-full flex items-center justify-center text-4xl text-slate-300">🍕</div>
                                <?php endif; ?>
                                <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase shadow-xs">
                                    SAVE <?= round((($deal['original_price'] - $deal['deal_price']) / $deal['original_price']) * 100) ?>%
                                </span>
                                <span class="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                                    📍 <?= e($deal['restaurant_city']) ?>
                                </span>
                            </div>

                            <div class="p-3.5 space-y-1.5">
                                <div class="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
                                    <?= e($deal['restaurant_name']) ?>
                                </div>
                                <h3 class="font-bold text-slate-950 text-sm line-clamp-1">
                                    <?= e($deal['title']) ?>
                                </h3>
                                <p class="text-slate-500 text-xs line-clamp-2 font-medium">
                                    <?= e($deal['description']) ?>
                                </p>
                                <div class="pt-2 flex items-baseline gap-2">
                                    <span class="text-base font-black text-rose-600">Rs. <?= number_format($deal['deal_price']) ?></span>
                                    <span class="text-xs text-slate-400 line-through font-medium">Rs. <?= number_format($deal['original_price']) ?></span>
                                </div>
                            </div>
                        </div>

                        <div class="p-3.5 pt-0 flex items-center gap-2">
                            <a href="tel:<?= e($cleanPhone) ?>" class="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1">
                                <i class="bi bi-telephone-fill text-slate-600"></i> Call
                            </a>
                            <a href="https://wa.me/<?= e($cleanWa) ?>?text=<?= urlencode("Assalam-o-Alaikum! I want to order '{$deal['title']}' listed on SargodhaMart.") ?>" target="_blank" class="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-xs">
                                <i class="bi bi-whatsapp"></i> Order
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
