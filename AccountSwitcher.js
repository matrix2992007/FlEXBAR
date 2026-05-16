/**
 * FLEXBAR - Seamless Account Switcher Component (AccountSwitcher.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Interface Design: Inspired by Telegram & Binance Account Switchers
 * Developers: Mark (Youssef) & Maro
 */

// كاش محلي لإدارة الواجهة داخل الملف
const SWITCHER_CACHE = {
    containerElement: null,
    globalStateRef: null
};

/**
 * 1. رندر وبناء واجهة تبديل الحسابات (Render Switcher UI)
 * يتم حقنها في الجزء السفلي من السايدبار الخاص بستايل بايبت
 */
export function renderAccountSwitcher(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;
    
    SWITCHER_CACHE.containerElement = targetContainer;
    SWITCHER_CACHE.globalStateRef = globalState;

    // جلب الباقة الحالية للمستخدم لتحديد صلاحيات الحسابات
    const currentTier = globalState.premiumTier;
    const activeIndex = globalState.activeAccountIndex;

    // حساب عدد الحسابات المتاحة بناءً على نظام الباقات اللي حددته مع بحر
    let totalAllowedAccounts = 2; // الحساب الافتراضي المجاني يمنح حسابين
    if (currentTier === 'VIP1') totalAllowedAccounts = 5;
    if (currentTier === 'VIP2') totalAllowedAccounts = 10;
    if (currentTier === 'VIPMax') totalAllowedAccounts = 20; // باقة الحيتان

    let accountsHtml = '';

    // بناء قائمة الحسابات المتاحة للمستخدم ديناميكياً
    for (let i = 0; i < totalAllowedAccounts; i++) {
        const isCurrentActive = (i === activeIndex);
        const accountLabel = `حساب عمل ${i + 1}`;
        const badgeType = i < 2 ? 'مجاني' : `${currentTier}`;
        
        accountsHtml += `
            <div class="account-item ${isCurrentActive ? 'active-account' : ''}" data-index="${i}">
                <div class="account-avatar">
                    <i class="fas ${isCurrentActive ? 'fa-user-check' : 'fa-user'}"></i>
                </div>
                <div class="account-details">
                    <span class="account-name">${accountLabel}</span>
                    <span class="account-badge ${i < 2 ? 'badge-free' : 'badge-vip'}">${badgeType}</span>
                </div>
                ${isCurrentActive ? '<div class="active-dot"></div>' : ''}
            </div>
        `;
    }

    // القالب الرئيسي المدمج جوه السايدبار بستايل فخم ومريح للعين
    const switcherTemplate = `
        <div class="account-switcher-wrapper">
            <div class="switcher-header" id="trigger-switcher-pop">
                <div class="current-profile">
                    <i class="fas fa-wallet wallet-icon-mini"></i>
                    <span>التبديل بين الحسابات (${activeIndex + 1}/${totalAllowedAccounts})</span>
                </div>
                <i class="fas fa-chevron-up arrow-icon"></i>
            </div>
            <div class="switcher-dropdown hidden" id="accounts-dropdown-list">
                <div class="scrollable-accounts">
                    ${accountsHtml}
                </div>
                <div class="switcher-footer">
                    <button id="btn-upgrade-more"><i class="fas fa-bolt"></i> فتح المزيد من الحسابات</button>
                </div>
            </div>
        </div>
    `;

    targetContainer.innerHTML = switcherTemplate;

    // تفعيل الأحداث والنقرات (Event Listeners)
    setupSwitcherHandlers();
}

/**
 * 2. معالج أحداث القوائم والنقرات اللحظية (Event Handlers)
 */
function setupSwitcherHandlers() {
    const header = document.getElementById('trigger-switcher-pop');
    const dropdown = document.getElementById('accounts-dropdown-list');
    const arrow = header.querySelector('.arrow-icon');

    // فتح وغلق القائمة المنسدلة لأسفل (Pop-up Animation) شبه تليجرام
    header.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
    });

    // إغلاق القائمة لو العميل ضغط في أي مكان براها في الشاشة
    document.addEventListener('click', () => {
        if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
            arrow.classList.remove('rotate-180');
        }
    });

    // معالج التبديل الفوري عند الضغط على حساب معين
    const items = dropdown.querySelectorAll('.account-item');
    items.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const selectedIndex = parseInt(e.currentTarget.getAttribute('data-index'));
            
            // لو ضغط على الحساب النشط حالياً ميعملش حاجة
            if (selectedIndex === SWITCHER_CACHE.globalStateRef.activeAccountIndex) return;

            // تنفيذ التبديل السلس السحري
            await executeAccountSwitch(selectedIndex);
        });
    });

    // زرار الترقية السريع للباقات
    document.getElementById('btn-upgrade-more').addEventListener('click', (e) => {
        e.stopPropagation();
        // محاكاة الضغط على زرار المحفظة والخزنة ليرى العميل باقات الـ 110$ والـ 25$
        document.getElementById('menu-wallet').click();
    });
}

/**
 * 3. آلية التبديل السلس ونقل البيانات في الخلفية (Seamless Switch Engine)
 */
async function executeAccountSwitch(newIndex) {
    console.log(`🔄 [SWITCHER] Switching logic triggered from Account ${SWITCHER_CACHE.globalStateRef.activeAccountIndex + 1} to Account ${newIndex + 1}`);
    
    // شاشة تحميل مصغرة فوق الكارد لإعطاء شعور بالاحترافية والأمان اللحظي
    const dropdown = document.getElementById('accounts-dropdown-list');
    dropdown.innerHTML = `<div class="switcher-loading"><i class="fas fa-spinner fa-spin"></i> جاري المزامنة مع الوكالة...</div>`;

    try {
        // تحديث الحالة العالمية في ملف App.js
        SWITCHER_CACHE.globalStateRef.activeAccountIndex = newIndex;

        // كود مارو المستقبلي: جلب الداتا الخاصة بالحساب الجديد من قاعدة البيانات (الرصيد والتاسكات)
        // محاكاة سريعة لتحديث الـ Cache والبيانات المحلية
        const mockNewFlixBalance = Math.random() * 50; 
        SWITCHER_CACHE.globalStateRef.liveFlixBalance = mockNewFlixBalance;
        localStorage.setItem('flex_user_flix_bal', mockNewFlixBalance.toString());

        // إعادة رندر محرك التبديل لتحديث النقاط النشطة والشارات
        renderAccountSwitcher(SWITCHER_CACHE.containerElement, SWITCHER_CACHE.globalStateRef);

        // إعادة تشغيل صفحة لوحة التحكم (Dashboard) فوراً لعرض بيانات الحساب الجديد بالكامل
        const viewRoot = document.getElementById('viewport-root');
        if (viewRoot) {
            // استدعاء من ملف Dashboard لتحديث الأرقام والكامبينات دون ريفريش كامل للمتصفح
            const { renderDashboard } = await import('./Dashboard.js');
            renderDashboard(viewRoot, SWITCHER_CACHE.globalStateRef);
        }

        console.log(`✅ [SWITCHER] Switched successfully to Account ${newIndex + 1}. Live Stats Updated.`);

    } catch (error) {
        console.error("❌ [SWITCHER ERROR]:", error);
        window.location.reload(); // Fallback في حالة العطل
    }
}
