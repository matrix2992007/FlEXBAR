/**
 * FLEXBAR - Fortune Spin Wheel Component (SpinWheel.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Feature: 20-Deposit Referrals Unlocks $50 Prize Spin
 * Developers: Mark (Youssef) & Maro
 */

const SPIN_CACHE = {
    viewRootRef: null,
    globalStateRef: null,
    isSpinning: false,
    requiredReferrals: 20 // الشرط الأساسي لفتح العجلة
};

/**
 * 1. رندر وبناء واجهة عجلة الحظ (Render Spin Wheel UI)
 */
export function initSpinWheel(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;

    SPIN_CACHE.viewRootRef = targetContainer;
    SPIN_CACHE.globalStateRef = globalState;

    const currentRefs = globalState.referralCount;
    const isUnlocked = currentRefs >= SPIN_CACHE.requiredReferrals;
    const progressPercent = Math.min((currentRefs / SPIN_CACHE.requiredReferrals) * 100, 100);

    const spinTemplate = `
        <div class="spin-wheel-wrapper animate-fade-in">
            
            <header class="spin-header-panel">
                <h4><i class="fas fa-circle-notch text-yellow"></i> عجلة الحظ الكبرى والـ Flex Pool</h4>
                <p>قم بدعوة 20 تاجراً لتفعيل إيداعات باقات الـ VIP لتفتح لك العجلة تلقائياً والمنافسة على جائزة <span class="text-green font-bold">50$ USDT</span> كاش فوري.</p>
                
                <div class="spin-progress-container">
                    <div class="progress-labels">
                        <span>عداد إحالات الإيداع الحالية:</span>
                        <strong>${currentRefs} / ${SPIN_CACHE.requiredReferrals}</strong>
                    </div>
                    <div class="progress-bar-total">
                        <div class="progress-bar-fill-neon" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </header>

            <section class="wheel-graphic-zone">
                <div class="wheel-outer-ring">
                    <div class="wheel-pointer"><i class="fas fa-caret-down"></i></div>
                    <div class="wheel-body" id="main-wheel-element">
                        <div class="wheel-sector sector-1" style="--rc: 0;"><span class="s-txt">Try Again</span></div>
                        <div class="wheel-sector sector-2" style="--rc: 1;"><span class="s-txt">2$ FLIX</span></div>
                        <div class="wheel-sector sector-3" style="--rc: 2;"><span class="s-txt">5$ USDT</span></div>
                        <div class="wheel-sector sector-4" style="--rc: 3;"><span class="s-txt">Try Again</span></div>
                        <div class="wheel-sector sector-5" style="--rc: 4;"><span class="s-txt">10$ FLIX</span></div>
                        <div class="wheel-sector sector-6" style="--rc: 5;"><span class="s-txt" style="color: #ffb100; font-weight:900;">👑 50$ 👑</span></div>
                    </div>
                </div>

                <div class="wheel-action-trigger">
                    <button id="btn-trigger-spin" class="btn-spin-core ${isUnlocked ? 'spin-unlocked' : 'spin-locked'}" ${isUnlocked ? '' : 'disabled'}>
                        ${isUnlocked ? '<i class="fas fa-play"></i> اضغط للتدوير الكببير!' : `<i class="fas fa-lock"></i> متبقي ${SPIN_CACHE.requiredReferrals - currentRefs} إحالة لفتح القفل`}
                    </button>
                </div>
            </section>

        </div>
    `;

    targetContainer.innerHTML = spinTemplate;

    // تفعيل حدث تدوير العجلة لو الشرط مكتمل
    if (isUnlocked) {
        setupSpinHandler();
    }
}

/**
 * 2. معالج حدث التدوير وحساب النتيجة (Spin Animation Handler)
 */
function setupSpinHandler() {
    const spinBtn = document.getElementById('btn-trigger-spin');
    const wheel = document.getElementById('main-wheel-element');

    if (!spinBtn || !wheel) return;

    spinBtn.addEventListener('click', () => {
        if (SPIN_CACHE.isSpinning) return; // منع النقرات المتكررة أثناء الدوران

        SPIN_CACHE.isSpinning = true;
        spinBtn.disabled = true;
        console.log("🎡 [SPIN ENGINE] Verification passed. Wheel rotation initiated...");

        // توليد زاوية دوران عشوائية كبيرة (مثلاً بين 5 إلى 10 لفات كاملة + زاوية الجائزة)
        const extraDegrees = Math.floor(Math.random() * 360);
        const totalRotation = 2880 + extraDegrees; // 2880 تعني 8 لفات كاملة لعمل الـ Hype

        // تشغيل إنيميشن الدوران السلس عبر الـ CSS
        wheel.style.transition = "transform 4s cubic-bezier(0.1, 0.8, 0.3, 1)";
        wheel.style.transform = `rotate(${totalRotation}deg)`;

        // معالجة النتيجة بعد انتهاء الـ 4 ثواني بتوع الإنيميشن
        setTimeout(() => {
            executeSpinRewardCalculation(extraDegrees, wheel, spinBtn);
        }, 4000);
    });
}

/**
 * 3. حساب الجائزة وتوزيع الأرباح حياً (Reward Calculation Core)
 */
function executeSpinRewardCalculation(finalDegrees, wheelElement, buttonElement) {
    SPIN_CACHE.isSpinning = false;
    
    // تحديد القطاع اللي المؤشر وقف عنده (كل قطاع 60 درجة لأنهم 6 قطاعات)
    const sectorNormalized = Math.floor(((finalDegrees % 360) / 60));
    console.log(`🎯 [SPIN CORE] Wheel stopped at sector index: ${sectorNormalized}`);

    let alertMessage = "";
    
    // توزيع الجوائز السيكولوجي
    switch (sectorNormalized) {
        case 5: // قطاع الـ 50 دولار الجائزة الكبرى
            alertMessage = "🏆 يا ربااااه! لقد فزت بالجائزة الكبرى للمنصة 50$ USDT كاش! سيتم تحويلها لمحفظتك بعد مراجعة يوسف وبحر فوري.";
            // كود مارو المستقبلي: إرسال أمر إشعار عاجل للأدمن الجسر والجروب السري لتأكيد الجائزة
            break;
        case 1:
        case 4:
            const flixPrize = sectorNormalized === 1 ? 2.0 : 10.0;
            alertMessage = `🎉 م
