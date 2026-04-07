// ============================================
// メインアプリ (app.html) - CS新人育成版
// テスト・ワークシート・ツール機能追加
// ============================================

let currentUser = null;
let currentProfile = null;
let completedSkills = []; // { skill_id, memo, image_url, status, completed_at, feedback }
let selectedCategory = 'ALL';
let selectedDay = 'ALL';
let currentPage = 'quests';
let pendingSkillId = null;
let selectedFile = null;

// テスト関連
let currentTest = null;
let currentTestId = null;
let currentQuestionIndex = 0;
let testAnswers = [];
let testResults = []; // Supabaseから取得したテスト結果

// ワークシート関連
let worksheets = []; // Supabaseから取得したワークシート
let currentWsType = null; // 現在開いているワークシートの種類

// --- 初期化 ---
(async () => {
  currentUser = await requireAuth();
  if (!currentUser) return;

  currentProfile = await getProfile(currentUser.id);

  // ロール別リンク表示
  if (currentProfile) {
    if (currentProfile.role === 'admin') {
      const adminLink = document.getElementById('admin-link');
      adminLink.classList.remove('hidden');
      adminLink.classList.add('flex');
    }
    if (currentProfile.role === 'manager' || currentProfile.role === 'admin') {
      const managerLink = document.getElementById('manager-link');
      managerLink.classList.remove('hidden');
      managerLink.classList.add('flex');
    }
  }

  updateUserInfo();
  await Promise.all([loadProgress(), loadTestResults(), loadWorksheets()]);
  renderAll();

  document.getElementById('loading-screen').style.display = 'none';

  // 画像ドロップゾーン
  setupDropZone();

  lucide.createIcons();
})();

// ============================================
// データ読み込み
// ============================================
async function loadProgress() {
  const { data, error } = await supabase
    .from('skill_progress')
    .select('skill_id, memo, image_url, status, completed_at, feedback')
    .eq('user_id', currentUser.id);
  if (error) { console.error('Progress load error:', error); return; }
  completedSkills = data || [];
}

async function loadTestResults() {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('completed_at', { ascending: false });
  if (error) { console.error('Test results load error:', error); return; }
  testResults = data || [];
}

async function loadWorksheets() {
  const { data, error } = await supabase
    .from('worksheets')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('updated_at', { ascending: false });
  if (error) { console.error('Worksheets load error:', error); return; }
  worksheets = data || [];
}

// --- 進捗ヘルパー ---
function getCompletedIds() {
  return completedSkills.filter(s => s.status === 'approved').map(s => s.skill_id);
}
function getPendingIds() {
  return completedSkills.filter(s => s.status === 'pending').map(s => s.skill_id);
}
function getRejectedIds() {
  return completedSkills.filter(s => s.status === 'rejected').map(s => s.skill_id);
}
function getAllSubmittedIds() {
  return completedSkills.map(s => s.skill_id);
}

// ============================================
// ユーザー情報
// ============================================
function updateUserInfo() {
  if (!currentProfile) return;
  const name = currentProfile.display_name || 'ユーザー';
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-initial').textContent = name.charAt(0).toUpperCase();
  document.getElementById('user-dept').textContent = currentProfile.department || 'カスタマーサクセス部';
}

function getRankLabel(totalLevel) {
  if (totalLevel >= 20) return 'L5 エキスパート';
  if (totalLevel >= 15) return 'L4 シニア';
  if (totalLevel >= 10) return 'L3 中堅';
  if (totalLevel >= 5) return 'L2 成長中';
  return 'L1 基礎学習中';
}

// ============================================
// メインレンダリング
// ============================================
function renderAll() {
  const approvedIds = getCompletedIds();
  const stats = calculateStats(approvedIds);
  const totalLevel = Object.values(stats).reduce((sum, s) => sum + s.level, 0);

  document.getElementById('total-level').textContent = totalLevel;
  document.getElementById('completed-count').textContent = approvedIds.length;
  document.getElementById('total-count').textContent = SKILL_DATA.length;
  document.getElementById('user-rank').textContent = getRankLabel(totalLevel);

  renderPCStatus(stats);
  renderMobileStatus(stats);
  renderFilters();
  renderQuests();
  renderRadarChart(stats);
  renderBadges(approvedIds);

  lucide.createIcons();
}

function calculateStats(ids) {
  const stats = {};
  for (const catName in CATEGORIES) {
    const catSkills = SKILL_DATA.filter(s => s.category === catName);
    const totalXp = catSkills.reduce((sum, s) => sum + s.xp, 0);
    const earnedXp = catSkills.filter(s => ids.includes(s.id)).reduce((sum, s) => sum + s.xp, 0);
    stats[catName] = {
      current: earnedXp, max: totalXp,
      level: Math.floor(earnedXp / 150) + 1,
      progress: Math.floor((earnedXp / totalXp) * 100) || 0
    };
  }
  return stats;
}

// ============================================
// ステータスバー
// ============================================
function renderPCStatus(stats) {
  document.getElementById('pc-status-bar').innerHTML = Object.entries(CATEGORIES).map(([catName, style]) => `
    <div class="flex flex-col items-center min-w-[5rem] shrink-0">
      <div class="text-[9px] font-bold ${style.color} mb-1 flex items-center gap-1 uppercase tracking-wider whitespace-nowrap">
        <i data-lucide="${style.icon}" width="10"></i> ${style.description}
      </div>
      <div class="text-xl font-black text-slate-700 leading-none mb-1.5">${stats[catName].current}</div>
      <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div class="h-full ${style.bgColor} transition-all duration-1000 ease-out rounded-full" style="width: ${stats[catName].progress}%"></div>
      </div>
    </div>
  `).join('');
}

function renderMobileStatus(stats) {
  document.getElementById('mobile-status-grid').innerHTML = Object.entries(CATEGORIES).map(([catName, style]) => `
    <div class="bg-white/80 backdrop-blur p-3 rounded-xl border border-slate-200/50 shadow-sm">
      <div class="text-[10px] font-bold ${style.color} mb-1 flex items-center gap-1 uppercase tracking-wider">
        <i data-lucide="${style.icon}" width="11"></i> ${style.description}
      </div>
      <div class="flex justify-between items-end mb-2">
        <span class="text-xl font-black text-slate-800">${stats[catName].current}</span>
        <span class="text-[10px] text-slate-400">/ ${stats[catName].max} XP</span>
      </div>
      <div class="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div class="h-full ${style.bgColor} transition-all duration-1000 ease-out rounded-full" style="width: ${stats[catName].progress}%"></div>
      </div>
    </div>
  `).join('');
}

// ============================================
// フィルタ（カテゴリ + 営業日）
// ============================================
function renderFilters() {
  const container = document.getElementById('filter-tabs');

  // カテゴリフィルタ
  let html = `
    <button onclick="setCategory('ALL')" class="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${selectedCategory === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200/50'}">
      <i data-lucide="layout-grid" width="14"></i> 全て (${SKILL_DATA.length})
    </button>`;
  html += Object.entries(CATEGORIES).map(([catName, style]) => `
    <button onclick="setCategory('${catName}')" class="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${selectedCategory === catName ? `${style.bgColor} text-white shadow-md` : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200/50'}">
      <i data-lucide="${style.icon}" width="14"></i> ${catName.split("・")[0]}
    </button>
  `).join('');
  container.innerHTML = html;

  // 営業日フィルタ
  const dayContainer = document.getElementById('day-filter-tabs');
  if (!dayContainer) return;

  // 営業日リストを生成（存在する日のみ）
  const days = [...new Set(SKILL_DATA.map(s => s.day))].sort((a, b) => a - b);
  let dayHtml = `
    <button onclick="setDay('ALL')" class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedDay === 'ALL' ? 'bg-slate-700 text-white' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200/50'}">
      全日程
    </button>`;
  days.forEach(d => {
    const label = d === 0 ? 'スキルチェック' : `Day ${d}`;
    dayHtml += `
      <button onclick="setDay(${d})" class="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedDay === d ? 'bg-slate-700 text-white' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-200/50'}">
        ${label}
      </button>`;
  });
  dayContainer.innerHTML = dayHtml;
}

function setCategory(cat) {
  selectedCategory = cat;
  renderFilters();
  renderQuests();
  lucide.createIcons();
}

function setDay(day) {
  selectedDay = day;
  renderFilters();
  renderQuests();
  lucide.createIcons();
}

// ============================================
// クエスト一覧
// ============================================
function renderQuests() {
  const container = document.getElementById('quest-grid');
  let filtered = SKILL_DATA;

  // カテゴリフィルタ
  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter(s => s.category === selectedCategory);
  }
  // 営業日フィルタ
  if (selectedDay !== 'ALL') {
    filtered = filtered.filter(s => s.day === selectedDay);
  }

  container.innerHTML = filtered.map(skill => {
    const style = CATEGORIES[skill.category];
    const progress = completedSkills.find(p => p.skill_id === skill.id);
    const status = progress ? progress.status : 'none';

    // ステータスバッジ
    let statusBadge = '';
    let overlayHtml = '';
    let buttonHtml = '';

    if (status === 'approved') {
      statusBadge = `<div class="status-approved px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><i data-lucide="check-circle-2" width="10"></i>承認済</div>`;
      overlayHtml = `
        <div class="absolute inset-0 z-10 bg-white/40 flex items-center justify-center backdrop-blur-[2px]">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-2xl font-black shadow-xl transform -rotate-6 border-4 border-white flex items-center gap-2 text-sm">
            <i data-lucide="check-circle-2" width="18"></i> APPROVED
          </div>
        </div>`;
      buttonHtml = `<button disabled class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-100 text-slate-400 cursor-default text-sm"><i data-lucide="check-circle-2" width="16"></i> 承認済み</button>`;
    } else if (status === 'pending') {
      statusBadge = `<div class="status-pending px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><i data-lucide="clock" width="10"></i>承認待ち</div>`;
      overlayHtml = `
        <div class="absolute inset-0 z-10 bg-white/30 flex items-center justify-center backdrop-blur-[1px]">
          <div class="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-5 py-2.5 rounded-2xl font-black shadow-xl transform -rotate-3 border-4 border-white flex items-center gap-2 text-sm">
            <i data-lucide="clock" width="18"></i> PENDING
          </div>
        </div>`;
      buttonHtml = `<button disabled class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-amber-50 text-amber-500 cursor-default text-sm border border-amber-200"><i data-lucide="clock" width="16"></i> マネージャー承認待ち</button>`;
    } else if (status === 'rejected') {
      statusBadge = `<div class="status-rejected px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><i data-lucide="x-circle" width="10"></i>差し戻し</div>`;
      buttonHtml = `<button onclick="openMemo(${skill.id})" class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:brightness-110 text-sm"><i data-lucide="refresh-cw" width="16"></i> 再申請する</button>`;
    } else {
      buttonHtml = `<button onclick="openMemo(${skill.id})" class="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] bg-gradient-to-r ${style.gradient || 'from-indigo-500 to-purple-500'} text-white shadow-lg hover:shadow-xl hover:brightness-110 text-sm"><i data-lucide="send" width="16"></i> 完了申請</button>`;
    }

    // 優先度バッジ
    let priorityBadge = '';
    if (skill.priority === "高") {
      priorityBadge = `<div class="flex items-center text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border border-amber-100"><i data-lucide="flame" width="10" class="mr-0.5"></i>高</div>`;
    } else if (skill.priority === "中") {
      priorityBadge = `<div class="flex items-center text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border border-slate-200">中</div>`;
    } else {
      priorityBadge = `<div class="flex items-center text-slate-300 bg-slate-50 px-1.5 py-0.5 rounded-lg text-[10px] font-bold border border-slate-100">小</div>`;
    }

    // 営業日バッジ
    const dayBadge = skill.day > 0
      ? `<div class="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Day ${skill.day}</div>`
      : `<div class="text-[9px] font-bold text-violet-400 bg-violet-50 px-1.5 py-0.5 rounded">スキルチェック</div>`;

    // メモ・フィードバック表示
    let extraHtml = '';
    if (progress && progress.memo) {
      extraHtml += `<div class="mx-5 mb-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
        <div class="text-[10px] font-bold text-blue-500 mb-1 flex items-center gap-1"><i data-lucide="message-square" width="10"></i> 振り返りメモ</div>
        <p class="text-xs text-slate-600">${escapeHtml(progress.memo)}</p>
      </div>`;
    }
    if (progress && progress.image_url) {
      extraHtml += `<div class="mx-5 mb-3"><img src="${progress.image_url}" class="w-full h-32 object-cover rounded-xl border border-slate-200" alt="evidence"></div>`;
    }
    if (progress && progress.feedback) {
      extraHtml += `<div class="mx-5 mb-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
        <div class="text-[10px] font-bold text-amber-600 mb-1 flex items-center gap-1"><i data-lucide="message-circle" width="10"></i> マネージャーからのフィードバック</div>
        <p class="text-xs text-slate-600">${escapeHtml(progress.feedback)}</p>
      </div>`;
    }

    // リンクボタン
    let linksHtml = '';
    if (skill.links && skill.links.length > 0) {
      linksHtml = `<div class="mx-5 mb-3 flex flex-wrap gap-2">
        ${skill.links.map(link => `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors">
            <i data-lucide="external-link" width="10"></i> ${escapeHtml(link.text)}
          </a>
        `).join('')}
      </div>`;
    }

    // テストボタン
    let testBtnHtml = '';
    if (skill.testId && TEST_DATA[skill.testId]) {
      const testPassed = isTestPassed(skill.testId);
      if (testPassed) {
        testBtnHtml = `<div class="mx-5 mb-3">
          <button disabled class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs cursor-default">
            <i data-lucide="check-circle-2" width="14"></i> テスト合格済み
          </button>
        </div>`;
      } else {
        testBtnHtml = `<div class="mx-5 mb-3">
          <button onclick="openTest('${skill.testId}')" class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-violet-50 text-violet-600 border border-violet-200 text-xs hover:bg-violet-100 transition-colors">
            <i data-lucide="file-question" width="14"></i> テストを受ける
          </button>
        </div>`;
      }
      // Googleフォームのリンクもある場合
      if (skill.testLink) {
        testBtnHtml += `<div class="mx-5 mb-3">
          <a href="${skill.testLink}" target="_blank" rel="noopener noreferrer" class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 text-xs hover:bg-blue-100 transition-colors">
            <i data-lucide="external-link" width="14"></i> Googleフォームでテスト
          </a>
        </div>`;
      }
    } else if (skill.testLink) {
      // testIdはないがtestLinkがある場合
      testBtnHtml = `<div class="mx-5 mb-3">
        <a href="${skill.testLink}" target="_blank" rel="noopener noreferrer" class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 text-xs hover:bg-blue-100 transition-colors">
          <i data-lucide="external-link" width="14"></i> Googleフォームでテスト
        </a>
      </div>`;
    }

    // ワークシートボタン
    let worksheetBtnHtml = '';
    if (skill.worksheetType) {
      const ws = worksheets.find(w => w.type === skill.worksheetType);
      const wsStatus = ws ? ws.status : null;
      if (wsStatus === 'submitted') {
        worksheetBtnHtml = `<div class="mx-5 mb-3">
          <button onclick="openWorksheet('${skill.worksheetType}')" class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs hover:bg-emerald-100 transition-colors">
            <i data-lucide="check-circle-2" width="14"></i> ワークシート提出済み（確認する）
          </button>
        </div>`;
      } else if (wsStatus === 'draft') {
        worksheetBtnHtml = `<div class="mx-5 mb-3">
          <button onclick="openWorksheet('${skill.worksheetType}')" class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-amber-50 text-amber-600 border border-amber-200 text-xs hover:bg-amber-100 transition-colors">
            <i data-lucide="edit-3" width="14"></i> ワークシート下書き中（続きを書く）
          </button>
        </div>`;
      } else {
        worksheetBtnHtml = `<div class="mx-5 mb-3">
          <button onclick="openWorksheet('${skill.worksheetType}')" class="w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 bg-teal-50 text-teal-600 border border-teal-200 text-xs hover:bg-teal-100 transition-colors">
            <i data-lucide="clipboard-edit" width="14"></i> ワークシートを開く
          </button>
        </div>`;
      }
    }

    const isInactive = status === 'approved' || status === 'pending';

    return `
      <div class="group relative bg-white rounded-3xl border-2 transition-all duration-300 flex flex-col overflow-hidden card-hover ${isInactive ? 'border-slate-200/50 opacity-70' : 'border-slate-100 hover:border-indigo-200'}">
        ${overlayHtml}
        <div class="px-5 py-4 border-b border-slate-100/50 flex justify-between items-start bg-gradient-to-br ${isInactive ? 'from-slate-50 to-slate-100/50' : 'from-white to-slate-50/30'}">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${style.bgLight} ${style.color}">
                <i data-lucide="${style.icon}" width="9"></i> ${style.description}
              </div>
              ${dayBadge}
            </div>
            <h3 class="font-bold text-lg text-slate-800 leading-tight">${skill.skillName}</h3>
          </div>
          <div class="flex flex-col items-end gap-1.5">
            ${statusBadge}
            ${priorityBadge}
            <span class="text-[10px] font-black text-slate-300">+${skill.xp}XP</span>
          </div>
        </div>
        <div class="p-5 flex-grow space-y-3">
          <div class="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full ${style.bgColor}"></div>
            ${skill.category}
          </div>
          <div class="space-y-2.5">
            <div class="bg-slate-50/80 p-3 rounded-xl border border-slate-100/50">
              <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                <i data-lucide="target" width="10"></i> クリア条件
              </div>
              <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line">${skill.practiceTask}</p>
            </div>
            <details class="group/details">
              <summary class="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 cursor-pointer hover:text-indigo-600 transition-colors uppercase tracking-wider">
                <i data-lucide="lightbulb" width="10"></i> ヒント (INPUT)
                <i data-lucide="chevron-down" width="10" class="transition-transform group-open/details:rotate-180"></i>
              </summary>
              <div class="mt-2 bg-indigo-50/30 p-3 rounded-xl border border-indigo-50">
                <p class="text-xs text-slate-500 leading-relaxed whitespace-pre-line">${skill.inputTask}</p>
              </div>
            </details>
          </div>
        </div>
        ${linksHtml}
        ${testBtnHtml}
        ${worksheetBtnHtml}
        ${extraHtml}
        <div class="p-4 border-t border-slate-100/50 bg-slate-50/30">
          ${buttonHtml}
        </div>
      </div>`;
  }).join('');
}

// ============================================
// レーダーチャート
// ============================================
function renderRadarChart(stats) {
  const svg = document.getElementById('radar-chart');
  if (!svg) return;
  const cx = 150, cy = 150, maxR = 120;
  const categories = Object.keys(CATEGORIES);
  const n = categories.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;
  let html = '';

  // グリッド
  for (let level = 1; level <= 4; level++) {
    const r = (maxR / 4) * level;
    const points = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    html += `<polygon points="${points.join(' ')}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`;
  }

  // 軸線
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    html += `<line x1="${cx}" y1="${cy}" x2="${cx + maxR * Math.cos(angle)}" y2="${cy + maxR * Math.sin(angle)}" stroke="#e2e8f0" stroke-width="1"/>`;
  }

  // データ
  const dp = [];
  categories.forEach((cat, i) => {
    const pct = stats[cat].progress / 100;
    const r = maxR * pct;
    const angle = startAngle + i * angleStep;
    dp.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  });
  html += `<polygon points="${dp.join(' ')}" fill="url(#radarGrad)" stroke="#6366f1" stroke-width="2.5"/>`;
  html += `<defs><linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(99,102,241,0.25)"/><stop offset="100%" stop-color="rgba(168,85,247,0.15)"/></linearGradient></defs>`;

  // ドット＋ラベル
  categories.forEach((cat, i) => {
    const pct = stats[cat].progress / 100;
    const r = maxR * pct;
    const angle = startAngle + i * angleStep;
    html += `<circle cx="${cx + r * Math.cos(angle)}" cy="${cy + r * Math.sin(angle)}" r="5" fill="#6366f1" stroke="white" stroke-width="2"/>`;
    const lx = cx + (maxR + 22) * Math.cos(angle);
    const ly = cy + (maxR + 22) * Math.sin(angle);
    const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
    html += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="middle" class="text-[10px] font-bold fill-slate-500">${CATEGORIES[cat].description}</text>`;
    html += `<text x="${lx}" y="${ly + 14}" text-anchor="${anchor}" dominant-baseline="middle" class="text-[10px] fill-slate-400">${stats[cat].progress}%</text>`;
  });
  svg.innerHTML = html;
}

// ============================================
// バッジ
// ============================================
function renderBadges(ids) {
  const container = document.getElementById('badge-grid');
  if (!container) return;
  container.innerHTML = BADGES.map(badge => {
    const earned = isBadgeEarned(badge, ids);
    return `
      <div class="p-5 rounded-2xl border-2 transition-all ${earned ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-md' : 'border-slate-100 bg-slate-50/50 opacity-40 grayscale'}">
        <div class="text-4xl mb-3">${badge.icon}</div>
        <h3 class="font-bold text-sm text-slate-800">${badge.name}</h3>
        <p class="text-xs text-slate-500 mt-1">${badge.description}</p>
        ${earned ? '<span class="inline-block mt-3 text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">獲得済み</span>' : '<span class="inline-block mt-3 text-[10px] font-bold text-slate-300 bg-slate-100 px-2.5 py-1 rounded-full">未獲得</span>'}
      </div>`;
  }).join('');
}

function isBadgeEarned(badge, ids) {
  // カスタムチェック関数がある場合
  if (badge.check) return badge.check(ids);
  // テストの鬼バッジ
  if (badge.id === 'test_perfect') {
    const testIds = Object.keys(TEST_DATA);
    return testIds.every(tid => {
      const results = testResults.filter(r => r.test_id === tid && r.passed);
      return results.length > 0 && results.some(r => r.attempt_number === 1);
    });
  }
  // カテゴリ系
  if (badge.category === null) return ids.length === SKILL_DATA.length;
  const catSkills = SKILL_DATA.filter(s => s.category === badge.category);
  const completed = catSkills.filter(s => ids.includes(s.id)).length;
  return (completed / catSkills.length) >= badge.threshold;
}

// ============================================
// テスト機能
// ============================================

// テストに合格しているかチェック
function isTestPassed(testId) {
  return testResults.some(r => r.test_id === testId && r.passed);
}

// テスト結果の最高スコアを取得
function getBestScore(testId) {
  const results = testResults.filter(r => r.test_id === testId);
  if (results.length === 0) return null;
  return Math.max(...results.map(r => r.percentage !== undefined ? r.percentage : r.score));
}

// テスト受験回数を取得
function getTestAttemptCount(testId) {
  return testResults.filter(r => r.test_id === testId).length;
}

// テスト一覧ページ描画
function renderTests() {
  const container = document.getElementById('test-list');
  if (!container) return;

  const testEntries = Object.entries(TEST_DATA);

  container.innerHTML = testEntries.map(([testId, test]) => {
    const passed = isTestPassed(testId);
    const bestScore = getBestScore(testId);
    const attempts = getTestAttemptCount(testId);

    return `
      <div class="bg-white rounded-2xl border-2 ${passed ? 'border-emerald-200' : 'border-slate-100'} p-5 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-bold text-lg text-slate-800">${test.name}</h3>
            <p class="text-xs text-slate-400 mt-1">${test.description}</p>
          </div>
          ${passed ? `<div class="status-approved px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><i data-lucide="check-circle-2" width="12"></i>合格</div>` : ''}
        </div>
        <div class="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <span class="flex items-center gap-1"><i data-lucide="list" width="12"></i> ${test.questions.length}問</span>
          <span class="flex items-center gap-1"><i data-lucide="target" width="12"></i> 合格ライン: ${test.passingScore}%</span>
          <span class="flex items-center gap-1"><i data-lucide="repeat" width="12"></i> 受験回数: ${attempts}回</span>
          ${bestScore !== null ? `<span class="flex items-center gap-1 ${passed ? 'text-emerald-600 font-bold' : 'text-amber-600'}"><i data-lucide="trophy" width="12"></i> 最高: ${bestScore}%</span>` : ''}
        </div>
        <button onclick="openTest('${testId}')" class="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${passed ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:brightness-110'} text-sm">
          <i data-lucide="${passed ? 'refresh-cw' : 'play'}" width="16"></i> ${passed ? 'もう一度受ける' : '受験する'}
        </button>
      </div>`;
  }).join('');

  lucide.createIcons();
}

// テストモーダルを開く
function openTest(testId) {
  currentTestId = testId;
  currentTest = TEST_DATA[testId];
  currentQuestionIndex = 0;
  testAnswers = new Array(currentTest.questions.length).fill(null);

  renderTestQuestion();

  const modal = document.getElementById('test-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

// テストモーダルを閉じる
function closeTest() {
  currentTest = null;
  currentTestId = null;
  const modal = document.getElementById('test-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
// HTMLのonclickから呼ばれるエイリアス
function closeTestModal() { closeTest(); }
function retryTest() { if (currentTestId) openTest(currentTestId); }

// テスト問題を描画
function renderTestQuestion() {
  const content = document.getElementById('test-question-area');
  if (!currentTest) return;

  const q = currentTest.questions[currentQuestionIndex];
  const totalQ = currentTest.questions.length;
  const progressPct = Math.round(((currentQuestionIndex + 1) / totalQ) * 100);

  content.innerHTML = `
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-bold text-slate-400">問題 ${currentQuestionIndex + 1} / ${totalQ}</span>
        <span class="text-xs font-bold text-indigo-500">${currentTest.name}</span>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
      </div>
    </div>

    <div class="bg-slate-50 rounded-xl p-5 mb-5 border border-slate-100">
      <p class="font-bold text-slate-800 text-lg leading-relaxed">${q.question}</p>
    </div>

    <div class="space-y-3 mb-6">
      ${q.options.map((opt, i) => `
        <button onclick="selectTestAnswer(${i})" class="w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${testAnswers[currentQuestionIndex] === i ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-full ${testAnswers[currentQuestionIndex] === i ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'} text-xs font-bold mr-3">${String.fromCharCode(65 + i)}</span>
          ${escapeHtml(opt)}
        </button>
      `).join('')}
    </div>

    <div class="flex gap-3">
      ${currentQuestionIndex > 0 ? `
        <button onclick="prevTestQuestion()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1">
          <i data-lucide="chevron-left" width="14"></i> 前の問題
        </button>` : ''}
      <div class="flex-grow"></div>
      ${currentQuestionIndex < totalQ - 1 ? `
        <button onclick="nextTestQuestion()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:brightness-110 transition-all flex items-center gap-1 shadow-md" ${testAnswers[currentQuestionIndex] === null ? 'disabled style="opacity:0.5"' : ''}>
          次の問題 <i data-lucide="chevron-right" width="14"></i>
        </button>` : `
        <button onclick="submitTest()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 transition-all flex items-center gap-1 shadow-md" ${testAnswers[currentQuestionIndex] === null ? 'disabled style="opacity:0.5"' : ''}>
          結果を見る <i data-lucide="check-circle-2" width="14"></i>
        </button>`}
    </div>
  `;
  lucide.createIcons();
}

// 回答選択
function selectTestAnswer(index) {
  testAnswers[currentQuestionIndex] = index;
  renderTestQuestion();
}

// 次の問題へ
function nextTestQuestion() {
  if (testAnswers[currentQuestionIndex] === null) return;
  if (currentQuestionIndex < currentTest.questions.length - 1) {
    currentQuestionIndex++;
    renderTestQuestion();
  }
}

// 前の問題へ
function prevTestQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderTestQuestion();
  }
}

// テスト結果を表示・保存
async function submitTest() {
  if (testAnswers[currentQuestionIndex] === null) return;

  // 採点
  let correctCount = 0;
  const results = currentTest.questions.map((q, i) => {
    const isCorrect = testAnswers[i] === q.correct;
    if (isCorrect) correctCount++;
    return { question: q.question, userAnswer: testAnswers[i], correctAnswer: q.correct, isCorrect, options: q.options };
  });

  const score = Math.round((correctCount / currentTest.questions.length) * 100);
  const passed = score >= currentTest.passingScore;

  // 受験回数を計算
  const attemptNumber = getTestAttemptCount(currentTestId) + 1;

  // Supabaseに保存
  const { error } = await supabase.from('test_results').insert({
    user_id: currentUser.id,
    test_id: currentTestId,
    score: correctCount,
    total: currentTest.questions.length,
    percentage: score,
    passed: passed,
    attempt_number: attemptNumber,
    answers: testAnswers,
    completed_at: new Date().toISOString()
  });
  if (error) console.error('Test result save error:', error);

  // ローカルのtestResultsに追加
  testResults.push({
    user_id: currentUser.id,
    test_id: currentTestId,
    score: correctCount,
    total: currentTest.questions.length,
    percentage: score,
    passed: passed,
    attempt_number: attemptNumber,
    answers: testAnswers,
    completed_at: new Date().toISOString()
  });

  // 結果画面を描画
  const content = document.getElementById('test-question-area');
  content.innerHTML = `
    <div class="text-center mb-6">
      <div class="text-6xl mb-4">${passed ? '🎉' : '😢'}</div>
      <h3 class="text-2xl font-black ${passed ? 'text-emerald-600' : 'text-red-500'} mb-2">${passed ? '合格！' : '不合格...'}</h3>
      <p class="text-slate-500">${currentTest.name}</p>
    </div>

    <div class="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 text-center">
      <div class="text-5xl font-black ${passed ? 'text-emerald-600' : 'text-red-500'} mb-2">${score}%</div>
      <div class="text-sm text-slate-400">正答率 ${correctCount}/${currentTest.questions.length}問</div>
      <div class="text-xs text-slate-300 mt-1">合格ライン: ${currentTest.passingScore}% ｜ 受験回数: ${attemptNumber}回</div>
    </div>

    <div class="space-y-3 mb-6">
      <h4 class="font-bold text-sm text-slate-600 flex items-center gap-1"><i data-lucide="list-checks" width="14"></i> 各問の結果</h4>
      ${results.map((r, i) => `
        <div class="p-4 rounded-xl border ${r.isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'}">
          <div class="flex items-start gap-2">
            <i data-lucide="${r.isCorrect ? 'check-circle-2' : 'x-circle'}" width="16" class="${r.isCorrect ? 'text-emerald-500' : 'text-red-500'} mt-0.5"></i>
            <div class="flex-grow">
              <p class="text-sm font-medium text-slate-700 mb-1">問${i + 1}. ${escapeHtml(r.question)}</p>
              <p class="text-xs ${r.isCorrect ? 'text-emerald-600' : 'text-red-600'}">
                あなたの回答: ${r.userAnswer !== null ? escapeHtml(r.options[r.userAnswer]) : '未回答'}
              </p>
              ${!r.isCorrect ? `<p class="text-xs text-emerald-600 mt-0.5">正解: ${escapeHtml(r.options[r.correctAnswer])}</p>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="flex gap-3">
      <button onclick="openTest('${currentTestId}')" class="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
        <i data-lucide="refresh-cw" width="14"></i> もう一度受ける
      </button>
      <button onclick="closeTest()" class="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
        <i data-lucide="x" width="14"></i> 閉じる
      </button>
    </div>
  `;

  if (passed) {
    triggerConfetti();
    showNotificationCustom(`「${currentTest.name}」に合格しました！スコア: ${score}%`, 'success');
  }

  // テスト一覧を再描画
  renderTests();
  lucide.createIcons();
}

// ============================================
// ワークシート機能
// ============================================

// ワークシートのテンプレート定義
const WORKSHEET_TEMPLATES = {
  self_analysis: {
    name: "自己分析ワークシート",
    description: "時期ごとの振り返りを通じて自己理解を深める",
    fields: [
      { key: "childhood", label: "幼少期（0〜12歳）", placeholder: "好きだったこと、得意だったこと、印象的な出来事" },
      { key: "teenage", label: "中学〜高校時代", placeholder: "部活動、学業、友人関係、転機となった出来事" },
      { key: "university", label: "大学・専門学校時代", placeholder: "学んだこと、サークル・アルバイト、将来について考えたこと" },
      { key: "work_history", label: "社会人経験（前職含む）", placeholder: "職種、学んだスキル、やりがいを感じたこと、課題" },
      { key: "strengths", label: "自分の強み", placeholder: "周りからよく言われること、自信があること" },
      { key: "weaknesses", label: "自分の弱み・課題", placeholder: "克服したいこと、苦手なこと" },
      { key: "values", label: "大切にしている価値観", placeholder: "仕事で大切にしたいこと、人生の優先事項" },
      { key: "future_goals", label: "将来の目標", placeholder: "1年後、3年後、5年後にどうなっていたいか" }
    ]
  },
  logic_tree: {
    name: "ロジックツリーワークシート",
    description: "テーマに対して要素を分解し、構造的に思考する",
    fields: [
      { key: "theme", label: "テーマ（解決したい課題）", placeholder: "例: 顧客の離脱率を下げるには？" },
      { key: "branch1_title", label: "大分類①", placeholder: "例: サービス品質の問題" },
      { key: "branch1_detail", label: "大分類①の詳細・要因", placeholder: "さらに細かい要因を記入" },
      { key: "branch2_title", label: "大分類②", placeholder: "例: コミュニケーションの問題" },
      { key: "branch2_detail", label: "大分類②の詳細・要因", placeholder: "さらに細かい要因を記入" },
      { key: "branch3_title", label: "大分類③", placeholder: "例: 競合の影響" },
      { key: "branch3_detail", label: "大分類③の詳細・要因", placeholder: "さらに細かい要因を記入" },
      { key: "conclusion", label: "まとめ・優先的に取り組むべきこと", placeholder: "分解した結果から見えた優先事項" }
    ]
  },
  "3c_analysis": {
    name: "3C分析ワークシート",
    description: "Customer（顧客）・Company（自社）・Competitor（競合）を分析する",
    fields: [
      { key: "target_company", label: "分析対象の企業名/業種", placeholder: "例: 〇〇整骨院（整骨院業界）" },
      { key: "customer_needs", label: "Customer（顧客）：ニーズ・課題", placeholder: "ターゲット顧客は誰か？何に困っているか？" },
      { key: "customer_behavior", label: "Customer（顧客）：行動特性", placeholder: "どうやって情報を集めているか？意思決定のポイントは？" },
      { key: "company_strength", label: "Company（自社）：強み", placeholder: "他社にはない強み、差別化ポイント" },
      { key: "company_weakness", label: "Company（自社）：弱み・課題", placeholder: "改善すべき点、リソースの制約" },
      { key: "competitor_who", label: "Competitor（競合）：主な競合", placeholder: "競合企業名とそのサービス内容" },
      { key: "competitor_analysis", label: "Competitor（競合）：競合の戦略と差別化", placeholder: "競合がどんな戦略を取っているか、自社との違い" },
      { key: "strategy", label: "導き出した戦略・方針", placeholder: "3Cの分析結果から導かれる最適な施策" }
    ]
  },
  customer_journey: {
    name: "カスタマージャーニーマップ",
    description: "顧客の行動プロセスに沿って、コンテンツや施策を設計する",
    fields: [
      { key: "target_persona", label: "ターゲットペルソナ（顧客層）", placeholder: "年齢・性別・職業・悩み・ライフスタイル" },
      { key: "awareness_needs", label: "認知段階のニーズ", placeholder: "ユーザーがまだ課題を認識していない or 漠然と感じている段階" },
      { key: "awareness_kw", label: "認知段階の検索KW", placeholder: "この段階で検索しそうなキーワード" },
      { key: "interest_needs", label: "興味・関心段階のニーズ", placeholder: "課題を認識し、解決策を探し始めた段階" },
      { key: "interest_kw", label: "興味・関心段階の検索KW", placeholder: "この段階で検索しそうなキーワード" },
      { key: "comparison_needs", label: "比較・検討段階のニーズ", placeholder: "具体的なサービスを比較検討している段階" },
      { key: "comparison_kw", label: "比較・検討段階の検索KW", placeholder: "この段階で検索しそうなキーワード" },
      { key: "action_needs", label: "行動段階のニーズ", placeholder: "問い合わせ・予約・購入を決断する段階" },
      { key: "content_purpose", label: "各段階のコンテンツ目的", placeholder: "各段階でどんなコンテンツを用意すべきか" }
    ]
  }
};

// ワークシートページ描画
function renderWorksheets() {
  const container = document.getElementById('worksheet-list');
  if (!container) return;

  container.innerHTML = Object.entries(WORKSHEET_TEMPLATES).map(([wsType, template]) => {
    const ws = worksheets.find(w => w.type === wsType);
    const wsStatus = ws ? ws.status : null;
    const hasFeedback = ws && ws.feedback;

    let statusHtml = '';
    if (wsStatus === 'submitted') {
      statusHtml = `<div class="status-approved px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><i data-lucide="check-circle-2" width="12"></i>提出済み</div>`;
    } else if (wsStatus === 'draft') {
      statusHtml = `<div class="status-pending px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><i data-lucide="edit-3" width="12"></i>下書き</div>`;
    }

    return `
      <div class="bg-white rounded-2xl border-2 ${wsStatus === 'submitted' ? 'border-emerald-200' : 'border-slate-100'} p-5 hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="font-bold text-lg text-slate-800">${template.name}</h3>
            <p class="text-xs text-slate-400 mt-1">${template.description}</p>
          </div>
          ${statusHtml}
        </div>
        <div class="flex items-center gap-4 mb-4 text-xs text-slate-500">
          <span class="flex items-center gap-1"><i data-lucide="list" width="12"></i> ${template.fields.length}項目</span>
          ${hasFeedback ? `<span class="flex items-center gap-1 text-amber-600 font-bold"><i data-lucide="message-circle" width="12"></i> フィードバックあり</span>` : ''}
          ${ws ? `<span class="flex items-center gap-1"><i data-lucide="clock" width="12"></i> ${timeAgo(ws.updated_at)}</span>` : ''}
        </div>
        <button onclick="openWorksheet('${wsType}')" class="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${wsStatus === 'submitted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100' : wsStatus === 'draft' ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100' : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:brightness-110'} text-sm">
          <i data-lucide="${wsStatus === 'submitted' ? 'eye' : wsStatus === 'draft' ? 'edit-3' : 'clipboard-edit'}" width="16"></i>
          ${wsStatus === 'submitted' ? '内容を確認' : wsStatus === 'draft' ? '続きを書く' : '入力する'}
        </button>
      </div>`;
  }).join('');

  lucide.createIcons();
}

// ワークシートモーダルを開く
function openWorksheet(wsType) {
  currentWsType = wsType;
  const template = WORKSHEET_TEMPLATES[wsType];
  if (!template) return;

  const ws = worksheets.find(w => w.type === wsType);
  const existingData = ws ? (ws.content || {}) : {};
  const isSubmitted = ws && ws.status === 'submitted';

  // ワークシートモーダルのタイトルとラベルを設定
  const titleEl = document.getElementById('worksheet-title');
  if (titleEl) titleEl.textContent = template.name;
  const labelEl = document.getElementById('worksheet-type-label');
  if (labelEl) labelEl.textContent = template.description;

  // 静的フッターボタンの表示/非表示を制御
  const draftBtn = document.getElementById('worksheet-draft-btn');
  const submitBtn = document.getElementById('worksheet-submit-btn');
  if (draftBtn) draftBtn.style.display = isSubmitted ? 'none' : 'flex';
  if (submitBtn) submitBtn.style.display = isSubmitted ? 'none' : 'flex';

  // フィードバック表示
  const feedbackArea = document.getElementById('worksheet-feedback');
  if (feedbackArea) {
    if (ws && ws.feedback) {
      feedbackArea.classList.remove('hidden');
      document.getElementById('worksheet-feedback-text').textContent = ws.feedback;
      const dateEl = document.getElementById('worksheet-feedback-date');
      if (dateEl) dateEl.textContent = ws.updated_at ? timeAgo(ws.updated_at) : '';
    } else {
      feedbackArea.classList.add('hidden');
    }
  }

  const content = document.getElementById('worksheet-fields');
  content.innerHTML = `
    <div class="space-y-5">
      ${template.fields.map(field => `
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">${field.label}</label>
          <textarea
            id="ws-field-${field.key}"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-y"
            rows="3"
            placeholder="${field.placeholder}"
            ${isSubmitted ? 'readonly' : ''}
          >${escapeHtml(existingData[field.key] || '')}</textarea>
        </div>
      `).join('')}
    </div>
  `;

  const modal = document.getElementById('worksheet-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

// ワークシートモーダルを閉じる
function closeWorksheet() {
  const modal = document.getElementById('worksheet-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
// HTMLのonclickから呼ばれるエイリアス
function closeWorksheetModal() { closeWorksheet(); }
// HTMLの静的ボタンから呼ばれるワークシート操作
function saveWorksheetDraft() { if (currentWsType) saveWorksheet(currentWsType, 'draft'); }
function submitWorksheet() { if (currentWsType) saveWorksheet(currentWsType, 'submitted'); }

// ワークシートを保存
async function saveWorksheet(wsType, status) {
  const template = WORKSHEET_TEMPLATES[wsType];
  const contentData = {};

  template.fields.forEach(field => {
    const el = document.getElementById(`ws-field-${field.key}`);
    if (el) contentData[field.key] = el.value.trim();
  });

  // 提出時のバリデーション
  if (status === 'submitted') {
    const hasEmpty = template.fields.some(field => !contentData[field.key]);
    if (hasEmpty) {
      showNotificationCustom('全ての項目を入力してから提出してください', 'error');
      return;
    }
  }

  const ws = worksheets.find(w => w.type === wsType);

  if (ws) {
    // 更新
    const { error } = await supabase.from('worksheets').update({
      content: contentData,
      status: status,
      updated_at: new Date().toISOString()
    }).eq('id', ws.id);
    if (error) { showNotificationCustom('保存に失敗しました', 'error'); console.error(error); return; }
    ws.content = contentData;
    ws.status = status;
    ws.updated_at = new Date().toISOString();
  } else {
    // 新規作成
    const { data, error } = await supabase.from('worksheets').insert({
      user_id: currentUser.id,
      type: wsType,
      content: contentData,
      status: status,
      updated_at: new Date().toISOString()
    }).select().single();
    if (error) { showNotificationCustom('保存に失敗しました', 'error'); console.error(error); return; }
    worksheets.push(data);
  }

  closeWorksheet();
  showNotificationCustom(
    status === 'submitted' ? `「${template.name}」を提出しました！` : `「${template.name}」を下書き保存しました`,
    status === 'submitted' ? 'success' : 'info'
  );
  if (status === 'submitted') triggerConfetti();
  renderWorksheets();
  renderAll();
}

// ============================================
// ツール一覧機能
// ============================================
function renderTools() {
  const container = document.getElementById('tools-grid');
  if (!container) return;

  // 検索フィルタの値を取得（検索ボックスが存在する場合のみ）
  const searchInput = document.getElementById('tools-search');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

  // カテゴリごとにグループ化
  const grouped = {};
  TOOLS_DATA.forEach(tool => {
    if (!grouped[tool.category]) grouped[tool.category] = [];
    // 検索フィルタ
    if (searchTerm) {
      const match = tool.name.toLowerCase().includes(searchTerm) ||
                    tool.description.toLowerCase().includes(searchTerm) ||
                    tool.category.toLowerCase().includes(searchTerm);
      if (!match) return;
    }
    grouped[tool.category].push(tool);
  });

  // 空の場合
  const totalVisible = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
  if (totalVisible === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <i data-lucide="search-x" width="40" class="mx-auto text-slate-200 mb-3"></i>
        <p class="text-slate-400 font-bold">該当するツールがありません</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  container.innerHTML = Object.entries(grouped).map(([category, tools]) => {
    if (tools.length === 0) return '';
    return `
      <div class="mb-6">
        <h3 class="font-bold text-sm text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
          <i data-lucide="folder" width="14"></i> ${category}
          <span class="text-xs text-slate-300">(${tools.length})</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${tools.map(tool => `
            <a href="${tool.url}" target="_blank" rel="noopener noreferrer"
               class="bg-white rounded-xl border border-slate-200/50 p-4 hover:shadow-lg hover:border-indigo-200 transition-all group">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-500 flex-shrink-0 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                  <i data-lucide="external-link" width="16"></i>
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">${escapeHtml(tool.name)}</h4>
                  <p class="text-xs text-slate-400 mt-1 line-clamp-2">${escapeHtml(tool.description)}</p>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  lucide.createIcons();
}

// ============================================
// リーダーボード
// ============================================
async function loadLeaderboard() {
  const { data: profiles } = await supabase.from('profiles').select('id, display_name, department');
  const { data: allProgress } = await supabase.from('skill_progress').select('user_id, skill_id, status');
  if (!profiles || !allProgress) return;
  const leaderboard = profiles.map(p => {
    const approved = allProgress.filter(sp => sp.user_id === p.id && sp.status === 'approved');
    const totalXp = approved.reduce((sum, sp) => {
      const skill = SKILL_DATA.find(s => s.id === sp.skill_id);
      return sum + (skill ? skill.xp : 0);
    }, 0);
    return { ...p, totalXp, completedCount: approved.length };
  }).sort((a, b) => b.totalXp - a.totalXp);

  const container = document.getElementById('leaderboard-list');
  if (leaderboard.length === 0) {
    container.innerHTML = '<div class="p-12 text-center text-slate-300"><i data-lucide="ghost" width="40" class="mx-auto mb-3"></i><p>まだ参加者がいません</p></div>';
    lucide.createIcons();
    return;
  }
  container.innerHTML = leaderboard.map((user, i) => {
    const rankIcon = i === 0 ? '<span class="text-2xl">🥇</span>' : i === 1 ? '<span class="text-2xl">🥈</span>' : i === 2 ? '<span class="text-2xl">🥉</span>' : `<span class="text-slate-400 font-black text-lg">${i + 1}</span>`;
    const isMe = user.id === currentUser.id;
    return `
      <div class="flex items-center gap-4 px-6 py-5 ${isMe ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50' : 'hover:bg-slate-50/50'} transition-all">
        <div class="w-10 text-center">${rankIcon}</div>
        <div class="w-11 h-11 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">${user.display_name.charAt(0)}</div>
        <div class="flex-grow">
          <div class="font-bold text-sm ${isMe ? 'text-indigo-700' : 'text-slate-800'}">${escapeHtml(user.display_name)} ${isMe ? '<span class="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold ml-1">YOU</span>' : ''}</div>
          <div class="text-xs text-slate-400 mt-0.5">${user.completedCount}/${SKILL_DATA.length} クエスト承認済み</div>
        </div>
        <div class="text-right">
          <div class="font-black text-xl text-slate-700">${user.totalXp}</div>
          <div class="text-[10px] text-slate-300 font-bold">XP</div>
        </div>
      </div>`;
  }).join('');
  lucide.createIcons();
}

// ============================================
// ページ切替
// ============================================
function switchPage(page) {
  currentPage = page;
  const pages = ['quests', 'tests', 'worksheets', 'tools', 'leaderboard', 'badges'];
  pages.forEach(p => {
    const view = document.getElementById(`view-${p}`);
    if (view) view.classList.toggle('hidden', p !== page);
    const btn = document.getElementById(`page-${p}`);
    if (btn) {
      btn.className = p === page
        ? 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-slate-800 text-white shadow-md whitespace-nowrap'
        : 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-white text-slate-400 hover:bg-slate-50 border border-slate-200/50 whitespace-nowrap';
    }
  });

  // ページ固有のロード処理
  if (page === 'leaderboard') loadLeaderboard();
  if (page === 'tests') renderTests();
  if (page === 'worksheets') renderWorksheets();
  if (page === 'tools') renderTools();

  lucide.createIcons();
}

// ============================================
// 申請フロー
// ============================================
function setupDropZone() {
  const zone = document.getElementById('image-drop-zone');
  if (!zone) return;
  zone.addEventListener('click', () => document.getElementById('evidence-file').click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('border-indigo-400', 'bg-indigo-50/50'); });
  zone.addEventListener('dragleave', () => { zone.classList.remove('border-indigo-400', 'bg-indigo-50/50'); });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('border-indigo-400', 'bg-indigo-50/50');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) { selectedFile = file; showImagePreview(file); }
  });
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) { selectedFile = file; showImagePreview(file); }
}

function showImagePreview(file) {
  const area = document.getElementById('image-preview-area');
  const reader = new FileReader();
  reader.onload = e => {
    area.innerHTML = `
      <div class="relative inline-block">
        <img src="${e.target.result}" class="max-h-32 rounded-xl border border-slate-200 shadow-sm mx-auto">
        <button onclick="removeImage(event)" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md">✕</button>
      </div>
      <p class="text-xs text-slate-400 mt-2">${file.name}</p>`;
  };
  reader.readAsDataURL(file);
}

function removeImage(e) {
  e.stopPropagation();
  selectedFile = null;
  document.getElementById('evidence-file').value = '';
  document.getElementById('image-preview-area').innerHTML = `
    <i data-lucide="image-plus" width="32" class="mx-auto text-slate-300 mb-2"></i>
    <p class="text-sm text-slate-400">クリックまたはドラッグ&ドロップ</p>
    <p class="text-xs text-slate-300 mt-1">JPG, PNG, GIF (最大5MB)</p>`;
  lucide.createIcons();
}

function openMemo(skillId) {
  pendingSkillId = skillId;
  const skill = SKILL_DATA.find(s => s.id === skillId);
  const existing = completedSkills.find(p => p.skill_id === skillId);

  document.getElementById('memo-skill-name').textContent = `「${skill.skillName}」の完了を申請します`;
  document.getElementById('memo-text').value = existing ? existing.memo || '' : '';
  selectedFile = null;
  document.getElementById('evidence-file').value = '';
  document.getElementById('image-preview-area').innerHTML = `
    <i data-lucide="image-plus" width="32" class="mx-auto text-slate-300 mb-2"></i>
    <p class="text-sm text-slate-400">クリックまたはドラッグ&ドロップ</p>
    <p class="text-xs text-slate-300 mt-1">JPG, PNG, GIF (最大5MB)</p>`;

  const modal = document.getElementById('memo-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

function cancelMemo() {
  pendingSkillId = null;
  selectedFile = null;
  const modal = document.getElementById('memo-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function confirmComplete() {
  if (!pendingSkillId) return;
  const btn = document.getElementById('submit-quest-btn');
  btn.disabled = true;
  btn.innerHTML = '<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 送信中...';

  const skillId = pendingSkillId;
  const memo = document.getElementById('memo-text').value.trim();
  let imageUrl = '';

  // 画像アップロード
  if (selectedFile) {
    imageUrl = await uploadEvidence(selectedFile, currentUser.id, skillId);
    if (!imageUrl) {
      showNotificationCustom('画像のアップロードに失敗しました', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="send" width="16"></i> 申請する';
      lucide.createIcons();
      return;
    }
  }

  cancelMemo();

  // 差し戻しの場合は既存レコードを削除
  const existing = completedSkills.find(p => p.skill_id === skillId);
  if (existing) {
    await supabase.from('skill_progress').delete().eq('user_id', currentUser.id).eq('skill_id', skillId);
  }

  // DB保存
  const { error } = await supabase.from('skill_progress').insert({
    user_id: currentUser.id,
    skill_id: skillId,
    memo,
    image_url: imageUrl,
    status: 'pending',
    completed_at: new Date().toISOString()
  });

  btn.disabled = false;
  btn.innerHTML = '<i data-lucide="send" width="16"></i> 申請する';

  if (error) {
    console.error('Save error:', error);
    showNotificationCustom('申請に失敗しました', 'error');
    lucide.createIcons();
    return;
  }

  completedSkills = completedSkills.filter(p => p.skill_id !== skillId);
  completedSkills.push({ skill_id: skillId, memo, image_url: imageUrl, status: 'pending', completed_at: new Date().toISOString(), feedback: '' });

  const skill = SKILL_DATA.find(s => s.id === skillId);
  showNotificationCustom(`「${skill.skillName}」の完了申請を送信しました！マネージャーの承認をお待ちください。`, 'success');
  triggerConfetti();
  renderAll();
}

// ============================================
// 通知
// ============================================
function showNotificationCustom(message, type) {
  const container = document.getElementById('notification-area');
  const notif = document.createElement('div');
  const config = {
    success: { border: 'border-emerald-400', bg: 'bg-emerald-50', icon: 'check-circle', iconColor: 'text-emerald-500' },
    error: { border: 'border-red-400', bg: 'bg-red-50', icon: 'alert-circle', iconColor: 'text-red-500' },
    info: { border: 'border-indigo-400', bg: 'bg-indigo-50', icon: 'info', iconColor: 'text-indigo-500' }
  }[type] || { border: 'border-slate-400', bg: 'bg-white', icon: 'bell', iconColor: 'text-slate-500' };

  notif.className = `animate-bounce-in ${config.bg} border-l-4 ${config.border} shadow-xl rounded-r-2xl p-4 flex items-start gap-3 pointer-events-auto`;
  notif.innerHTML = `
    <div class="${config.iconColor} mt-0.5"><i data-lucide="${config.icon}" width="18"></i></div>
    <p class="text-sm text-slate-700 leading-relaxed flex-grow">${message}</p>
    <button onclick="this.parentElement.remove()" class="text-slate-300 hover:text-slate-500 transition-colors"><i data-lucide="x" width="14"></i></button>`;
  container.appendChild(notif);
  lucide.createIcons();
  setTimeout(() => notif.remove(), 5000);
}

// ============================================
// 紙吹雪
// ============================================
function triggerConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div');
    c.className = 'animate-confetti';
    c.style.left = Math.random() * 100 + '%';
    c.style.top = '-10%';
    c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    c.style.width = (6 + Math.random() * 8) + 'px';
    c.style.height = (6 + Math.random() * 8) + 'px';
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    container.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

// ============================================
// ログアウト
// ============================================
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = './index.html';
}
