<?php
/**
 * Global Footer Component - SARGODHAMART
 * Mobile-First Modern Design Matching AI Studio Preview
 * Universal Bottom Bar: 8-Item Touch Navigation (Market, Food, Jobs, Skills, Freight, Add, Dashboard, Admin) · AI Assistant · PWA Banner · Admin Portal
 */

$footerSiteName = getSetting('website_name', SITE_NAME);
$footerSiteTagline = getSetting('tagline', SITE_TAGLINE);
$footerActivationFee = getSetting('activation_fee', ONE_TIME_ACTIVATION_FEE);
$footerPayAccount = getSetting('payment_account_title', 'Muhammad Akram Tayyab');
$footerPayNumber = getSetting('official_whatsapp', '03098557159');
$footerCopyright = getSetting('copyright_text', '© ' . date('Y') . ' ' . $footerSiteName . '. Your City. Your Marketplace.');
$footerSocials = getSocialLinksPHP();
$currentUri = $_SERVER['REQUEST_URI'] ?? '/';
?>
</main>

<!-- Modern 4-Column Footer -->
<footer class="bg-white border-t border-cyan-100 py-10 px-4 text-xs text-slate-600 shadow-sm mt-auto">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- 1. About Brand & Admin Login -->
        <div>
            <div class="text-lg font-black text-slate-950 mb-2 flex items-center gap-1">
                SARGODHA<span class="text-cyan-700">MART</span>
            </div>
            <p class="text-slate-500 text-xs mb-3 font-medium">
                <?= e($footerSiteTagline) ?>. The trusted local buy &amp; sell platform dedicated to Sargodha, Shaheenabad, and Sillanwali. Direct WhatsApp dealing with verified local sellers.
            </p>
            <div class="text-slate-700 text-[11px] font-semibold mb-3">
                One-Time Lifetime Seller Activation: <strong class="text-cyan-800 font-bold">Rs. <?= number_format($footerActivationFee) ?></strong>
            </div>

            <!-- Admin Portal Access in About Section -->
            <div class="pt-2 border-t border-slate-100">
                <a href="/admin/login.php" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-sm transition-all text-decoration-none">
                    <i class="bi bi-shield-lock text-cyan-400"></i>
                    <span>Admin Login / Portal</span>
                </a>
            </div>
        </div>

        <!-- 2. Local Hubs -->
        <div>
            <h4 class="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Local Hubs</h4>
            <ul class="space-y-1.5 text-slate-600 font-medium list-none p-0 m-0">
                <li><a href="/search.php?city=Sargodha" class="text-slate-600 hover:text-cyan-700 text-decoration-none">Sargodha City</a></li>
                <li><a href="/search.php?city=Shaheenabad" class="text-slate-600 hover:text-cyan-700 text-decoration-none">Shaheenabad Mandi</a></li>
                <li><a href="/search.php?city=Sillanwali" class="text-slate-600 hover:text-cyan-700 text-decoration-none">Sillanwali Citrus Belt</a></li>
                <li><a href="/search.php?featured=1" class="text-amber-700 font-bold text-decoration-none">⭐ Featured Ads</a></li>
                <li><a href="/categories.php" class="text-slate-600 hover:text-cyan-700 text-decoration-none">All Categories</a></li>
            </ul>
        </div>

        <!-- 3. Community & Trust -->
        <div>
            <h4 class="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Community &amp; Trust</h4>
            <ul class="space-y-1.5 text-slate-600 font-medium list-none p-0 m-0">
                <li>
                    <a href="https://whatsapp.com/channel/0029Vb4qJ5s890123" target="_blank" rel="noreferrer" class="text-emerald-700 font-bold hover:underline text-decoration-none flex items-center gap-1">
                        <span>📲</span> Official WhatsApp Channel
                    </a>
                </li>
                <li>
                    <a href="tel:03098557159" class="text-slate-700 font-semibold hover:text-slate-950 text-decoration-none">
                        Support: 0309 8557159
                    </a>
                </li>
                <li>Account Title: <strong><?= e($footerPayAccount) ?></strong></li>
                <li class="text-slate-400 text-[11px]">Trust Plaza, Club Road / University Road, Sargodha</li>
            </ul>
        </div>

        <!-- 4. Social Channels & Safety -->
        <div>
            <h4 class="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Social Media Channels</h4>
            <div class="flex flex-wrap gap-2 mb-3">
                <a href="https://wa.me/923098557159" target="_blank" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-all flex items-center gap-1 text-decoration-none">
                    <i class="bi bi-whatsapp"></i> WhatsApp
                </a>
                <a href="/contact.php" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center gap-1 text-decoration-none">
                    <i class="bi bi-headset"></i> Helpline
                </a>
                <a href="/about.php" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200 transition-all flex items-center gap-1 text-decoration-none">
                    <i class="bi bi-info-circle"></i> About
                </a>
            </div>
            <p class="text-[11px] text-slate-400 font-medium">
                Verified local updates &amp; community trading notices.
            </p>
        </div>
    </div>

    <!-- Bottom Quick Links & Akraam TechForge Branding -->
    <div class="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-medium">
        <div><?= e($footerCopyright) ?></div>
        <div class="flex flex-wrap gap-3 items-center">
            <a href="/index.php" class="hover:text-slate-900 text-slate-600 text-decoration-none">Marketplace</a>
            <a href="/food.php" class="hover:text-slate-900 text-slate-600 text-decoration-none">Food Deals</a>
            <a href="/jobs.php" class="hover:text-slate-900 text-slate-600 text-decoration-none">Jobs</a>
            <a href="/skills.php" class="hover:text-slate-900 text-slate-600 text-decoration-none">Skills</a>
            <a href="/transport.php" class="hover:text-slate-900 text-slate-600 text-decoration-none">Freight</a>
            <a href="/colleges.php" class="text-indigo-700 font-bold text-decoration-none">Colleges &amp; Admissions</a>
            <a href="/admin/login.php" class="hover:text-slate-900 font-bold text-slate-700 text-decoration-none">Admin Portal</a>
        </div>
    </div>

    <!-- AKRAAM TECHFORGE BRANDING -->
    <div class="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-center md:text-left space-y-0.5">
            <div class="text-xs font-black uppercase tracking-wider text-slate-900">
                SARGODHA MARKETPLACE — Your City. Your Marketplace.
            </div>
            <div class="text-[11px] text-slate-500 font-medium">
                DESIGNED &amp; DEVELOPED BY <strong class="text-cyan-700 font-extrabold">AKRAAM TECHFORGE</strong> (Ideas • Code • Future)
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <div class="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5">
                <i class="bi bi-headset text-cyan-600"></i>
                <span>Admin Support: <strong class="text-slate-900 font-bold">0309 8557159</strong></span>
            </div>
            <a href="tel:03098557159" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-decoration-none">
                Call
            </a>
            <a href="https://wa.me/923098557159" target="_blank" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-decoration-none">
                WhatsApp
            </a>
        </div>
    </div>
</footer>

<!-- ======================================================== -->
<!-- 2. STICKY MOBILE-FIRST BOTTOM NAVIGATION                 -->
<!-- Exactly matching requirements:                           -->
<!-- Market, Food, Jobs, Skills, Freight, Add, Dashboard, Admin -->
<!-- ======================================================== -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-1 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
    <div class="grid grid-cols-8 gap-0.5 text-center text-[10px] font-bold">
        <!-- 1. Market -->
        <a href="/index.php" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= ($currentUri === '/' || $currentUri === '/index.php') ? 'text-cyan-700 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-shop text-lg leading-none mb-0.5"></i>
            <span class="truncate">Market</span>
        </a>

        <!-- 2. Food -->
        <a href="/food.php" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= str_contains($currentUri, 'food') ? 'text-amber-700 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-cup-hot text-amber-500 text-lg leading-none mb-0.5"></i>
            <span class="truncate">Food</span>
        </a>

        <!-- 3. Jobs -->
        <a href="/jobs.php" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= str_contains($currentUri, 'jobs') ? 'text-blue-700 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-briefcase text-blue-600 text-lg leading-none mb-0.5"></i>
            <span class="truncate">Jobs</span>
        </a>

        <!-- 4. Skills -->
        <a href="/skills.php" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= str_contains($currentUri, 'skills') ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-stars text-emerald-600 text-lg leading-none mb-0.5"></i>
            <span class="truncate">Skills</span>
        </a>

        <!-- 5. Freight -->
        <a href="/transport.php" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= str_contains($currentUri, 'transport') || str_contains($currentUri, 'freight') ? 'text-amber-800 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-truck text-amber-600 text-lg leading-none mb-0.5"></i>
            <span class="truncate">Freight</span>
        </a>

        <!-- 6. Add (+) -->
        <a href="/post-ad.php" class="flex flex-col items-center justify-center py-1 text-white text-decoration-none">
            <div class="w-10 h-10 -mt-6 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <i class="bi bi-plus-lg text-lg text-white font-black"></i>
            </div>
            <span class="text-cyan-700 font-black mt-0.5">Add</span>
        </a>

        <!-- 7. Dashboard -->
        <a href="<?= isLoggedIn() ? '/user/dashboard.php' : '/login.php' ?>" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= str_contains($currentUri, 'user') || str_contains($currentUri, 'dashboard') ? 'text-fuchsia-700 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-speedometer2 text-fuchsia-600 text-lg leading-none mb-0.5"></i>
            <span class="truncate">Dashboard</span>
        </a>

        <!-- 8. Admin -->
        <a href="/admin/login.php" class="flex flex-col items-center justify-center py-1 text-decoration-none <?= str_contains($currentUri, 'admin') ? 'text-rose-700 font-black' : 'text-slate-500 hover:text-slate-800' ?>">
            <i class="bi bi-shield-lock text-slate-700 text-lg leading-none mb-0.5"></i>
            <span class="truncate">Admin</span>
        </a>
    </div>
</nav>

<!-- ======================================================== -->
<!-- 3. FLOATING AI ASSISTANT HELP BUTTON                     -->
<!-- ======================================================== -->
<div id="aiHelpWidget" class="fixed bottom-16 md:bottom-6 right-4 z-40">
    <button onclick="toggleAiModal()" class="px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xl border border-slate-700 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer">
        <span class="w-6 h-6 rounded-xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-xs">
            🤖
        </span>
        <span class="hidden sm:inline">Ask SargodhaMart</span>
        <span class="sm:hidden">AI Help</span>
    </button>
</div>

<!-- AI Help Interactive Modal -->
<div id="aiModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
    <div class="relative w-full max-w-md bg-white border border-cyan-200 rounded-3xl p-6 shadow-2xl">
        <button onclick="toggleAiModal()" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl">
            <i class="bi bi-x-lg"></i>
        </button>
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center text-xl">
                🤖
            </div>
            <div>
                <h3 class="font-black text-slate-900 text-sm">SargodhaMart AI Assistant</h3>
                <p class="text-[11px] text-slate-500">Ask about prices, cattle wanda, Honda 125, or seller verification.</p>
            </div>
        </div>

        <div id="aiChatBox" class="h-56 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 mb-3">
            <div class="bg-cyan-50 p-2.5 rounded-xl border border-cyan-200 text-cyan-900 text-[11px]">
                <strong>Assalam-o-Alaikum!</strong> Welcome to SargodhaMart. You can ask me about current market prices for Kinnow citrus, dairy cows in Shaheenabad, mobile phones at Trust Plaza, or how to activate your lifetime seller account.
            </div>
        </div>

        <div class="flex items-center gap-2">
            <input id="aiInput" type="text" placeholder="Type your question..." class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-500" onkeydown="if(event.key==='Enter') sendAiMsg()">
            <button onclick="sendAiMsg()" class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold">
                Send
            </button>
        </div>
    </div>
</div>

<script>
function toggleAiModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.toggle('hidden');
}

function sendAiMsg() {
    const input = document.getElementById('aiInput');
    const box = document.getElementById('aiChatBox');
    const msg = input.value.trim();
    if (!msg) return;

    box.innerHTML += `<div class="bg-white p-2 rounded-xl border border-slate-200 text-right text-slate-800 text-[11px] ml-6 font-medium">${msg}</div>`;
    input.value = '';

    setTimeout(() => {
        let reply = "Thank you for asking! For direct inquiries in Sargodha, Shaheenabad or Sillanwali, you can contact admin support directly on WhatsApp at 0309 8557159 or browse our verified categories.";
        if (msg.toLowerCase().includes('cow') || msg.toLowerCase().includes('cattle') || msg.toLowerCase().includes('गाय')) {
            reply = "Pure Sahiwal and Nili Ravi dairy cattle are traded daily in the Shaheenabad Mandi belt. Check our Animals / Livestock category for verified sellers with daily milk yield proofs.";
        } else if (msg.toLowerCase().includes('kinnow') || msg.toLowerCase().includes('citrus')) {
            reply = "Export quality Sargodha fresh Kinnow orchards are primarily centered in Sillanwali and Bhalwal. Check our Agriculture category for wholesale crate deals.";
        } else if (msg.toLowerCase().includes('activation') || msg.toLowerCase().includes('fee') || msg.toLowerCase().includes('fees')) {
            reply = "Seller activation is a one-time fee of Rs. 1,000 sent to official JazzCash / EasyPaisa 03098557159. Once approved, you can post unlimited normal ads for life!";
        }
        box.innerHTML += `<div class="bg-cyan-50 p-2.5 rounded-xl border border-cyan-200 text-cyan-950 text-[11px] mr-6"><strong>SargodhaMart AI:</strong> ${reply}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 400);
}
</script>

<!-- Mobile PWA Install Prompt Banner -->
<div id="pwaBanner" class="md:hidden fixed bottom-14 left-2 right-2 z-30 bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-slate-700">
    <div class="flex items-center gap-2 min-w-0">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center font-black text-sm shrink-0">
            S
        </div>
        <div class="min-w-0">
            <div class="text-xs font-black truncate">Install SargodhaMart</div>
            <div class="text-[10px] text-slate-300 truncate">Fast, offline &amp; instant local deals</div>
        </div>
    </div>
    <div class="flex items-center gap-1.5 shrink-0">
        <button onclick="document.getElementById('pwaBanner').remove()" class="p-1 text-slate-400 hover:text-white">
            <i class="bi bi-x"></i>
        </button>
        <button onclick="alert('To install SargodhaMart: tap Chrome menu (⋮) and select \'Add to Home screen\'.'); document.getElementById('pwaBanner').remove();" class="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black">
            Install
        </button>
    </div>
</div>

</body>
</html>
