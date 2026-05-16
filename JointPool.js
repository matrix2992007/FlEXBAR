/**
 * FLEXBAR - Joint Capital Pool Component (JointPool.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Feature: Shared 5-User VIP Pool (5 x $25 = $125 Capital)
 * Developers: Mark (Youssef) & Maro
 */

const POOL_CACHE = {
    parentContainerRef: null,
    globalStateRef: null,
    currentPoolSlotsFilled: 3 // افتراضي: 3 خانات مليانة ومتبقي 2 لعمل الـ FOMO والتنافس
};

/**
 * 1. رندر واجهة الباقة المشتركة (Render Joint Pool Card)
 * يتم حقنها ديناميكياً جوه لوحة الإيداع في ملف WalletCore.js
 */
export function handleJointPool() {
    // جلب مكان الحقن المخصص لها جوه كارت المحفظة
    const targetContainer = document.getElementById('joint-pool-trigger-card');
    if (!targetContainer) return;

    const slotsFilled = POOL_CACHE.currentPoolSlotsFilled;
    const totalSlots = 5;
    const progressPercentage = (slotsFilled / totalSlots) * 100;

    const poolTemplate = `
        <div class="deposit-card-option joint-pool-special-card">
            <div class="badge-card-pool">باقة شراكة نشطة 🔥</div>
            <h5>VIP Joint Micro (الباقة المشتركة)</h5>
            <p class="deposit-price">25$ <span class="currency">USDT</span></p>
            
            <div class="pool-progress-wrapper">
                <div class="pool-slots-text">
                    <span>حالة الغرفة الحالية:</span>
                    <strong>${slotsFilled} من ${totalSlots} تجار انضموا</strong>
                </div>
                <div class="progress-bar-total">
                    <div class="progress-bar-fill-neon" style="width: ${progressPercentage}%"></div>
                </div>
                <p class="pool-hint-alert">⚡ متبقي خانتين فقط! أول ما الـ 5 حسابات تكتمل، بيبدأ تجميد وتشغيل رأس المال فوراً في الكامبين.</p>
            </div>

            <ul class="card-features-list">
                <li><i class="fas fa-check"></i> تناسب المبتدئين بمبلغ تشغيل صغير جداً (25$).</li>
                <li><i class="fas fa-check"></i> نفس ميزات وعوائد الكامبينات بالتناسب.</li>
                <li><i class="fas fa-check"></i> سيستم أوتوماتيكي بالكامل يوزع الأرباح على الـ 5 حسابات بشكل منفصل.</li>
            </ul>

            <button class="btn-select-dep btn-pool-action" data-tier="Joint">انضم للغرفة واقفل باقتك</button>
        </div>
    `;

    targetContainer.innerHTML = poolTemplate;

    // تفعيل حدث الضغط الفوري للانضمام وتوليد المحفظة
    setupPoolHandlers();
}

/**
 * 2. معالج أحداث الباقة المشتركة والنقرات (Event Handlers)
 */
function setupPoolHandlers() {
    const poolBtn = document.querySelector('.btn-pool-action');
    if (!poolBtn) return;

    poolBtn.addEventListener('click', () => {
        // فتح شاشة توليد العنوان المشفر TRC20 الموجودة في ملف المحفظة
        const cryptoGen = document.getElementById('crypto-address-generator');
        if (cryptoGen) {
            cryptoGen.classList.remove('hidden');
            cryptoGen.scrollIntoView({ behavior: 'smooth' });
            console.log("🎮 [JOINT POOL] User selected to join the shared 5-trader pool. Gateway generated.");
        }
    });
}

/**
 * 3. تحديث الـ Pool لايف من قاعدة البيانات (Live Pool Sync Engine)
 * يتم استدعاؤها من السيرفر بمجرد قيام أي تاجر آخر بإيداع الـ 25$ لتحديث العداد قدام العميل فوراً
 */
export function updatePoolStatus(newSlotsFilledCount) {
    if (newSlotsFilledCount <= 5) {
        POOL_CACHE.currentPoolSlotsFilled = newSlotsFilledCount;
        // إعادة بناء الكارد فوراً بالأرقام الجديدة لإثارة حماس المستخدمين
        handleJointPool();
        console.log(`📡 [DB SYNC] Joint Pool Updated: ${newSlotsFilledCount}/5 slots are now occupied.`);
    }
}
