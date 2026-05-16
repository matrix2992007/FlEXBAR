/**
 * FLEXBAR - Core Engine & Orchestrator (App.js)
 * Architecture: Component-Driven Modular Architecture
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Developers: Mark (Youssef) & Maro
 */

// 1. استيراد المكونات الحيوية للمنصة (الـ 11 ملف الآخرين)
// ملاحظة لـ مارو: تأكد من صحة مسارات الملفات في الفولدرات عندك
import { initializeAuth, checkDeviceFingerprint } from './Auth.js';
import { renderAccountSwitcher, switchAccount } from './AccountSwitcher.js';
import { renderDashboard, updateLiveStats } from './Dashboard.js';
import { initWallet, updateBalances } from './WalletCore.js';
import { renderVault, startCountdown } from './FlexVault.js';
import { handleJointPool, updatePoolStatus } from './JointPool.js';
import { loadTasks, verifyTaskProgress } from './TaskCenter.js';
import { initSpinWheel, triggerSpin } from './SpinWheel.js';
import { renderFlexBoard, fetchLeaderboard } from './FlexBoard.js';
import { initKycUpload, submitKycToTelegram } from './KycUpload.js';

// 2. إدارة الحالة العالمية للمنصة (Global State Management)
const FLEXBAR_STATE = {
    currentUserId: null,
    activeAccountIndex: 0, // 0 = الحساب الأول، 1 = الحساب الثاني (المجانيين)
    isPremiumUser: false,
    premiumTier: 'Free', // Free, VIP1, VIP2, VIP3, VIPMax
    isEmergencyLocked: false,
    userWallets: [],
    referralCount: 0,
    liveFlixBalance: 0.0000
};

// 3. دالة بدء تشغيل المنظومة (Initialization)
export async function initFlexbarApp() {
    console.log("⚡ [FLEXBAR] Loading core engine...");
    
    try {
        // أ. فحص أمان الجهاز (Anti-Fraud & Device Fingerprinting)
        const isDeviceAllowed = await checkDeviceFingerprint();
        if (!isDeviceAllowed) {
            alert("⚠️ تنبيه أمني: تم الوصول للحد الأقصى من الحسابات المجانية لهذا الجهاز. يرجى الترقية لـ FLEX Premium.");
            // توجيه العميل لصفحة الدفع أو قفل الواجهة
            return;
        }

        // ب. ربط قاعدة البيانات ومراقبة وضع الطوارئ اللحظي (Emergency Watcher)
        listenToEmergencyStatus();

        // ج. تحضير الهوية وجلسة المستخدم (Session Setup)
        const userSession = await initializeAuth();
        if (userSession) {
            FLEXBAR_STATE.currentUserId = userSession.id;
            FLEXBAR_STATE.isPremiumUser = userSession.isPremium;
            FLEXBAR_STATE.premiumTier = userSession.tier;
            FLEXBAR_STATE.referralCount = userSession.referrals;
            FLEXBAR_STATE.liveFlixBalance = userSession.flixBalance;
            
            // د. تشغيل العداد اللحظي لزيادة عملة $FLIX في الخلفية
            startLiveRewardsEngine();
            
            // هـ. رندر الواجهة الرئيسية لبايبيت وبيت جيت
            renderAppShell();
        } else {
            console.log("👤 No active session found. Redirecting to Login Screen.");
            // كود إظهار شاشة الدخول (Auth UI)
        }

    } catch (error) {
        console.error("❌ [FLEXBAR CORE ERROR]:", error);
    }
}

// 4. مراقبة زرار الطوارئ (Emergency Lockdown Listener)
// مربوط مباشرة باللوحة الجسر (Admin System)
function listenToEmergencyStatus() {
    // محاكاة للربط بقاعدة البيانات المشتركة (Firebase/Supabase Realtime)
    // عند تفعيل الأدمن للزرار الأحمر، السيرفر يغير الحالة لـ true فوراً
    const dbEmergencyRef = false; // القيمة الحقيقية تأتي من السيرفر

    if (dbEmergencyRef === true) {
        triggerGlobalLockdown();
    }
}

// 5. تفعيل وضع الإغلاق الحديدي (Global Lockdown Trigger)
function triggerGlobalLockdown() {
    FLEXBAR_STATE.isEmergencyLocked = true;
    console.warn("🚨 [SECURITY ALERT] Emergency Lockdown Activated by Admin!");
    
    // إظهار شاشة الحظر الكامل المثبتة في الـ HTML الرئيسي
    const overlay = document.getElementById('emergency-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    
    // شل حركة أي عمليات سحب أو تداول أو نقرات في الـ Frontend
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);
}

// 6. محرك أرباح $FLIX اللحظي (Background Live Rewards Engine)
function startLiveRewardsEngine() {
    // زيادة تصاعدية رقمية بالثانية تظهر في المحفظة لعمل الـ Vibe والإدمان
    setInterval(() => {
        if (!FLEXBAR_STATE.isEmergencyLocked && FLEXBAR_STATE.currentUserId) {
            let multiplier = 1.0;
            if (FLEXBAR_STATE.premiumTier === 'VIP1') multiplier = 1.2;
            if (FLEXBAR_STATE.premiumTier === 'VIP2') multiplier = 1.5;
            if (FLEXBAR_STATE.premiumTier === 'VIPMax') multiplier = 2.0;

            FLEXBAR_STATE.liveFlixBalance += (0.0001 * multiplier);
            // تحديث الأرقام على الشاشة بدون عمل ريفريش
            updateLiveStats(FLEXBAR_STATE.liveFlixBalance);
        }
    }, 1000);
}

// 7. بناء الهيكل السلس وتبديل الحسابات (Render App Shell & Routing)
function renderAppShell() {
    const root = document.getElementById('app-root');
    if (!root) return;

    // تنظيف شاشة الـ Loading
    root.innerHTML = '';

    // بناء الواجهة الرئيسية (الهيدر، السايدبار بستايل بايبت، ومنطقة العرض الكبرى)
    const shellTemplate = `
        <div class="flexbar-container">
            <aside class="sidebar-bybit">
                <div class="brand-logo">FLEXBAR <span class="badge-flix">$FLIX</span></div>
                <nav class="nav-menu">
                    <button id="menu-dash" class="active"><i class="fas fa-chart-line"></i> لوحة التحكم</button>
                    <button id="menu-wallet"><i class="fas fa-wallet"></i> المحفظة والخزنة</button>
                    <button id="menu-tasks"><i class="fas fa-tasks"></i> مركز المهمات</button>
                    <button id="menu-spin"><i class="fas fa-circle-notch"></i> عجلة السحب</button>
                    <button id="menu-board"><i class="fas fa-trophy"></i> المتصدرين</button>
                    <button id="menu-kyc"><i class="fas fa-user-shield"></i> التوثيق القانوني</button>
                </nav>
                <div id="account-switcher-container"></div>
            </aside>
            <main class="main-content-viewport" id="viewport-root">
                </main>
        </div>
    `;

    root.innerHTML = shellTemplate;

    // تشغيل نظام التبديل بين الحسابين (Account Switcher) في الجانب السفلي
    renderAccountSwitcher(document.getElementById('account-switcher-container'), FLEXBAR_STATE);

    // تفعيل أزرار التنقل (Event Listeners)
    setupNavigationHandlers();

    // عرض اللوحة الرئيسية أولاً كشاشة افتراضية
    renderDashboard(document.getElementById('viewport-root'), FLEXBAR_STATE);
}

// 8. معالج أحداث التنقل الداخلي بدون ريفريش (Navigation Event Handlers)
function setupNavigationHandlers() {
    const viewRoot = document.getElementById('viewport-root');
    
    document.getElementById('menu-dash').addEventListener('click', (e) => {
        switchActiveTab(e.currentTarget);
        renderDashboard(viewRoot, FLEXBAR_STATE);
    });

    document.getElementById('menu-wallet').addEventListener('click', (e) => {
        switchActiveTab(e.currentTarget);
        initWallet(viewRoot, FLEXBAR_STATE);
        renderVault(viewRoot, FLEXBAR_STATE); // عرض المحفظة والخزنة معاً
    });

    document.getElementById('menu-tasks').addEventListener('click', (e) => {
        switchActiveTab(e.currentTarget);
        loadTasks(viewRoot, FLEXBAR_STATE);
    });

    document.getElementById('menu-spin').addEventListener('click', (e) => {
        switchActiveTab(e.currentTarget);
        initSpinWheel(viewRoot, FLEXBAR_STATE);
    });

    document.getElementById('menu-board').addEventListener('click', (e) => {
        switchActiveTab(e.currentTarget);
        renderFlexBoard(viewRoot, FLEXBAR_STATE);
    });

    document.getElementById('menu-kyc').addEventListener('click', (e) => {
        switchActiveTab(e.currentTarget);
        initKycUpload(viewRoot, FLEXBAR_STATE);
    });
}

function switchActiveTab(activeButton) {
    document.querySelectorAll('.nav-menu button').forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

// 9. تشغيل المايسترو تلقائياً بمجرد تحميل الصفحة بالكامل
window.addEventListener('DOMContentLoaded', () => {
    initFlexbarApp();
});
