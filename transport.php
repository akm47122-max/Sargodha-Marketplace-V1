<?php
/**
 * SARGODHAMART - Nationwide Truck & Freight Logistics Hub
 * Buy • Sell • Jobs • Grow
 * Sargodha | Shaheenabad | Sillanwali
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$siteBrand = getSetting('website_name', 'SargodhaMart');
$pageTitle = "Truck & Freight Logistics Sargodha | {$siteBrand}";
$metaDescription = "Book Mazda, Shehzore, 10-wheeler, and 22-wheeler trailer trucks for citrus harvest, livestock, and general commercial cargo transport across Pakistan.";

$trucks = [
    [
        'id' => 1,
        'transporter' => 'Al-Makkah Kinnow Freight Service',
        'truck_type' => 'Mazda Titan (16 Ft Open / Covered)',
        'capacity' => '6.5 Tons',
        'city' => 'Sillanwali Citrus Belt',
        'routes' => 'Sargodha ⇄ Lahore ⇄ Karachi ⇄ Faisalabad',
        'phone' => '03098557159',
        'whatsapp' => '03098557159',
        'verified' => true
    ],
    [
        'id' => 2,
        'transporter' => 'Shaheenabad Mandi Cattle Movers',
        'truck_type' => 'Bedford 6-Wheeler Cattle Special',
        'capacity' => '12 Buffaloes / 20 Cows',
        'city' => 'Shaheenabad',
        'routes' => 'Shaheenabad ⇄ Multan ⇄ Karachi ⇄ Peshawar',
        'phone' => '03098557159',
        'whatsapp' => '03098557159',
        'verified' => true
    ],
    [
        'id' => 3,
        'transporter' => 'Punjab Intercity Trailer Logistics',
        'truck_type' => '22-Wheeler Flatbed / Container Trailer',
        'capacity' => '35 - 45 Tons',
        'city' => 'Sargodha Bypass',
        'routes' => 'Punjab Industrial Zones ⇄ Port Qasim Karachi',
        'phone' => '03098557159',
        'whatsapp' => '03098557159',
        'verified' => true
    ]
];

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 py-6">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-yellow-700 to-amber-900 text-white p-6 md:p-10 mb-8 shadow-xl">
        <div class="relative z-10 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
                <i class="bi bi-truck text-amber-300"></i> Nationwide Commercial Freight
            </span>
            <h1 class="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                Truck &amp; Heavy Freight Logistics
            </h1>
            <p class="text-white/90 text-sm md:text-base font-medium mb-6">
                Direct booking for Kinnow fruit transport, live dairy cattle moving, grain harvest, and commercial factory loads originating from Sargodha.
            </p>
            <div class="flex flex-wrap gap-3">
                <a href="https://wa.me/923098557159?text=<?= urlencode('Assalam-o-Alaikum! I have freight cargo in Sargodha. I need transport quotes.') ?>" target="_blank" class="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5">
                    <i class="bi bi-box-seam text-amber-600"></i> Post Cargo Load (Free)
                </a>
                <a href="https://wa.me/923098557159?text=<?= urlencode('Assalam-o-Alaikum! I own commercial trucks. I want to register as a transporter on SargodhaMart.') ?>" target="_blank" class="px-5 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-white border border-white/30 font-bold text-xs transition-all flex items-center gap-1.5">
                    <i class="bi bi-truck"></i> Register Commercial Truck
                </a>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 opacity-15 text-[180px] pointer-events-none -mr-10 -mb-10">
            🚛
        </div>
    </div>

    <!-- Commercial Transporters Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <?php foreach ($trucks as $t): ?>
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-2xl border border-amber-200">
                            <i class="bi bi-truck"></i>
                        </div>
                        <?php if ($t['verified']): ?>
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                                <i class="bi bi-check-circle-fill"></i> Verified Transporter
                            </span>
                        <?php endif; ?>
                    </div>

                    <h3 class="text-base font-black text-slate-900 mb-0.5"><?= e($t['transporter']) ?></h3>
                    <div class="text-xs font-bold text-amber-800 mb-2"><?= e($t['truck_type']) ?></div>
                    <div class="text-[11px] text-slate-500 mb-3 space-y-1">
                        <div>⚖️ Load Capacity: <strong><?= e($t['capacity']) ?></strong></div>
                        <div>📍 Operating Base: <strong><?= e($t['city']) ?></strong></div>
                        <div>🛣️ Active Routes: <span class="text-slate-700 font-semibold"><?= e($t['routes']) ?></span></div>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <a href="tel:<?= e($t['phone']) ?>" class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5">
                        <i class="bi bi-telephone-fill text-slate-600"></i> Call
                    </a>
                    <a href="https://wa.me/92<?= substr($t['whatsapp'], 1) ?>?text=<?= urlencode("Assalam-o-Alaikum {$t['transporter']}! I need freight rates for cargo transport.") ?>" target="_blank" class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs">
                        <i class="bi bi-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
