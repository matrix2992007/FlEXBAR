/**
 * APEX MATRIX - Admin Runtime Launcher (AdminLauncher.js)
 * Architecture: ES Module Bootstrapper & Lifecycle Handler
 * Max Lines Limit: ~100 Lines (Ultra Clean & Lightweight)
 * Developers: Mark (Youssef) & Maro
 */

import { listenToEmergencyMode, syncPendingDeposits, syncPendingKyc } from './AdminCore.js';

/**
 * 🚀 دالة الإقلاع الفوري وتشغيل لوحة التحكم الجسر
 */
function bootstrapAdminBridge() {
    console.log("⚡ [MATRIX LAUNCHER] Bootstrapping Admin Bridge core modules...");

    try {
        // 1. تشغيل مستمع وضع الطوارئ اللحظي لربط الموقع بالزرار الأحمر
        listenToEmergencyMode();

        // 2. تفعيل المزامنة الحية لطلبات الإيداع والتمويل (VIP/Solo)
        syncPendingDeposits();

        // 3. تفعيل خط المزامنة لملفات الهوية والعناوين المعلقة (KYC)
        syncPendingKyc();

        console.log("🟢 [MATRIX LAUNCHER] All administration tunnels are live and synced with Firebase.");
    } catch (error) {
        console.error("❌ [BOOTSTRAP ERROR] Failed to ignite admin control lines:", error);
    }
}

// تشغيل المنظومة فور اكتمال تحميل شاشة الـ DOM لضمان عدم وجود أخطاء في العناصر
document.addEventListener('DOMContentLoaded', bootstrapAdminBridge);
