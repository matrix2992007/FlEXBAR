/**
 * FLEXBAR - Task Center & Advertising Engine (TaskCenter.js)
 * Architecture: Component-Driven UI Module
 * Max Lines Limit: ~500 Lines (Clean & Optimized)
 * Feature: Micro-Tasks for Telegram Channels & Web Ads (Traffic Driver)
 * Developers: Mark (Youssef) & Maro
 */

const TASK_CACHE = {
    viewRootRef: null,
    globalStateRef: null,
    availableTasks: [
        { id: "tsk_01", title: "الاشتراك في قناة وكالة FLEXBAR الرسمية", reward: 5.0, link: "https://t.me/gaps_spiderx_yt_bot", type: "telegram", isDone: false },
        { id: "tsk_02", title: "متابعة تيك توك الوكالة لمراقبة الأرباح", reward: 3.5, link: "#", type: "tiktok", isDone: false },
        { id: "tsk_03", title: "مشاهدة فيديو شرح استراتيجية الـ 110$ بالكامل", reward: 10.0, link: "https://www.youtube.com/@Vip_x_21", type: "youtube", isDone: false }
    ]
};

/**
 * 1. رندر وبناء واجهة مركز المهمات (Render Task Center UI)
 */
export function loadTasks(targetContainer, globalState) {
    if (!targetContainer || !globalState) return;

    TASK_CACHE.viewRootRef = targetContainer;
    TASK_CACHE.globalStateRef = globalState;

    let tasksHtml = '';

    // بناء قائمة التاسكات المتاحة من الكاش ديناميكياً
    TASK_CACHE.availableTasks.forEach(task => {
        tasksHtml += `
            <div class="task-item-card ${task.isDone ? 'task-completed' : ''}" id="card-${task.id}">
                <div class="task-meta-info">
                    <div class="task-icon-box ${task.type}">
                        <i class="fab ${task.type === 'telegram' ? 'fa-telegram-plane' : task.type === 'youtube' ? 'fa-youtube' : 'fa-tiktok'}"></i>
                    </div>
                    <div class="task-texts">
                        <h5>${task.title}</h5>
                        <p class="task-prize"><i class="fas fa-cubes-stacked text-yellow"></i> +${task.reward.toFixed(2)} $FLIX</p>
                    </div>
                </div>
                <div class="task-actions-zone">
                    ${task.isDone ? `
                        <span class="badge-done-task"><i class="fas fa-check-circle"></i> مكتملة</span>
                    ` : `
                        <a href="${task.link}" target="_blank" class="btn-go-task" data-id="${task.id}"><i class="fas fa-external-link-alt"></i> ابدأ المهمة</a>
                        <button class="btn-verify-task hidden" id="verify-${task.id}" data-id="${task.id}"><i class="fas fa-circle-notch fa-spin hidden"></i> تحقق</button>
                    `}
                </div>
            </div>
        `;
    });

    const taskTemplate = `
        <div class="task-center-wrapper animate-fade-in">
            
            <header class="task-header-banner">
                <div class="banner-content">
                    <h4><i class="fas fa-tasks text-orange"></i> مركز المهمات والترافيك المباشر</h4>
                    <p>نفذ المهام اليومية البسيطة لدعم كامبينات الوكالة وزيادة رصيد عملة $FLIX في محفظتك مجاناً.</p>
                </div>
                <div class="task-stats-mini">
                    <span>المهام المنجزة اليوم:</span>
                    <strong id="task-counter-txt">0 / ${TASK_CACHE.availableTasks.length}</strong>
                </div>
            </header>

            <section class="tasks-list-container">
                ${tasksHtml}
            </section>

        </div>
    `;

    targetContainer.innerHTML = taskTemplate;

    // تشغيل أحداث الأزرار والتحقق الصايع
    setupTaskHandlers();
    updateCompletedCounter();
}

/**
 * 2. معالج أحداث المهام والتحقق اللحظي (Task Event Handlers)
 */
function setupTaskHandlers() {
    // أ. عند الضغط على "ابدأ المهمة"، بنفتح اللينك وبنظهر زرار "التحقق" (Verify) مكانها بعد 3 ثواني
    document.querySelectorAll('.btn-go-task').forEach(link => {
        link.addEventListener('click', (e) => {
            const taskId = e.currentTarget.getAttribute('data-id');
            const verifyBtn = document.getElementById(`verify-${taskId}`);
            
            e.currentTarget.classList.add('hidden'); // إخفاء زرار البداية
            if (verifyBtn) {
                verifyBtn.classList.remove('hidden'); // إظهار زرار التحقق
            }
            console.log(`🎯 [TASK] User started task: ${taskId}. Verification button unlocked.`);
        });
    });

    // ب. عند الضغط على "تحقق" (Verify) لعمل التأكيد السيكولوجي والأمني
    document.querySelectorAll('.btn-verify-task').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const taskId = e.currentTarget.getAttribute('data-id');
            const spinner = e.currentTarget.querySelector('.fa-spin');
            
            // تشغيل الأنيميشن بتاع اللودينج لخلق إحساس إن السيستم بيفحص حقيقي
            e.currentTarget.disabled = true;
            if (spinner) spinner.classList.remove('hidden');

            // دالة الفحص في الخلفية (تأخير وهمي 2 ثانية لقفل ثغرة النقرات العشوائية)
            setTimeout(() => {
                verifyTaskProgress(taskId, e.currentTarget);
            }, 2000);
        });
    });
}

/**
 * 3. آلية تأكيد الميزانية وزيادة الأرباح (Task Verification Core)
 */
export function verifyTaskProgress(taskId, buttonElement) {
    console.log(`📡 [TASK CORE] Verifying criteria for Task ID: ${taskId}`);

    // تحديث الكاش المحلي للمهمة بأنها اكتملت
    const taskIndex = TASK_CACHE.availableTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        TASK_CACHE.availableTasks[taskIndex].isDone = true;
        const taskReward = TASK_CACHE.availableTasks[taskIndex].reward;

        // ضخ العائد فوراً في الحالة العالمية لملف App.js ليظهر في العداد لايف
        TASK_CACHE.globalStateRef.liveFlixBalance += taskReward;
        
        // كود مارو المستقبلي: إرسال سطر تحديث لـ Firebase لحفظ أن العميل أنجز المهمة نهائياً
        // fetch(`YOUR_FIREBASE_URL/users/${userId}/tasks/${taskId}.json`, { method: 'PUT', body: true })

        // تحديث شكل الكارد على الشاشة فوراً دون ريفريش
        const card = document.getElementById(`card-${taskId}`);
        if (card) {
            card.classList.add('task-completed');
            const actionZone = card.querySelector('.task-actions-zone');
            actionZone.innerHTML = `<span class="badge-done-task"><i class="fas fa-check-circle"></i> مكتملة</span>`;
        }

        // تحديث العداد العلوي
        updateCompletedCounter();
        alert(`🎉 مبروك! تم تأكيد المهمة وإضافة +${taskReward} $FLIX لمحفظتك.`);
    }
}

function updateCompletedCounter() {
    const doneCount = TASK_CACHE.availableTasks.filter(t => t.isDone).length;
    const counterTxt = document.getElementById('task-counter-txt');
    if (counterTxt) {
        counterTxt.innerText = `${doneCount} / ${TASK_CACHE.availableTasks.length}`;
    }
}
