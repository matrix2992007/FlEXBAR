/**
 * FLEXBAR - Authentication & Anti-Fraud Engine (Auth.js)
 * Architecture: Component-Driven Modular Architecture
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Security Specialist: Mark (Youssef) & Maro
 */

// إدارة الجلسة المحلية مؤقتاً في المتصفح
const AUTH_CACHE = {
    fingerprint: null,
    maxFreeAccounts: 2
};

/**
 * 1. فحص بصمة الجهاز ومنع تعدد الحسابات الوهمية (Anti-Fraud Device Fingerprinting)
 * التكتيك: بيجمع بيانات المتصفح، الشاشة، والـ WebGL لعمل ID فريد للجهاز لا يتغير بتغيير الإيميل
 */
export async function checkDeviceFingerprint() {
    console.log("🛡️ [SECURITY] Analyzing device fingerprint...");
    
    try {
        // جمع مواصفات هاردوير المتصفح والشاشة لعمل كود سري للجهاز
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "UnknownRenderer";
        
        const screenData = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
        const hardwareData = `${navigator.hardwareConcurrency || 4}x${navigator.deviceMemory || 4}`;
        const languageData = navigator.languages ? navigator.languages.join(',') : navigator.language;
        
        // دمج البيانات في سلسلة نصية واحدة (بصمة رقمية مخصصة للجهاز)
        const rawFingerprint = `${renderer}-${screenData}-${hardwareData}-${languageData}`;
        
        // تحويل البصمة لكود هاش مشفر (SHA-256) عشان الأمان والسرعة
        AUTH_CACHE.fingerprint = await hashFingerprint(rawFingerprint);
        console.log(`🔒 [SECURITY] Generated Device ID: ${AUTH_CACHE.fingerprint}`);

        // محاكاة الاستعلام من قاعدة البيانات (Firebase/Supabase)
        // بنشوف الجهاز ده سجل كام حساب قبل كده في الـ Database
        const registeredAccountsOnThisDevice = await getRegisteredAccountsCount(AUTH_CACHE.fingerprint);
        
        // جلب حالة المستخدم الحالية (لو أدمن أو بريميوم بنسمح له يتخطى الفحص)
        const isPremium = localStorage.getItem('flex_user_tier') !== 'Free' && localStorage.getItem('flex_user_tier') !== null;

        if (registeredAccountsOnThisDevice >= AUTH_CACHE.maxFreeAccounts && !isPremium) {
            // قفل حنفية البوتات.. الجهاز تخطى الحد المسموح وموش مشترك
            return false;
        }

        return true; // الجهاز سليم وتحت الحد المسموح
        
    } catch (error) {
        console.error("⚠️ [FINGERPRINT ERROR]:", error);
        return true; // Fallback في حالة حدوث خطأ غير متوقع حتى لا يتعطل المستخدم الحقيقي
    }
}

/**
 * 2. دالة تشفير البصمة الرقمية (Crypto Hash SHA-256)
 */
async function hashFingerprint(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 3. تهيئة الجلسة وفحص تسجيل الدخول (Initialize Auth Session)
 */
export async function initializeAuth() {
    console.log("👤 [AUTH] Checking user session...");
    
    // فحص لو العميل مسجل دخول قدام في المتصفح (Local Storage)
    const savedToken = localStorage.getItem('flex_auth_token');
    const savedUserId = localStorage.getItem('flex_user_id');
    
    if (savedToken && savedUserId) {
        // محاكاة جلب البيانات الحية للمستخدم من السيرفر
        return {
            id: savedUserId,
            name: localStorage.getItem('flex_user_name') || "FLEX Trader",
            isPremium: localStorage.getItem('flex_user_premium') === 'true',
            tier: localStorage.getItem('flex_user_tier') || 'Free',
            referrals: parseInt(localStorage.getItem('flex_user_referrals')) || 0,
            flixBalance: parseFloat(localStorage.getItem('flex_user_flix_bal')) || 0.0000
        };
    }
    
    return null; // لا توجد جلسة نشطة، يجب توجيهه لصفحة اللوجين
}

/**
 * 4. نظام تسجيل الدخول السريع عبر تليجرام وجوجل (Login Trigger)
 */
export async function loginUser(provider, credentials = {}) {
    console.log(`🔐 [AUTH] Attempting login via ${provider}...`);
    
    // هنا مارو سيربط الـ API بتاع Firebase Auth أو بوت التليجرام
    // بعد نجاح الدخول، بنخزن البيانات الأساسية للعميل في المتصفح
    const mockUser = {
        id: "usr_" + Math.random().toString(36).substr(2, 9),
        name: credentials.name || "يوسف بكير",
        isPremium: false,
        tier: "Free",
        referrals: 0,
        flixBalance: 0.0000
    };

    // حفظ الجلسة محلياً
    localStorage.setItem('flex_auth_token', 'mock_jwt_token_xyz');
    localStorage.setItem('flex_user_id', mockUser.id);
    localStorage.setItem('flex_user_name', mockUser.name);
    localStorage.setItem('flex_user_premium', mockUser.isPremium.toString());
    localStorage.setItem('flex_user_tier', mockUser.tier);
    localStorage.setItem('flex_user_referrals', mockUser.referrals.toString());
    localStorage.setItem('flex_user_flix_bal', mockUser.flixBalance.toString());

    // تسجيل الجهاز في قاعدة البيانات وتحديث العداد
    await registerDeviceInDB(AUTH_CACHE.fingerprint, mockUser.id);

    // إعادة تشغيل الموقع بالكامل بالبيانات الجديدة
    window.location.reload();
}

/**
 * 5. تسجيل الخروج (Logout)
 */
export function logoutUser() {
    localStorage.clear();
    window.location.reload();
}

// --- دالات مساعدة لمحاكاة قاعدة البيانات (قنوات الـ Mocking للـ Firebase لاحقاً) ---
async function getRegisteredAccountsCount(deviceHash) {
    // كود مارو المستقبلي: fetch(`YOUR_FIREBASE_URL/devices/${deviceHash}.json`)
    // حالياً بنفترض إن الجهاز مسجل حساب واحد بس عشان التجربة تشتغل معاك في الـ Localhost
    return 1; 
}

async function registerDeviceInDB(deviceHash, userId) {
    // كود مارو المستقبلي: ربط الـ ID الجديد بالبصمة في الـ Database
    console.log(`📡 [DB] Linked Device ${deviceHash} with User ${userId}`);
}
