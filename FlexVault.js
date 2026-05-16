/**
 * FLEXBAR - Capital Vault & Countdown Engine (FlexVault.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Developers: Mark (Youssef) & Maro
 */

const VAULT_CACHE = {
    containerRef: null,
    globalStateRef: null,
    countdownInterval: null
};

/**
 * 1. رندر واجهة الخزنة (Render Vault UI)
 * يتم عرضها بالتكامل مع ملف المحفظة الرئيسي
 */
export function renderVault(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;

    VAULT_CACHE.containerRef = targetContainer;
    VAULT_CACHE.globalStateRef = globalState;

    // فحص لو العميل مفعّل باقة أو لسه مجاني
    const isLockedCapital = globalState.premiumTier !== 'Free';
    
    // تحديد تاريخ افتراضي لانتهاء كامبين الوكالة (مثلاً بعد 14 يوم من الإيداع)
    const mockUnlockDate = new Date();
    mockUnlockDate.setDate(mockUnlockDate.getDate() + 14);

    // بناء الهيكل الفخم للخزنة بستايل بايبت للتجميد
    const vaultTemplate = `
        <div class="vault-container-box animate-fade-in">
            <div class="vault-header-row">
                <h4><i class="fas fa-vault text-yellow"></i> خزنة تجميد وتشغيل الكابيتال (FLEX Vault)</h4>
                <span class="vault-badge-status">${isLockedCapital ? '🟢 نشطة وتعد أرباح' : '⚪ خاملة - بانتظار الإيداع'}</span>
            </div>

            ${isLockedCapital ? `
                <div class="vault-active-panel">
                    <div class="vault-meta-grid">
                        <div class="v-meta-item">
                            <span class="v-label">الكابيتال المجمد حالياً</span>
                            <h4 class="v-value text-green">${globalState.premiumTier === 'VIP1' ? '25$' : '110$'} USDT</h4>
                        </div>
                        <div class="v-meta-item">
                            <span class="v-label">معدل العائد اليومي للوكالة</span>
                            <h4 class="v-value text-orange">+2.5%</h4>
                        </div>
                    </div>

                    <div class="vault-countdown-wrapper">
                        <span class="countdown-title"><i class="fas fa-clock"></i> متبقي على فك تجميد الكابيتال وسحب الأرباح كاملة:</span>
                        <div id="vault-timer-digits" class="timer-digits-row">
                            <div class="time-block"><span id="days-val">14</span><label>يوم</label></div>
                            <div class="time-block"><span id="hours-val">23</span><label>ساعة</label></div>
                            <div class="time-block"><span id="mins-val">59</span><label>دقيقة</label></div>
                            <div class="time-block"><span id="secs-val">59</span><label>ثانية</label></div>
                        </div>
                    </div>
                </div>
            ` : `
                <div class="vault-empty-panel">
                    <i class="fas fa-lock-open fa-3x text-muted"></i>
                    <h5>خزنتك فارغة حالياً!</h5>
                    <p>قم بعمل إيداع بقيمة 110$ كحساب فردي أو 25$ في الباقة المشتركة لتشغيل الخزنة الحديدية وبدء جني الأرباح التلقائية من توثيقات بايبت.</p>
                    <button id="btn-jump-to-deposit" class="btn-vault-action"><i class="fas fa-bolt"></i> تفعيل الخزنة الآن</button>
                </div>
            `}
        </div>
    `;

    // دمج الخزنة أسفل المحفظة في نفس شاشة العرض
    const oldHtml = targetContainer.innerHTML;
    targetContainer.innerHTML = oldHtml + vaultTemplate;

    // تشغيل العداد التنازلي بالثواني لو الخزنة نشطة
    if (isLockedCapital) {
        startCountdown(mockUnlockDate);
    } else {
        setupVaultHandlers();
    }
}

/**
 * 2. تشغيل محرك العداد التنازلي الحي (Countdown Engine)
 */
export function startCountdown(targetDate) {
    if (VAULT_CACHE.countdownInterval) clearInterval(VAULT_CACHE.countdownInterval);

    VAULT_CACHE.countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        // حساب الأيام والساعات والدقائق والثواني
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // جلب العناصر من الشاشة وتحديثها بالثانية
        const dEl = document.getElementById('days-val');
        const hEl = document.getElementById('hours-val');
        const mEl = document.getElementById('mins-val');
        const sEl = document.getElementById('secs-val');

        if (dEl && hEl && mEl && sEl) {
            dEl.innerText = days.toString().padStart(2, '0');
            hEl.innerText = hours.toString().padStart(2, '0');
            mEl.innerText = minutes.toString().padStart(2, '0');
            sEl.innerText = seconds.toString().padStart(2, '0');
        }

        // لو الوقت خلص
        if (distance < 0) {
            clearInterval(VAULT_CACHE.countdownInterval);
            const timerZone = document.getElementById('vault-timer-digits');
            if (timerZone) {
                timerZone.innerHTML = `<span class="vault-unlocked-msg">🔓 تم فك التجميد بنجاح! الأرباح والكابيتال متاحة للسحب الفوري.</span>`;
            }
        }
    }, 1000);
}

/**
 * 3. معالج أحداث الخزنة الفاضية
 */
function setupVaultHandlers() {
    const jumpBtn = document.getElementById('btn-jump-to-deposit');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
            const depZone = document.getElementById('deposit-modal-zone');
            if (depZone) {
                depZone.classList.remove('hidden');
                depZone.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}
