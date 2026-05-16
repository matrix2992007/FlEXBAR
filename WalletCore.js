/**
 * FLEXBAR - Core Wallet & Transaction Engine (WalletCore.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Interface Design: High-Security Binance/Bybit Wallet Style
 * Developers: Mark (Youssef) & Maro
 */

const WALLET_CACHE = {
    viewRootRef: null,
    globalStateRef: null
};

/**
 * 1. تهيئة ورندر واجهة المحفظة الداخلية (Initialize Wallet)
 */
export function initWallet(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;
    
    WALLET_CACHE.viewRootRef = targetContainer;
    WALLET_CACHE.globalStateRef = globalState;

    // حساب الأرصدة الافتراضية للحساب النشط
    const flixBalance = globalState.liveFlixBalance.toFixed(4);
    const usdtBalance = (globalState.liveFlixBalance * 0.15).toFixed(2); // رصيد الأرباح المتاح

    const walletTemplate = `
        <div class="wallet-wrapper animate-fade-in">
            
            <div class="wallet-balance-banner">
                <div class="banner-meta">
                    <span><i class="fas fa-shield-halved text-green"></i> محفظة FLEXBAR المؤمنة</span>
                    <h2>$${usdtBalance} <span class="unit">USDT</span></h2>
                    <p class="flix-sub-bal">${flixBalance} $FLIX (عملة المنصة الحية)</p>
                </div>
                <div class="wallet-actions-btns">
                    <button id="btn-deposit-main" class="btn-primary-action"><i class="fas fa-arrow-down-to-line"></i> إيداع كابيتال</button>
                    <button id="btn-withdraw-main" class="btn-secondary-action"><i class="fas fa-arrow-up-from-line"></i> سحب الأرباح</button>
                </div>
            </div>

            <div id="deposit-modal-zone" class="deposit-section-box hidden">
                <div class="section-header-mini">
                    <h4><i class="fas fa-wallet text-orange"></i> تفعيل رأس المال التشغيلي وتأمين الحسابات</h4>
                    <button id="close-deposit-zone" class="btn-close-xs">×</button>
                </div>
                
                <div class="deposit-grid-options">
                    <div class="deposit-card-option" data-amount="110">
                        <div class="badge-card-hot">موصى به</div>
                        <h5>VIP Solo (حساب فردي مباشر)</h5>
                        <p class="deposit-price">110$ <span class="currency">USDT</span></p>
                        <ul class="card-features-list">
                            <li><i class="fas fa-check"></i> تمويل حسابات Bybit الموثقة للكامبينات.</li>
                            <li><i class="fas fa-check"></i> دخول فوري للسحب الأسبوعي على الـ 50$.</li>
                            <li><i class="fas fa-check"></i> أرباح كاملة بدون عمولات شراكة.</li>
                        </ul>
                        <button class="btn-select-dep" data-tier="Solo">اختيار وتوليد عنوان الإيداع</button>
                    </div>

                    <div id="joint-pool-trigger-card">
                        </div>
                </div>

                <div id="crypto-address-generator" class="address-box-panel hidden">
                    <p class="network-alert">⚠️ يرجى الإرسال عبر شبكة <span class="text-orange">TRC20 (TRON)</span> فقط لتفادي ضياع الأموال.</p>
                    <div class="qr-placeholder">
                        <i class="fas fa-qrcode fa-4x"></i>
                    </div>
                    <div class="address-input-wrapper">
                        <input type="text" id="crypto-addr-input" value="TYu78XyzMaroMarkFlexbarSecureNetTRC20" readonly>
                        <button id="btn-copy-addr"><i class="fas fa-copy"></i> نسخ</button>
                    </div>
                    <div class="deposit-confirm-form">
                        <label>أدخل رقم الحوالة (TXID) لتأكيد الإيداع:</label>
                        <input type="text" id="txid-input" placeholder="أدخل الـ Hash هنا...">
                        <button id="btn-submit-txid">تأكيد الإرسال والمراجعة</button>
                    </div>
                </div>
            </div>

            <div class="tx-history-panel">
                <h4><i class="fas fa-history"></i> آخر العمليات والمزامنات</h4>
                <div class="tx-list-empty" id="tx-log-container">
                    <div class="empty-state-ui">
                        <i class="fas fa-receipt fa-2x text-muted"></i>
                        <p>لا توجد عمليات سحب أو إيداع معلقة حالياً على هذا الحساب.</p>
                    </div>
                </div>
            </div>

        </div>
    `;

    targetContainer.innerHTML = walletTemplate;

    // تشغيل أحداث الأزرار
    setupWalletHandlers();
}

/**
 * 2. معالج أحداث المحفظة والـ Click Events
 */
function setupWalletHandlers() {
    const depZone = document.getElementById('deposit-modal-zone');
    const cryptoGen = document.getElementById('crypto-address-generator');

    // إظهار لوحة الإيداع عند الضغط على الزرار الرئيسي
    document.getElementById('btn-deposit-main').addEventListener('click', () => {
        depZone.classList.remove('hidden');
        depZone.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('close-deposit-zone').addEventListener('click', () => {
        depZone.classList.add('hidden');
        cryptoGen.classList.add('hidden');
    });

    // معالج أزرار اختيار الباقة وتوليد العنوان
    document.querySelectorAll('.btn-select-dep').forEach(btn => {
        btn.addEventListener('click', (e) => {
            cryptoGen.classList.remove('hidden');
            cryptoGen.scrollIntoView({ behavior: 'smooth' });
            console.log(`🎯 [WALLET] Generated deposit address for tier: ${e.currentTarget.getAttribute('data-tier')}`);
        });
    });

    // زرار نسخ عنوان المحفظة
    document.getElementById('btn-copy-addr').addEventListener('click', () => {
        const addrInput = document.getElementById('crypto-addr-input');
        addrInput.select();
        document.execCommand('copy');
        alert("📋 تم نسخ عنوان محفظة FLEXBAR بنجاح!");
    });

    // زرار تأكيد الـ TXID وإرساله للأدمن الجسر
    document.getElementById('btn-submit-txid').addEventListener('click', () => {
        const txid = document.getElementById('txid-input').value;
        if (!txid || txid.length < 10) {
            alert("❌ يرجى إدخال رقم حوالة (TXID) صحيح لتتم المراجعة.");
            return;
        }
        
        alert("🚀 تم إرسال طلب الإيداع بنجاح! سيقوم يوسف وبحر بمراجعة الحوالة وتفعيل الحساب خلال دقائق.");
        document.getElementById('txid-input').value = '';
        depZone.classList.add('hidden');
    });

    // معالج زرار السحب ومنعه في حالة الطوارئ أو الحساب المجاني
    document.getElementById('btn-withdraw-main').addEventListener('click', () => {
        if (WALLET_CACHE.globalStateRef.isEmergencyLocked) {
            alert("🚨 النظام في وضع الإغلاق الطارئ حالياً، عمليات السحب مجمدة مؤقتاً لأمان أموالكم.");
            return;
        }
        if (WALLET_CACHE.globalStateRef.premiumTier === 'Free') {
            alert("⚠️ الحسابات المجانية تحتاج لتجميع حد أدنى 20$ من التاسكات أو الترقية لباقات الـ VIP لتفعيل السحب الفوري.");
            return;
        }
        alert("💰 جاري تحضير بوابة السحب اللحظية لمحفظتك الموثقة...");
    });
}
