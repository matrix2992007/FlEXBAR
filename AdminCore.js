/**
 * APEX MATRIX - Admin Core Engine (AdminCore.js)
 * Architecture: Firebase Realtime Live Controller
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Developers: Mark (Youssef) & Maro
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-database.js";

// 1. إعادة استخدام الـ Config الخاصة بمشروع Matrix بتاعك
const firebaseConfig = {
    apiKey: "AIzaSyBPVk3WfBQsF6mu_taU6X30KDdVhmATr_E",
    authDomain: "matrix-2e69e.firebaseapp.com",
    projectId: "matrix-2e69e",
    storageBucket: "matrix-2e69e.firebasestorage.app",
    messagingSenderId: "825284857847",
    appId: "1:825284857847:web:11a15cb6202a8365b5a8f2",
    measurementId: "G-CBLHD3F66Z"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// كاش محلي لحالة الطوارئ
let currentEmergencyStatus = false;

/**
 * 2. محرك مراقبة وتغيير وضع الطوارئ (Emergency Lockdown Sync)
 */
export function listenToEmergencyMode() {
    const panicBox = document.getElementById('panic-box');
    const toggleBtn = document.getElementById('btn-lockdown-toggle');
    const emergencyRef = ref(db, 'system/emergencyLockdown');

    // الاستماع اللحظي للحالة في الـ Database
    onValue(emergencyRef, (snapshot) => {
        const data = snapshot.val();
        currentEmergencyStatus = (data === true);

        if (currentEmergencyStatus) {
            // لو وضع الطوارئ شغال في السيرفر بنغير شكل الزرار في اللوحة
            panicBox.classList.add('emergency-active');
            toggleBtn.innerText = "🚨 إيقاف وضع الطوارئ وفتح الموقع 🔓";
            toggleBtn.style.backgroundColor = "#238636"; // أخضر لفك القفل
        } else {
            panicBox.classList.remove('emergency-active');
            toggleBtn.innerText = "تفعيل الإغلاق الحديدي 🔒";
            toggleBtn.style.backgroundColor = "#da3633"; // أحمر للقفل
        }
    });

    // عند الضغط على الزرار بيعكس الحالة فوراً في الفايربيز والموقع كله يقفل/يفتح في نفس اللحظة
    toggleBtn.addEventListener('click', () => {
        const newStatus = !currentEmergencyStatus;
        set(emergencyRef, newStatus)
            .then(() => console.log(`🛰️ [ADMIN] Emergency lockdown updated to: ${newStatus}`))
            .catch(err => alert(`❌ خطأ في الصلاحيات: ${err.message}`));
    });
}

/**
 * 3. جلب ومراجعة طلبات الإيداع والتمويل (Live Deposits Manager)
 */
export function syncPendingDeposits() {
    const depositRows = document.getElementById('deposit-rows');
    const depositsRef = ref(db, 'deposits/pending');

    onValue(depositsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            depositRows.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#8b949e;">📭 لا توجد طلبات إيداع معلقة حالياً.</td></tr>`;
            return;
        }

        let html = '';
        // ليدر يمر على كل الطلبات المرفوعة في السيرفر
        Object.keys(data).forEach(key => {
            const tx = data[key];
            html += `
                <tr id="tx-row-${key}">
                    <td>\`${tx.userId}\`</td>
                    <td><span class="badge ${tx.tier === 'Solo' ? 'bg-success' : 'bg-pending'}">${tx.tier === 'Solo' ? 'VIP Solo ($110)' : 'VIP Joint ($25)'}</span></td>
                    <td><code style="color:#1f6feb" title="${tx.txid}">${tx.txid.substring(0, 10)}...</code></td>
                    <td><button class="btn-action-xs btn-approve-dep" data-key="${key}" data-uid="${tx.userId}" data-tier="${tx.tier}">✔️ موافقة</button></td>
                </tr>
            `;
        });
        depositRows.innerHTML = html;

        // تفعيل أزرار الموافقة وضخ الرصيد
        document.querySelectorAll('.btn-approve-dep').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const txKey = e.currentTarget.getAttribute('data-key');
                const userId = e.currentTarget.getAttribute('data-uid');
                const tier = e.currentTarget.getAttribute('data-tier');
                approveDepositTransaction(txKey, userId, tier);
            });
        });
    });
}

/**
 * 4. آلية الموافقة وترقية حساب العميل (Execute Approve & Upgrade)
 */
function approveDepositTransaction(txKey, userId, tier) {
    const updates = {};
    // أ. نقل المعاملة من معلقة إلى مكتملة في السيرفر
    updates[`deposits/pending/${txKey}`] = null;
    updates[`deposits/completed/${txKey}`] = {
        userId: userId,
        tier: tier,
        timestamp: new Date().getTime()
    };
    // ب. ترقية رتبة العميل وباقته في حسابه الرئيسي حياً ليتغير شكل موقع عنده فوراً
    updates[`users/${userId}/premiumTier`] = tier === 'Solo' ? 'VIPSolo' : 'VIP1';
    updates[`users/${userId}/isPremiumUser`] = true;

    update(ref(db), updates)
        .then(() => alert(`🎉 تم تفعيل باقة الحساب \`${userId}\` بنجاح والمزامنة حية!`))
        .catch(err => console.error("❌ [APPROVE ERROR]:", err));
}

/**
 * 5. جلب وإدارة ملفات توثيق الـ KYC الشخصية
 */
export function syncPendingKyc() {
    const kycRows = document.getElementById('kyc-rows');
    const kycRef = ref(db, 'kyc/pending');

    onValue(kycRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            kycRows.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#8b949e;">📭 لا توجد ملفات KYC بانتظار المراجعة.</td></tr>`;
            return;
        }

        let html = '';
        Object.keys(data).forEach(key => {
            const kyc = data[key];
            html += `
                <tr>
                    <td><strong>${kyc.fullname}</strong></td>
                    <td><code>${kyc.nationalId}</code></td>
                    <td><span class="badge bg-pending">معلق</span></td>
                    <td><button class="btn-action-xs btn-approve-kyc" data-key="${key}" data-uid="${kyc.userId}">✔️ توثيق</button></td>
                </tr>
            `;
        });
        kycRows.innerHTML = html;

        document.querySelectorAll('.btn-approve-kyc').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const kycKey = e.currentTarget.getAttribute('data-key');
                const userId = e.currentTarget.getAttribute('data-uid');
                approveKycDocument(kycKey, userId);
            });
        });
    });
}

function approveKycDocument(kycKey, userId) {
    const updates = {};
    updates[`kyc/pending/${kycKey}`] = null;
    updates[`users/${userId}/kycStatus`] = 'Verified';

    update(ref(db), updates)
        .then(() => alert(`🔒 تم توثيق هوية المستخدم قانونياً بنجاح!`))
        .catch(err => console.error("❌ [KYC APPROVE ERROR]:", err));
}
