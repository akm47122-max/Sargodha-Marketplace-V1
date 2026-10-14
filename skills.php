<?php
/**
 * SARGODHAMART - Digital Skills & Local IT Talent Hub
 * Buy • Sell • Jobs • Grow
 * Sargodha | Shaheenabad | Sillanwali
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/functions.php';

$db = getDB();
$siteBrand = getSetting('website_name', 'SargodhaMart');
$pageTitle = "Digital Skills & Freelancers in Sargodha | {$siteBrand}";
$metaDescription = "Hire verified local web developers, graphic designers, video editors, and digital marketers based in Sargodha, Shaheenabad, and Sillanwali.";

// Query skills
$skills = [
    [
        'id' => 1,
        'full_name' => 'Muhammad Akram Tayyab',
        'professional_title' => 'Full-Stack Software Engineer & Cloud Architect',
        'city' => 'Sargodha',
        'area' => 'University Road',
        'experience_years' => 7,
        'hourly_rate' => 2500,
        'mobile' => '03098557159',
        'whatsapp' => '03098557159',
        'skills' => ['PHP & MySQL', 'React / TypeScript', 'E-Commerce Portals', 'REST APIs', 'Cloud DevOps'],
        'about' => 'Senior full-stack engineer building custom local marketplaces, robust inventory databases, payment gateways, and high-performance business applications.',
        'is_verified' => true
    ],
    [
        'id' => 2,
        'full_name' => 'Bilal Hassan UI/UX',
        'professional_title' => 'Creative UI/UX & Web Designer',
        'city' => 'Sargodha',
        'area' => 'Satellite Town',
        'experience_years' => 4,
        'hourly_rate' => 1500,
        'mobile' => '03098557159',
        'whatsapp' => '03098557159',
        'skills' => ['Figma UI/UX', 'Mobile App Design', 'Brand Identity', 'Landing Pages'],
        'about' => 'Crafting beautiful, high-converting digital storefronts and responsive mobile interfaces for local brands and emerging startups.',
        'is_verified' => true
    ],
    [
        'id' => 3,
        'full_name' => 'Hamza Tariq Reels',
        'professional_title' => 'Social Media Video Editor & Motion Creator',
        'city' => 'Shaheenabad',
        'area' => 'Canal Road',
        'experience_years' => 3,
        'hourly_rate' => 1200,
        'mobile' => '03098557159',
        'whatsapp' => '03098557159',
        'skills' => ['Premiere Pro', 'After Effects', 'TikTok Reels', 'Product Commercials'],
        'about' => 'Producing high-impact video reels and commercial advertisements for agricultural firms, dairy brands, and electronics retail shops.',
        'is_verified' => true
    ]
];

require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-7xl mx-auto px-4 py-6">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 text-white p-6 md:p-10 mb-8 shadow-xl">
        <div class="relative z-10 max-w-2xl">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
                <i class="bi bi-patch-check-fill text-cyan-300"></i> Local Tech Talent Network
            </span>
            <h1 class="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                Hire Local Digital Experts
            </h1>
            <p class="text-white/90 text-sm md:text-base font-medium mb-6">
                Connect with verified software engineers, web developers, graphic designers, video editors, and marketing strategists in Sargodha.
            </p>
            <div class="flex flex-wrap gap-3">
                <a href="https://wa.me/923098557159?text=<?= urlencode('Assalam-o-Alaikum! I want to list my digital skill profile on SargodhaMart.') ?>" target="_blank" class="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all flex items-center gap-1.5">
                    <i class="bi bi-plus-circle text-emerald-600"></i> List Your Professional Skills
                </a>
                <a href="/jobs.php" class="px-5 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-white border border-white/30 font-bold text-xs transition-all flex items-center gap-1.5">
                    <i class="bi bi-briefcase"></i> View Job Openings
                </a>
            </div>
        </div>
        <div class="absolute right-0 bottom-0 opacity-15 text-[180px] pointer-events-none -mr-10 -mb-10">
            💻
        </div>
    </div>

    <!-- Skills List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <?php foreach ($skills as $s): ?>
            <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                            <?= strtoupper(substr($s['full_name'], 0, 1)) ?>
                        </div>
                        <?php if ($s['is_verified']): ?>
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                                <i class="bi bi-patch-check-fill text-blue-600"></i> Verified Pro
                            </span>
                        <?php endif; ?>
                    </div>

                    <h3 class="text-base font-black text-slate-900 mb-0.5"><?= e($s['full_name']) ?></h3>
                    <div class="text-xs font-bold text-emerald-700 mb-2"><?= e($s['professional_title']) ?></div>
                    <div class="text-[11px] text-slate-500 flex items-center gap-2 mb-3">
                        <span>📍 <?= e($s['area']) ?>, <?= e($s['city']) ?></span>
                        <span>•</span>
                        <span>⭐ <?= $s['experience_years'] ?>+ Years Exp</span>
                    </div>

                    <p class="text-xs text-slate-600 leading-relaxed font-medium mb-4">
                        <?= e($s['about']) ?>
                    </p>

                    <div class="flex flex-wrap gap-1.5 mb-5">
                        <?php foreach ($s['skills'] as $tag): ?>
                            <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                                <?= e($tag) ?>
                            </span>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <a href="tel:<?= e($s['mobile']) ?>" class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5">
                        <i class="bi bi-telephone-fill text-slate-600"></i> Call
                    </a>
                    <a href="https://wa.me/92<?= substr($s['whatsapp'], 1) ?>?text=<?= urlencode("Assalam-o-Alaikum {$s['full_name']}! I saw your profile on SargodhaMart.") ?>" target="_blank" class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs">
                        <i class="bi bi-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
