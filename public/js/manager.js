// ============================================
// マネージャーダッシュボード (manager.html)
// CS新人育成版 - テスト結果・ワークシート・実力可視化
// ============================================

let mgUser = null;
let mgProfile = null;
let myMembers = [];
let allProgress = [];
let allTestResults = [];
let allWorksheets = [];
let currentManagerTab = 'pending';
let reviewTarget = null; // { progress, profile, skill }

(async () => {
  const result = await requireManager();
  if (!result) return;
  mgUser = result.user;
  mgProfile = result.profile;

  await loadManagerData();
  renderManagerDashboard();
  document.getElementById('loading-screen').style.display = 'none';
  lucide.createIcons();
})();

// ============================================
// データ読み込み
// ============================================
async function loadManagerData() {
  // 自分が担当するメンバーを取得
  const { data: members } = await supabase
    .from('profiles')
    .select('*')
    .eq('manager_id', mgUser.id);
  myMembers = members || [];

  // メンバーIDリスト
  const memberIds = myMembers.map(m => m.id);

  if (memberIds.length > 0) {
    // スキル進捗
    const { data: progress } = await supabase
      .from('skill_progress')
      .select('*')
      .in('user_id', memberIds)
      .order('completed_at', { ascending: false });
    allProgress = progress || [];

    // テスト結果
    const { data: tests } = await supabase
      .from('test_results')
      .select('*')
      .in('user_id', memberIds)
      .order('completed_at', { ascending: false });
    allTestResults = tests || [];

    // ワークシート
    const { data: ws } = await supabase
      .from('worksheets')
      .select('*')
      .in('user_id', memberIds)
      .order('updated_at', { ascending: false });
    allWorksheets = ws || [];
  } else {
    allProgress = [];
    allTestResults = [];
    allWorksheets = [];
  }
}

// ============================================
// メインレンダリング
// ============================================
function renderManagerDashboard() {
  renderManagerStats();
  renderPendingList();
  renderMembersList();
  renderHistoryList();
  renderTestResultsList();
  renderWorksheetsList();
  populateVizMemberSelect();
  lucide.createIcons();
}

// ============================================
// 統計カード
// ============================================
function renderManagerStats() {
  const pending = allProgress.filter(p => p.status === 'pending');
  const approved = allProgress.filter(p => p.status === 'approved');
  const rejected = allProgress.filter(p => p.status === 'rejected');

  const stats = [
    { label: '担当メンバー', value: myMembers.length, icon: 'users', color: 'indigo' },
    { label: '承認待ち', value: pending.length, icon: 'clock', color: 'amber' },
    { label: '承認済み', value: approved.length, icon: 'check-circle-2', color: 'emerald' },
    { label: '差し戻し', value: rejected.length, icon: 'x-circle', color: 'rose' }
  ];

  document.getElementById('pending-count-badge').textContent = pending.length;

  document.getElementById('manager-stats').innerHTML = stats.map(s => `
    <div class="bg-white rounded-2xl border border-slate-200/50 p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-10 h-10 bg-${s.color}-100 rounded-xl flex items-center justify-center text-${s.color}-500">
          <i data-lucide="${s.icon}" width="18"></i>
        </div>
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${s.label}</span>
      </div>
      <div class="text-3xl font-black text-slate-800">${s.value}</div>
    </div>
  `).join('');
}

// ============================================
// 承認待ちリスト
// ============================================
function renderPendingList() {
  const container = document.getElementById('view-pending');
  const pending = allProgress.filter(p => p.status === 'pending');

  if (pending.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200/50 p-12 text-center">
        <i data-lucide="inbox" width="48" class="mx-auto text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-bold">承認待ちの申請はありません</p>
        <p class="text-xs text-slate-300 mt-1">メンバーがクエストを完了申請すると、ここに表示されます</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="space-y-4">
      ${pending.map(p => {
        const member = myMembers.find(m => m.id === p.user_id);
        const skill = SKILL_DATA.find(s => s.id === p.skill_id);
        if (!member || !skill) return '';
        const style = CATEGORIES[skill.category];
        return `
          <div class="bg-white rounded-2xl border-2 border-amber-200/50 p-5 hover:shadow-lg transition-all cursor-pointer" onclick="openReview('${p.user_id}', ${p.skill_id})">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                ${member.display_name.charAt(0)}
              </div>
              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="font-bold text-slate-800">${escapeHtml(member.display_name)}</span>
                  <span class="status-pending px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <i data-lucide="clock" width="10"></i> 承認待ち
                  </span>
                  <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${style.bgLight} ${style.color}">${style.description}</span>
                </div>
                <h4 class="font-bold text-indigo-600">${skill.skillName}</h4>
                <p class="text-xs text-slate-400 mt-1">${timeAgo(p.completed_at)} に申請</p>
                ${p.memo ? `<p class="text-sm text-slate-600 mt-2 line-clamp-2">${escapeHtml(p.memo)}</p>` : ''}
                ${p.image_url ? `<div class="mt-2"><img src="${p.image_url}" class="h-16 rounded-lg border border-slate-200 object-cover" alt="evidence"></div>` : ''}
              </div>
              <div class="flex-shrink-0 text-slate-300">
                <i data-lucide="chevron-right" width="20"></i>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ============================================
// メンバー一覧（実力可視化つき）
// ============================================
function renderMembersList() {
  const container = document.getElementById('view-members');

  if (myMembers.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200/50 p-12 text-center">
        <i data-lucide="user-x" width="48" class="mx-auto text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-bold">担当メンバーがいません</p>
        <p class="text-xs text-slate-300 mt-1">管理者にメンバーの割り当てを依頼してください</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${myMembers.map(member => {
        const memberProgress = allProgress.filter(p => p.user_id === member.id);
        const approved = memberProgress.filter(p => p.status === 'approved');
        const pending = memberProgress.filter(p => p.status === 'pending');
        const totalXp = approved.reduce((sum, p) => {
          const skill = SKILL_DATA.find(s => s.id === p.skill_id);
          return sum + (skill ? skill.xp : 0);
        }, 0);
        const pct = Math.round((approved.length / SKILL_DATA.length) * 100);

        // テスト成績サマリー
        const memberTests = allTestResults.filter(t => t.user_id === member.id);
        const testIds = Object.keys(TEST_DATA);
        const passedTests = testIds.filter(tid =>
          memberTests.some(t => t.test_id === tid && t.passed)
        );
        const totalTests = testIds.length;
        const passedCount = passedTests.length;

        // 平均正答率
        const allScores = memberTests.map(t => t.percentage !== undefined ? t.percentage : t.score);
        const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;

        // 一発合格率
        const firstAttemptPassed = testIds.filter(tid => {
          const first = memberTests.find(t => t.test_id === tid && t.attempt_number === 1);
          return first && first.passed;
        });
        const firstPassRate = passedCount > 0 ? Math.round((firstAttemptPassed.length / passedCount) * 100) : 0;

        return `
          <div class="bg-white rounded-2xl border border-slate-200/50 p-5 hover:shadow-lg transition-all">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                ${member.display_name.charAt(0)}
              </div>
              <div>
                <h3 class="font-bold text-slate-800">${escapeHtml(member.display_name)}</h3>
                <p class="text-xs text-slate-400">${escapeHtml(member.department || 'カスタマーサクセス部')}</p>
              </div>
              <div class="ml-auto text-right">
                <div class="text-2xl font-black text-slate-700">${totalXp}</div>
                <div class="text-[10px] text-slate-300 font-bold">XP</div>
              </div>
            </div>

            <!-- クエスト進捗 -->
            <div class="flex items-center gap-3 mb-3">
              <div class="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style="width:${pct}%"></div>
              </div>
              <span class="text-xs font-bold text-slate-500">${pct}%</span>
            </div>
            <div class="flex gap-3 text-xs mb-4">
              <span class="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-bold">
                <i data-lucide="check-circle-2" width="12"></i> ${approved.length} 承認
              </span>
              <span class="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg font-bold">
                <i data-lucide="clock" width="12"></i> ${pending.length} 待ち
              </span>
              <span class="text-slate-400">${approved.length}/${SKILL_DATA.length} 達成</span>
            </div>

            <!-- テスト成績サマリー -->
            <div class="bg-violet-50/50 rounded-xl p-3 border border-violet-100/50 mb-4">
              <div class="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <i data-lucide="file-question" width="10"></i> テスト成績
              </div>
              <div class="flex gap-4 text-xs">
                <div>
                  <span class="text-slate-400">合格:</span>
                  <span class="font-bold text-slate-700">${passedCount}/${totalTests}</span>
                </div>
                <div>
                  <span class="text-slate-400">平均:</span>
                  <span class="font-bold text-slate-700">${avgScore}%</span>
                </div>
                <div>
                  <span class="text-slate-400">一発合格率:</span>
                  <span class="font-bold ${firstPassRate >= 80 ? 'text-emerald-600' : 'text-slate-700'}">${firstPassRate}%</span>
                </div>
              </div>
            </div>

            <!-- カテゴリ別ミニバー -->
            <div class="space-y-1.5">
              ${Object.entries(CATEGORIES).map(([catName, style]) => {
                const catSkills = SKILL_DATA.filter(s => s.category === catName);
                const catApproved = approved.filter(p => catSkills.some(s => s.id === p.skill_id));
                const catPct = Math.round((catApproved.length / catSkills.length) * 100);
                return `
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] font-bold ${style.color} w-20 uppercase tracking-wider">${style.description}</span>
                    <div class="flex-grow h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full ${style.bgColor} rounded-full" style="width:${catPct}%"></div>
                    </div>
                    <span class="text-[10px] text-slate-400 w-8 text-right">${catPct}%</span>
                  </div>`;
              }).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ============================================
// 承認履歴
// ============================================
function renderHistoryList() {
  const container = document.getElementById('view-history');
  const reviewed = allProgress.filter(p => p.status === 'approved' || p.status === 'rejected')
    .sort((a, b) => new Date(b.reviewed_at || b.completed_at) - new Date(a.reviewed_at || a.completed_at));

  if (reviewed.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200/50 p-12 text-center">
        <i data-lucide="clock" width="48" class="mx-auto text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-bold">まだ承認履歴がありません</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-200/50 overflow-hidden">
      <div class="divide-y divide-slate-100">
        ${reviewed.slice(0, 50).map(p => {
          const member = myMembers.find(m => m.id === p.user_id);
          const skill = SKILL_DATA.find(s => s.id === p.skill_id);
          if (!member || !skill) return '';
          const isApproved = p.status === 'approved';
          return `
            <div class="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-all">
              <div class="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">${member.display_name.charAt(0)}</div>
              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm text-slate-800">${escapeHtml(member.display_name)}</span>
                  <span class="text-xs text-slate-400">${skill.skillName}</span>
                </div>
                ${p.feedback ? `<p class="text-xs text-slate-400 mt-0.5 truncate">${escapeHtml(p.feedback)}</p>` : ''}
              </div>
              <div class="${isApproved ? 'status-approved' : 'status-rejected'} px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <i data-lucide="${isApproved ? 'check-circle-2' : 'x-circle'}" width="10"></i>
                ${isApproved ? '承認' : '差し戻し'}
              </div>
              <span class="text-xs text-slate-300">${timeAgo(p.reviewed_at || p.completed_at)}</span>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ============================================
// テスト結果タブ
// ============================================
function renderTestResultsList() {
  const container = document.getElementById('view-test-results');
  if (!container) return;

  if (allTestResults.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200/50 p-12 text-center">
        <i data-lucide="file-question" width="48" class="mx-auto text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-bold">まだテスト結果がありません</p>
        <p class="text-xs text-slate-300 mt-1">メンバーがテストを受験すると、ここに表示されます</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="bg-white rounded-3xl border border-slate-200/50 overflow-hidden">
      <div class="divide-y divide-slate-100">
        ${allTestResults.slice(0, 100).map(t => {
          const member = myMembers.find(m => m.id === t.user_id);
          if (!member) return '';
          const testInfo = TEST_DATA[t.test_id];
          const testName = testInfo ? testInfo.name : t.test_id;
          const isFirstAttemptPass = t.attempt_number === 1 && t.passed;

          return `
            <div class="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-all">
              <div class="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">
                ${member.display_name.charAt(0)}
              </div>
              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-bold text-sm text-slate-800">${escapeHtml(member.display_name)}</span>
                  <span class="text-xs text-slate-400">${testName}</span>
                  ${isFirstAttemptPass ? '<span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">一発合格</span>' : ''}
                </div>
                <div class="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span>第${t.attempt_number}回</span>
                  <span>${timeAgo(t.completed_at)}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-black ${t.passed ? 'text-emerald-600' : 'text-red-500'}">${t.percentage !== undefined ? t.percentage : t.score}%</div>
              </div>
              <div class="${t.passed ? 'status-approved' : 'status-rejected'} px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <i data-lucide="${t.passed ? 'check-circle-2' : 'x-circle'}" width="10"></i>
                ${t.passed ? '合格' : '不合格'}
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ============================================
// ワークシートタブ
// ============================================
function renderWorksheetsList() {
  const container = document.getElementById('view-worksheets-mgr');
  if (!container) return;

  // 提出済みのみ表示
  const submitted = allWorksheets.filter(w => w.status === 'submitted');

  if (submitted.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200/50 p-12 text-center">
        <i data-lucide="clipboard-list" width="48" class="mx-auto text-slate-200 mb-4"></i>
        <p class="text-slate-400 font-bold">提出済みのワークシートがありません</p>
        <p class="text-xs text-slate-300 mt-1">メンバーがワークシートを提出すると、ここに表示されます</p>
      </div>`;
    return;
  }

  // ワークシートテンプレート定義（表示名用）
  const wsNames = {
    self_analysis: "自己分析ワークシート",
    logic_tree: "ロジックツリーワークシート",
    "3c_analysis": "3C分析ワークシート",
    customer_journey: "カスタマージャーニーマップ"
  };

  container.innerHTML = `
    <div class="space-y-4">
      ${submitted.map(ws => {
        const member = myMembers.find(m => m.id === ws.user_id);
        if (!member) return '';
        const wsName = wsNames[ws.type] || ws.type;

        return `
          <div class="bg-white rounded-2xl border border-slate-200/50 p-5 hover:shadow-lg transition-all cursor-pointer" onclick="openWorksheetReview('${ws.id}')">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                ${member.display_name.charAt(0)}
              </div>
              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span class="font-bold text-slate-800">${escapeHtml(member.display_name)}</span>
                  <span class="status-approved px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <i data-lucide="check-circle-2" width="10"></i> 提出済み
                  </span>
                </div>
                <h4 class="font-bold text-indigo-600">${wsName}</h4>
                <p class="text-xs text-slate-400 mt-1">${timeAgo(ws.updated_at)} に提出</p>
                ${ws.feedback ? `<p class="text-xs text-amber-600 mt-1">フィードバック済み</p>` : `<p class="text-xs text-rose-400 mt-1">フィードバック未記入</p>`}
              </div>
              <div class="flex-shrink-0 text-slate-300">
                <i data-lucide="chevron-right" width="20"></i>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ワークシートレビューモーダル
function openWorksheetReview(worksheetId) {
  const ws = allWorksheets.find(w => w.id === worksheetId);
  if (!ws) return;

  const member = myMembers.find(m => m.id === ws.user_id);
  if (!member) return;

  const wsNames = {
    self_analysis: "自己分析ワークシート",
    logic_tree: "ロジックツリーワークシート",
    "3c_analysis": "3C分析ワークシート",
    customer_journey: "カスタマージャーニーマップ"
  };

  // フィールドラベル定義
  const fieldLabels = {
    self_analysis: {
      childhood: "幼少期（0〜12歳）", teenage: "中学〜高校時代", university: "大学・専門学校時代",
      work_history: "社会人経験（前職含む）", strengths: "自分の強み", weaknesses: "自分の弱み・課題",
      values: "大切にしている価値観", future_goals: "将来の目標"
    },
    logic_tree: {
      theme: "テーマ（解決したい課題）", branch1_title: "大分類①", branch1_detail: "大分類①の詳細・要因",
      branch2_title: "大分類②", branch2_detail: "大分類②の詳細・要因", branch3_title: "大分類③",
      branch3_detail: "大分類③の詳細・要因", conclusion: "まとめ・優先的に取り組むべきこと"
    },
    "3c_analysis": {
      target_company: "分析対象の企業名/業種", customer_needs: "Customer：ニーズ・課題",
      customer_behavior: "Customer：行動特性", company_strength: "Company：強み",
      company_weakness: "Company：弱み・課題", competitor_who: "Competitor：主な競合",
      competitor_analysis: "Competitor：競合の戦略と差別化", strategy: "導き出した戦略・方針"
    },
    customer_journey: {
      target_persona: "ターゲットペルソナ（顧客層）", awareness_needs: "認知段階のニーズ",
      awareness_kw: "認知段階の検索KW", interest_needs: "興味・関心段階のニーズ",
      interest_kw: "興味・関心段階の検索KW", comparison_needs: "比較・検討段階のニーズ",
      comparison_kw: "比較・検討段階の検索KW", action_needs: "行動段階のニーズ",
      content_purpose: "各段階のコンテンツ目的"
    }
  };

  const labels = fieldLabels[ws.type] || {};
  const content = ws.content || {};

  document.getElementById('ws-review-content').innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
        ${member.display_name.charAt(0)}
      </div>
      <div>
        <div class="font-bold text-slate-800">${escapeHtml(member.display_name)}</div>
        <div class="text-xs text-slate-400">${wsNames[ws.type] || ws.type}</div>
      </div>
    </div>

    <div class="space-y-4 mb-6">
      ${Object.entries(content).map(([key, value]) => `
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">${labels[key] || key}</div>
          <p class="text-sm text-slate-700 whitespace-pre-line">${escapeHtml(value)}</p>
        </div>
      `).join('')}
    </div>

    <div>
      <label class="block text-sm font-bold text-slate-700 mb-1.5">フィードバック</label>
      <textarea id="ws-feedback-text" class="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-y" rows="4" placeholder="フィードバックを入力してください">${escapeHtml(ws.feedback || '')}</textarea>
    </div>

    <div class="flex gap-3 mt-4">
      <button onclick="saveWorksheetFeedback('${ws.id}')" class="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
        <i data-lucide="send" width="14"></i> フィードバックを保存
      </button>
      <button onclick="closeWorksheetReview()" class="px-5 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
        <i data-lucide="x" width="14"></i> 閉じる
      </button>
    </div>
  `;

  const modal = document.getElementById('worksheet-review-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

function closeWorksheetReview() {
  const modal = document.getElementById('worksheet-review-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function saveWorksheetFeedback(worksheetId) {
  const feedback = document.getElementById('ws-feedback-text').value.trim();

  const { error } = await supabase
    .from('worksheets')
    .update({ feedback: feedback, updated_at: new Date().toISOString() })
    .eq('id', worksheetId);

  if (error) {
    alert('フィードバックの保存に失敗しました: ' + error.message);
    return;
  }

  // ローカルデータ更新
  const ws = allWorksheets.find(w => w.id === worksheetId);
  if (ws) ws.feedback = feedback;

  closeWorksheetReview();
  renderWorksheetsList();
  lucide.createIcons();
}

// ============================================
// タブ切替
// ============================================
function switchManagerTab(tab) {
  currentManagerTab = tab;
  const tabs = ['pending', 'members', 'history', 'test-results', 'worksheets-mgr', 'visualization'];
  tabs.forEach(t => {
    const view = document.getElementById(`view-${t}`);
    if (view) view.classList.toggle('hidden', t !== tab);
    const btn = document.getElementById(`mtab-${t}`);
    if (btn) {
      if (t === tab) {
        const colors = {
          pending: 'bg-amber-500',
          members: 'bg-indigo-600',
          history: 'bg-slate-700',
          'test-results': 'bg-violet-500',
          'worksheets-mgr': 'bg-teal-500',
          'visualization': 'bg-cyan-600'
        };
        btn.className = `px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${colors[t] || 'bg-slate-700'} text-white shadow-md flex items-center gap-1.5 whitespace-nowrap`;
      } else {
        btn.className = 'px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-white text-slate-400 border border-slate-200/50 flex items-center gap-1.5 whitespace-nowrap';
      }
    }
  });
  lucide.createIcons();
}

// ============================================
// レビューモーダル
// ============================================
function openReview(userId, skillId) {
  const progress = allProgress.find(p => p.user_id === userId && p.skill_id === skillId);
  const member = myMembers.find(m => m.id === userId);
  const skill = SKILL_DATA.find(s => s.id === skillId);
  if (!progress || !member || !skill) return;

  reviewTarget = { progress, member, skill };
  const style = CATEGORIES[skill.category];

  document.getElementById('review-feedback').value = '';
  document.getElementById('review-content').innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <div class="w-12 h-12 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
        ${member.display_name.charAt(0)}
      </div>
      <div>
        <div class="font-bold text-slate-800">${escapeHtml(member.display_name)}</div>
        <div class="text-xs text-slate-400">${timeAgo(progress.completed_at)} に申請</div>
      </div>
    </div>

    <div class="bg-gradient-to-br ${style.bgLight} rounded-2xl p-4 border ${style.border}">
      <div class="flex items-center gap-1.5 text-[10px] font-bold ${style.color} uppercase tracking-wider mb-1">
        <i data-lucide="${style.icon}" width="10"></i> ${style.description}
      </div>
      <h4 class="font-bold text-lg text-slate-800">${skill.skillName}</h4>
      <p class="text-xs text-slate-500 mt-1">+${skill.xp} XP</p>
    </div>

    <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">クリア条件</div>
      <p class="text-sm text-slate-700 whitespace-pre-line">${skill.practiceTask}</p>
    </div>

    ${progress.memo ? `
    <div class="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
      <div class="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><i data-lucide="message-square" width="10"></i> メンバーの振り返り</div>
      <p class="text-sm text-slate-700">${escapeHtml(progress.memo)}</p>
    </div>` : ''}

    ${progress.image_url ? `
    <div>
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><i data-lucide="image" width="10"></i> エビデンス</div>
      <img src="${progress.image_url}" class="w-full rounded-xl border border-slate-200 shadow-sm cursor-pointer" alt="evidence" onclick="window.open('${progress.image_url}', '_blank')">
    </div>` : '<p class="text-xs text-slate-300 italic">エビデンス画像なし</p>'}
  `;

  const modal = document.getElementById('review-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();
}

function closeReview() {
  reviewTarget = null;
  const modal = document.getElementById('review-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

async function approveQuest() {
  if (!reviewTarget) return;
  const feedback = document.getElementById('review-feedback').value.trim();

  const { error } = await supabase
    .from('skill_progress')
    .update({
      status: 'approved',
      approved_by: mgUser.id,
      feedback,
      reviewed_at: new Date().toISOString()
    })
    .eq('user_id', reviewTarget.progress.user_id)
    .eq('skill_id', reviewTarget.progress.skill_id);

  if (error) { alert('承認に失敗しました: ' + error.message); return; }

  closeReview();
  await loadManagerData();
  renderManagerDashboard();
}

async function rejectQuest() {
  if (!reviewTarget) return;
  const feedback = document.getElementById('review-feedback').value.trim();
  if (!feedback) {
    alert('差し戻しの理由をフィードバック欄に入力してください');
    return;
  }

  const { error } = await supabase
    .from('skill_progress')
    .update({
      status: 'rejected',
      approved_by: mgUser.id,
      feedback,
      reviewed_at: new Date().toISOString()
    })
    .eq('user_id', reviewTarget.progress.user_id)
    .eq('skill_id', reviewTarget.progress.skill_id);

  if (error) { alert('差し戻しに失敗しました: ' + error.message); return; }

  closeReview();
  await loadManagerData();
  renderManagerDashboard();
}

// ============================================
// 実力可視化タブ
// ============================================

// メンバー選択プルダウンを設定
function populateVizMemberSelect() {
  const select = document.getElementById('viz-member-select');
  if (!select) return;
  select.innerHTML = '<option value="">-- 選択してください --</option>' +
    myMembers.map(m => `<option value="${m.id}">${escapeHtml(m.display_name)}</option>`).join('');
}

// 実力可視化データを読み込み・描画
function loadVisualization() {
  const select = document.getElementById('viz-member-select');
  const memberId = select ? select.value : '';
  const vizContent = document.getElementById('viz-content');
  const vizEmpty = document.getElementById('viz-empty');

  if (!memberId) {
    if (vizContent) vizContent.classList.add('hidden');
    if (vizEmpty) vizEmpty.classList.remove('hidden');
    return;
  }

  if (vizContent) vizContent.classList.remove('hidden');
  if (vizEmpty) vizEmpty.classList.add('hidden');

  const member = myMembers.find(m => m.id === memberId);
  if (!member) return;

  renderScoreTrendChart(memberId);
  renderCategoryRadarChart(memberId);
  renderProgressTimeline(memberId);
  lucide.createIcons();
}

// テスト正答率の推移グラフ（SVG折れ線グラフ）
function renderScoreTrendChart(memberId) {
  const svg = document.getElementById('score-trend-chart');
  if (!svg) return;

  const memberTests = allTestResults
    .filter(t => t.user_id === memberId)
    .sort((a, b) => new Date(a.completed_at || a.created_at) - new Date(b.completed_at || b.created_at));

  if (memberTests.length === 0) {
    svg.innerHTML = '<text x="300" y="150" text-anchor="middle" fill="#94a3b8" font-size="14" font-weight="bold">テスト結果がありません</text>';
    return;
  }

  const w = 600, h = 300, pad = 50;
  const chartW = w - pad * 2, chartH = h - pad * 2;
  let html = '';

  // 背景グリッド
  for (let i = 0; i <= 4; i++) {
    const y = pad + (chartH / 4) * i;
    const label = 100 - i * 25;
    html += `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
    html += `<text x="${pad - 8}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="10">${label}%</text>`;
  }

  // データポイント
  const n = memberTests.length;
  const points = memberTests.map((t, i) => {
    const x = pad + (n === 1 ? chartW / 2 : (chartW / (n - 1)) * i);
    const pct = t.percentage !== undefined ? t.percentage : (t.total > 0 ? Math.round((t.score / t.total) * 100) : 0);
    const y = pad + chartH - (chartH * pct / 100);
    return { x, y, pct, name: (TEST_DATA[t.test_id] || {}).name || t.test_id };
  });

  // 折れ線
  if (points.length > 1) {
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    html += `<path d="${linePath}" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // ドット＋ラベル
  points.forEach(p => {
    html += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#6366f1" stroke="white" stroke-width="2"/>`;
    html += `<text x="${p.x}" y="${p.y - 12}" text-anchor="middle" fill="#334155" font-size="11" font-weight="bold">${p.pct}%</text>`;
  });

  svg.innerHTML = html;
}

// カテゴリ別達成度レーダーチャート
function renderCategoryRadarChart(memberId) {
  const svg = document.getElementById('category-radar-chart');
  if (!svg) return;

  const memberProgress = allProgress.filter(p => p.user_id === memberId && p.status === 'approved');
  const approvedIds = memberProgress.map(p => p.skill_id);

  const cx = 175, cy = 175, maxR = 130;
  const categories = Object.keys(CATEGORIES);
  const n = categories.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;
  let html = '';

  // グリッド
  for (let level = 1; level <= 4; level++) {
    const r = (maxR / 4) * level;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    html += `<polygon points="${pts.join(' ')}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`;
  }

  // 軸線
  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    html += `<line x1="${cx}" y1="${cy}" x2="${cx + maxR * Math.cos(angle)}" y2="${cy + maxR * Math.sin(angle)}" stroke="#e2e8f0" stroke-width="1"/>`;
  }

  // データ
  const dp = [];
  categories.forEach((cat, i) => {
    const catSkills = SKILL_DATA.filter(s => s.category === cat);
    const completed = catSkills.filter(s => approvedIds.includes(s.id)).length;
    const pct = catSkills.length > 0 ? completed / catSkills.length : 0;
    const r = maxR * pct;
    const angle = startAngle + i * angleStep;
    dp.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  });
  html += `<polygon points="${dp.join(' ')}" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="2.5"/>`;

  // ドット＋ラベル
  categories.forEach((cat, i) => {
    const catSkills = SKILL_DATA.filter(s => s.category === cat);
    const completed = catSkills.filter(s => approvedIds.includes(s.id)).length;
    const pct = catSkills.length > 0 ? completed / catSkills.length : 0;
    const r = maxR * pct;
    const angle = startAngle + i * angleStep;
    html += `<circle cx="${cx + r * Math.cos(angle)}" cy="${cy + r * Math.sin(angle)}" r="4" fill="#6366f1" stroke="white" stroke-width="2"/>`;
    const lx = cx + (maxR + 20) * Math.cos(angle);
    const ly = cy + (maxR + 20) * Math.sin(angle);
    const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
    html += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="middle" font-size="10" font-weight="bold" fill="#64748b">${CATEGORIES[cat].description}</text>`;
    html += `<text x="${lx}" y="${ly + 13}" text-anchor="${anchor}" dominant-baseline="middle" font-size="10" fill="#94a3b8">${Math.round(pct * 100)}%</text>`;
  });

  svg.innerHTML = html;
}

// 営業日ベースの進捗タイムライン
function renderProgressTimeline(memberId) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  const memberProgress = allProgress.filter(p => p.user_id === memberId);
  const days = [...new Set(SKILL_DATA.map(s => s.day))].sort((a, b) => a - b);

  container.innerHTML = days.map(day => {
    const daySkills = SKILL_DATA.filter(s => s.day === day);
    const dayLabel = day === 0 ? 'スキルチェック' : `Day ${day}`;
    const approvedCount = daySkills.filter(s => memberProgress.some(p => p.skill_id === s.id && p.status === 'approved')).length;
    const pendingCount = daySkills.filter(s => memberProgress.some(p => p.skill_id === s.id && p.status === 'pending')).length;
    const pct = daySkills.length > 0 ? Math.round((approvedCount / daySkills.length) * 100) : 0;

    return `
      <div class="flex items-center gap-4">
        <div class="w-20 text-right">
          <div class="text-sm font-bold text-slate-700">${dayLabel}</div>
          <div class="text-[10px] text-slate-400">${approvedCount}/${daySkills.length}</div>
        </div>
        <div class="flex-grow">
          <div class="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="w-12 text-right text-xs font-bold ${pct === 100 ? 'text-emerald-600' : 'text-slate-400'}">${pct}%</div>
        ${pendingCount > 0 ? `<span class="text-[10px] text-amber-500 font-bold">${pendingCount}件待ち</span>` : ''}
      </div>`;
  }).join('');
}

// ============================================
// ログアウト
// ============================================
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = './index.html';
}
