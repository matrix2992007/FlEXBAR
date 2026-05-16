/**
 * FLEXBAR - Live Dashboard Component (Dashboard.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Interface Design: Bybit Smoothness + Bitget Premium Dark Theme (#0b0e11)
 * Developers: Mark (Youssef) & Maro
 */

// كاش محلي لتحديث الأرقام اللحظية بدون إعادة بناء الصفحة
const DASH_CACHE = {
    flixValueElement: null,
    usdtValueElement: null,
    globalStateRef: null
};

/**
 * 1. بناء ورندر لوحة التحكم الرئيسية (Render Dashboard)
 */
export function renderDashboard(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;

    DASH_CACHE.globalStateRef = globalState;

    // حساب الأرقام بناءً على الحساب النشط حالياً
    const activeAccNum = globalState.activeAccountIndex + 1;
    const flixBal = globalState.liveFlixBalance.toFixed(4);
    
    // حساب القيمة التقريبية بالـ USDT (مثلاً نفترض سعر تخميني للعملة $0.15)
    const usdtEquivalent = (globalState.liveFlixBalance * 0.15).toFixed(2);

    const dashboardTemplate = `
        <div class="dashboard-wrapper animate-fade-in">
            
            <header class="dash-header">
                <div class="welcome-box">
                    <h2>لوحة التحكم الرئيسية <span class="acc-indicator">(الحساب النشط: #${activeAccNum})</span></h2>
                    <p class="text-muted">مرحباً بك في نظام FLEXBAR الموحد لإدارة الكامبينات.</p>
                </div>
                <div class="tier-status-card ${globalState.isPremiumUser ? 'status-premium' : 'status-free'}">
                    <i class="fas ${globalState.isPremiumUser ? 'fa-crown' : 'fa-user'}"></i>
                    <span>نظام الحساب: ${globalState.premiumTier}</span>
                </div>
            </header>

            <section class="stats-grid">
                
                <div class="stat-card flix-mining-card">
                    <div class="card-icon"><i class="fas fa-cubes-stacked"></i></div>
                    <div class="card-info">
                        <span class="card-label">رصيد $FLIX التراكمي (بالثانية ⚡)</span>
                        <h3 id="live-flix-display" class="vibe-text">${flixBal}</h3>
                    </div>
                </div>

                <div class="stat-card usdt-card">
                    <div class="card-icon"><i class="fas fa-dollar-sign"></i></div>
                    <div class="card-info">
                        <span class="card-label">القيمة التقديرية بالمحفظة</span>
                        <h3 id="live-usdt-display">$${usdtEquivalent} <span class="currency-tag">USDT</span></h3>
                    </div>
                </div>

                <div class="stat-card ref-card">
                    <div class="card-icon"><i class="fas fa-users"></i></div>
                    <div class="card-info">
                        <span class="card-label">إحالات الإيداع المكتملة</span>
                        <h3>${globalState.referralCount} <span class="ref-max">/ 20</span></h3>
                    </div>
                    <div class="progress-bar-mini">
                        <div class="progress-fill" style="width: ${Math.min((globalState.referralCount / 20) * 100, 100)}%"></div>
                    </div>
                </div>

            </section>

            <section class="dashboard-lower-section">
                
                <div class="campaigns-box">
                    <div class="section-title-wrapper">
                        <h4><i class="fas fa-fire text-orange"></i> كامبينات الوكالة النشطة (Bybit Verified)</h4>
                        <span class="live-pulse-dot">● مباشر</span>
                    </div>
                    <div class="campaign-list">
                        <div class="campaign-item">
                            <div class="comp-meta">
                                <h5>Bybit Launchpool X</h5>
                                <p>الحد الأدنى للمشاركة: فتح حساب وتوثيق KYC1</p>
                            </div>
                            <span class="comp-reward">+35% عائد</span>
                        </div>
                        <div class="campaign-item">
                            <div class="comp-meta">
                                <h5>Bitget MegaDrop Smart</h5>
                                <p>مهام السوشيال ميديا وربط المحفظة</p>
                            </div>
                            <span class="comp-reward">+15$ فوري</span>
                        </div>
                    </div>
                </div>

                <div class="security-tips-box">
                    <h4><i class="fas fa-shield-halved text-green"></i> حماية الجلسة والـ Anti-Ban</h4>
                    <ul class="tips-list">
                        <li><i class="fas fa-check-circle"></i> تم تأمين هذا الحساب ببصمة جهاز فريدة ومحمية.</li>
                        <li><i class="fas fa-check-circle"></i> يتم تدوير الـ Residential Proxies تلقائياً لمنع الحظر.</li>
                        <li><i class="fas fa-exclamation-circle text-orange"></i> لا تقم بفتح نفس الحساب من جهازين مختلفين في نفس الوقت.</li>
                    </ul>
                </div>

            </section>

        </div>
    `;

    targetContainer.innerHTML = dashboardTemplate;

    // تثبيت العناصر في الكاش المحلي لتسريع التحديث اللحظي بدون ريندر كامل
    DASH_CACHE.flixValueElement = document.getElementById('live-flix-display');
    DASH_CACHE.usdtValueElement = document.getElementById('live-usdt-display');
}

/**
 * 2. التحديث اللحظي للأرقام (Live Update Engine)
 * يتم استدعاؤها كل ثانية بواسطة ملف App.js لزيادة الأرقام بنعومة صايعة
 */
export function updateLiveStats(newFlixBalance) {
    if (DASH_CACHE.flixValueElement && DASH_CACHE.usdtValueElement) {
        // تحديث رصيد الفليكس بالثانية
        DASH_CACHE.flixValueElement.innerText = newFlixBalance.toFixed(4);
        
        // تحديث القيمة المقابلة بالدولار تلقائياً
        const newUsdt = (newFlixBalance * 0.15).toFixed(2);
        DASH_CACHE.usdtValueElement.innerHTML = `$${newUsdt} <span class="currency-tag">USDT</span>`;
    }
}
