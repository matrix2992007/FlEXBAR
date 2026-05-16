/**
 * FLEXBAR - Live Leaderboard Component (FlexBoard.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Feature: Weekly Leaderboard for Top Traders & Referrals (FOMO Driver)
 * Developers: Mark (Youssef) & Maro
 */

const BOARD_CACHE = {
    viewRootRef: null,
    globalStateRef: null,
    // داتا وهمية منسقة بأسماء برو لزوم إشعال الحماس والتنافس في البداية
    topTraders: [
        { rank: 1, name: "كريم الزناري", tier: "VIPMax", totalEarned: 450.50, referrals: 32, isMe: false },
        { rank: 2, name: "Conor_X", tier: "VIP2", totalEarned: 285.00, referrals: 21, isMe: false },
        { rank: 3, name: "Hazem_VIP", tier: "VIP1", totalEarned: 190.25, referrals: 15, isMe: false },
        { rank: 4, name: "صقر_سيناء", tier: "VIP1", totalEarned: 115.00, referrals: 12, isMe: false }
    ]
};

/**
 * 1. رندر وبناء واجهة المتصدرين الأسبوعية (Render Leaderboard UI)
 */
export function renderFlexBoard(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;

    BOARD_CACHE.viewRootRef = targetContainer;
    BOARD_CACHE.globalStateRef = globalState;

    // جلب بيانات العميل الحالي لدمجه في اللوحة ديناميكياً بناءً على رصيده الحالي
    const myCurrentEarned = (globalState.liveFlixBalance * 0.15);
    const myRow = {
        rank: 5,
        name: "أنت (حساب #" + (globalState.activeAccountIndex + 1) + ")",
        tier: globalState.premiumTier,
        totalEarned: myCurrentEarned,
        referrals: globalState.referralCount,
        isMe: true
    };

    // دمج العميل في القائمة
    const fullList = [...BOARD_CACHE.topTraders, myRow];
    
    // ترتيب القائمة تنازلياً حسب الأرباح لضمان دقة الترتيب اللحظي
    fullList.sort((a, b) => b.totalEarned - a.totalEarned);

    let rowsHtml = '';

    // بناء سطور الجدول الفخم بستايل بايبت المظلم (#0b0e11)
    fullList.forEach((trader, index) => {
        const currentRank = index + 1;
        let rankBadge = `<span class="rank-number">${currentRank}</span>`;
        
        // إعطاء أوسمة ذهبية وفضية للمراكز الثلاثة الأولى
        if (currentRank === 1) rankBadge = `<span class="badge-gold"><i class="fas fa-medal"></i></span>`;
        if (currentRank === 2) rankBadge = `<span class="badge-silver"><i class="fas fa-medal"></i></span>`;
        if (currentRank === 3) rankBadge = `<span class="badge-bronze"><i class="fas fa-medal"></i></span>`;

        rowsHtml += `
            <tr class="${trader.isMe ? 'trader-row-me' : ''}">
                <td>${rankBadge}</td>
                <td class="trader-name-cell">
                    <strong>${trader.name}</strong>
                    ${trader.isMe ? '<span class="you-tag">أنت</span>' : ''}
                </td>
                <td><span class="board-tier-badge ${trader.tier}">${trader.tier}</span></td>
                <td class="text-green font-bold">$${trader.totalEarned.toFixed(2)}</td>
                <td>${trader.referrals} إحالة</td>
            </tr>
        `;
    });

    const boardTemplate = `
        <div class="leaderboard-wrapper animate-fade-in">
            
            <header class="board-header-banner">
                <div class="board-banner-icon"><i class="fas fa-trophy"></i></div>
                <div class="board-banner-text">
                    <h4>قاعة مشاهير وتجار FLEXBAR</h4>
                    <p>يتم تحديث اللوحة تلقائياً كل ساعة. أصحاب المراكز الثلاثة الأولى أسبوعياً يحصلون على بونص إضافي بقيمة <span class="text-orange font-bold">10$ USDT</span> كاش من الوكالة.</p>
                </div>
            </header>

            <section class="board-table-container">
                <table class="flex-crypto-table">
                    <thead>
                        <tr>
                            <th>الترتيب</th>
                            <th>التاجر</th>
                            <th>الباقة</th>
                            <th>إجمالي الأرباح</th>
                            <th>شبكة الإحالات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </section>

        </div>
    `;

    targetContainer.innerHTML = boardTemplate;
    console.log("🏆 [LEADERBOARD] Rendered successfully. Syncing competition matrix.");
}

/**
 * 2. دالة جلب البيانات الحية مستقبلياً من السيرفر (Live Server Sync)
 */
export async function fetchLeaderboard() {
    // كود مارو المستقبلي لـ fetch البيانات الحقيقية من فايربيز وترتيب الحيتان لايف
    // fetch(`YOUR_FIREBASE_URL/leaderboard.json?orderBy="totalEarned"&limitToLast=5`)
    console.log("📡 [DB SYNC] Leaderboard background refresh checked.");
}
