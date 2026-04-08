// ============================================
// CS新人育成 スキルデータ定義
// スプレッドシートから生成
// ============================================

const SKILL_DATA = [
  // ── 基礎理解・社内ルール（Day 1） ──
  { id: 1001, day: 1, category: "基礎理解・社内ルール", skillName: "CS用各種設定", priority: "高",
    objective: "会社・CS1課の理解とスムーズに実務に取りかかるための準備",
    inputTask: "SFをCS用に変更、メール初期設定、拡張機能のダウンロード、各チャットグループに招待してもらう",
    practiceTask: "全ての初期設定を完了し、動作確認する",
    links: [
      { text: "CS用各種設定", url: "https://drive.google.com/file/d/18pjnYVSs9iaT5x31m06f-hA1YrWylUVf/view?usp=drive_link" },
      { text: "CS1課初期設定テスト", url: "https://docs.google.com/forms/d/e/1FAIpQLSf655YJwmQfoAmLd3Xa4G2-Fa0UrApjO7bFO0iVLlOKcWQHiw/viewform" }
    ], testId: null, xp: 150 },

  { id: 1002, day: 1, category: "基礎理解・社内ルール", skillName: "CS1課全体ルール", priority: "高",
    objective: "CS1課のルールを正確に理解する",
    inputTask: "CS1課全体ルールの資料を読み込む",
    practiceTask: "CS1課テストに合格する（80%以上）",
    links: [
      { text: "CS1課全体ルール", url: "https://drive.google.com/file/d/1_zPcUZ90ka7ZVTPZ9izjBQbKE4A_PXXE/view?usp=drive_link" }
    ], testId: "cs1_rules",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLSeOLk9lnbPulqacpv3pCRwzf9LP5JP1_JiqKrE5Ha0Nopmw-A/viewform", xp: 150 },

  { id: 1003, day: 1, category: "基礎理解・社内ルール", skillName: "他部署とのやりとり", priority: "中",
    objective: "他部署との連携方法を理解する",
    inputTask: "他部署とのやりとりに関する資料を確認する",
    practiceTask: "各部署の役割と連絡方法を説明できるようになる",
    links: [
      { text: "他部署とのやり取りについて", url: "https://drive.google.com/file/d/1aHWSWxPzuhmUJSkZ4pv_FdVTG8EXTD5I/view?usp=drive_link" }
    ], testId: null, xp: 100 },

  { id: 1004, day: 1, category: "基礎理解・社内ルール", skillName: "AD・VCコンサルティング理解", priority: "高",
    objective: "カスタマーサクセスの役割と広告・VCコンサルティングを理解する",
    inputTask: "Ad VCコンサルティングに関する資料を学習する",
    practiceTask: "カスタマーサクセスとはテストに合格する（80%以上）",
    links: [
      { text: "Ad VCコンサルティングに関して", url: "https://drive.google.com/file/d/146k774ohCMV-BP-GFiD2qkt1Zq7TZQaX/view?usp=drive_link" }
    ], testId: "customer_success",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfEhQfjg9-UIy32GLdwCHnGUlsXcjofRM_dyBduB0SPeMo3iA/viewform", xp: 150 },

  { id: 1005, day: 1, category: "基礎理解・社内ルール", skillName: "セールスフォース記入方法", priority: "中",
    objective: "SFフレクワーク日々の記入方法をマスターする",
    inputTask: "セールスフォースフレクワーク日々記入方法.pdfを読む",
    practiceTask: "SFに正しく日報を記入できるようになる",
    links: [
      { text: "SF記入方法.pdf", url: "https://drive.google.com/file/d/16WNnS6sChlt0aT3B2VlmIPno5cuCSb5h/view?usp=drive_link" },
      { text: "動画解約フォーム", url: "https://docs.google.com/forms/d/e/1FAIpQLSdCbrBsb4M4Y_YEM4hmy0WCPumJmwqjwAQi4wXj6gQ29QMqAA/viewform" },
      { text: "外部展開依頼フォーム", url: "https://docs.google.com/forms/d/e/1FAIpQLSebfcLl3OJDb8ePTL3upMnBjaPh8F1Eq-jP5YvsSPtV9ZOocw/viewform" }
    ], testId: null, xp: 100 },

  { id: 1006, day: 1, category: "基礎理解・社内ルール", skillName: "工数登録", priority: "中",
    objective: "工数登録の仕組みと指標を理解する",
    inputTask: "工数登録についての資料を読み、指標を確認する",
    practiceTask: "工数登録を正しく行えるようになる",
    links: [
      { text: "工数登録について", url: "https://drive.google.com/file/d/1xqy-ZupifUp4XPfID3fCXgU6pI5xxd51/view?usp=drive_link" },
      { text: "工数登録の指標", url: "https://docs.google.com/document/d/1eHrh62KWxBFDMUCGc9NU5Td_99o55IvkoGIeoDUe1pU/edit?tab=t.0" },
      { text: "ファインズ工数登録用", url: "https://fines.lightning.force.com/lightning/r/fines_Delivery_of_goods__c/a092s000003JqylAAC/view" },
      { text: "販管工数登録用", url: "https://fines.lightning.force.com/lightning/r/fines_Delivery_of_goods__c/a092s000003JqygAAC/view" },
      { text: "単価工数登録用", url: "https://fines.lightning.force.com/lightning/r/fines_Delivery_of_goods__c/a092s000003JqxcAAC/view?0.source=alohaHeader" }
    ], testId: null, xp: 100 },

  { id: 1007, day: 1, category: "基礎理解・社内ルール", skillName: "入電対応", priority: "高",
    objective: "入電対応のスクリプトを理解し、適切に対応できる",
    inputTask: "入電対応について、2課対応マップ、CSE部入電対応スクリプトを確認する",
    practiceTask: "入電対応のロープレを実施し、スクリプト通りに対応できる",
    links: [
      { text: "入電対応について", url: "https://drive.google.com/file/d/1RHVSF0asc93ahJJzdX2nls2shdCGhkZw/view?usp=drive_link" },
      { text: "【CS部】入電対応スクリプト", url: "https://docs.google.com/document/d/1VNBfY5nAPQSNpoLZpYYTdB2AVOxtcaUFv2ic_AdT62c/edit?tab=t.0" },
      { text: "イラストAC", url: "https://www.ac-illust.com/" },
      { text: "フォトAC", url: "https://www.photo-ac.com/" },
      { text: "デザインAC", url: "https://www.design-ac.net/" },
      { text: "シルエットAC", url: "https://www.silhouette-ac.com/" }
    ], testId: null, xp: 150 },

  { id: 1008, day: 1, category: "基礎理解・社内ルール", skillName: "初期研修（動画・広告基礎）", priority: "高",
    objective: "ファインズの初期サービスと動画・広告の基礎を理解する",
    inputTask: "初期研修資料、動画制作研修、TikTok・Meta広告研修、AIOボット、代行プランの資料を学習する",
    practiceTask: "初期についてのテストに合格する（80%以上）",
    links: [
      { text: "商材研修フォルダ", url: "https://drive.google.com/drive/u/0/folders/1MnGYsr-KNXSuCJrCNwdRCfOOIUizsT4e" },
      { text: "動画制作に関する研修", url: "https://drive.google.com/drive/folders/1E6K86sZmjA3zVwG1ky5mnDNgzF8dcmaH" },
      { text: "TikTok・Meta広告の研修", url: "https://drive.google.com/drive/folders/19mR6pvKJ-xk3_jzY6a0Ri2MBTTKqyHBZ" },
      { text: "AIOナビについて", url: "https://drive.google.com/file/d/1rNbv9DBBX3kzsK7xqT7_v-Q95kKvnIin/view?usp=sharing" },
      { text: "AD・VCコンサルティング代行プラン（新）", url: "https://docs.google.com/presentation/d/1eZz1dkocBI-mOwskuElLUDIbBhaAQ4TeJ9Mjq1K2olA/edit?slide=id.g3b8564b59b5_0_99#slide=id.g3b8564b59b5_0_99" }
    ], testId: "initial_knowledge",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfvJgICkwPyIFqnEvTf-DZEAXwUUa00W9JEaMlJVy2IqQuY5w/viewform?usp=sharing", xp: 150 },

  // ── 社会人基礎・自己理解（Day 2） ──
  { id: 1009, day: 2, category: "社会人基礎・自己理解", skillName: "NET金額・売上構成の理解", priority: "高",
    objective: "CS業務を通じて社会人スキルの向上",
    inputTask: "ファインズの売上構成を知る。NET金額の仕組みを学ぶ",
    practiceTask: "初期料金テストに合格する（80%以上）",
    links: [
      { text: "ファインズの売り上げ構成を知ろう", url: "https://drive.google.com/file/d/1ATRjm1t3LIZD5CaL5_I7rq7sqjBlVClr/view?usp=drive_link" }
    ], testId: "initial_pricing",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfWnJm8NdkenaxpyciGuFG-RSl6228hOq0YUAtHuSW4QKd2Uw/viewform", xp: 150 },

  { id: 1010, day: 2, category: "社会人基礎・自己理解", skillName: "社会人基礎・自己分析", priority: "高",
    objective: "自己を理解し、将来の目標を定める",
    inputTask: "社会人基礎についての資料を学び、自己分析シートに記入する",
    practiceTask: "自己分析ワークシートを完成させ、チームミーティングで自分のことを発表する",
    links: [
      { text: "社会人基礎について", url: "https://drive.google.com/file/d/1nqsBHF-iU7TxgJAnb0Wkc6CgZLvqFtjO/view?usp=drive_link" },
      { text: "自己分析シート", url: "https://docs.google.com/spreadsheets/d/1jFwlvWM85wfK6ffziReHszbAetxtPZKYCwUsZoJ9Se0/edit?gid=2067574690#gid=2067574690" },
      { text: "ウミガメのスープ（チームビルディング）", url: "https://blog-knowledgequiz.com/umigame-soup/" }
    ], testId: null, worksheetType: "self_analysis", xp: 150 },

  { id: 1011, day: 2, category: "社会人基礎・自己理解", skillName: "タイピング練習", priority: "中",
    objective: "PCの業務スキルの向上",
    inputTask: "e-typingと寿司打で練習する",
    practiceTask: "研修期間中にe-typing A-、寿司打5000円コースをクリアする",
    links: [
      { text: "e-typing", url: "https://www.e-typing.ne.jp/" },
      { text: "寿司打", url: "https://sushida.net/" }
    ], testId: null, xp: 100 },

  // ── 業務フロー・ツール（Day 3, 7） ──
  { id: 1012, day: 3, category: "業務フロー・ツール", skillName: "契約フロー理解", priority: "高",
    objective: "CS業務の効率化を学ぶ",
    inputTask: "契約から条件振り分けまでの流れを学ぶ",
    practiceTask: "契約フローを正しく説明できるようになる",
    links: [
      { text: "納品フローについて", url: "https://drive.google.com/file/d/1MHJiv-cGCh_P0J4AxHJnBRUNzk1-hvYm/view?usp=drive_link" }
    ], testId: null, xp: 150 },

  { id: 1013, day: 3, category: "業務フロー・ツール", skillName: "CS業務（日程調整・NP未収）", priority: "中",
    objective: "日常のCS業務を理解する",
    inputTask: "日程調整、NP未収、研修資材に関する手順を確認する",
    practiceTask: "日程調整やNP未収対応を一人で行える",
    links: [
      { text: "日程調整＆NP未収 研修資料", url: "https://drive.google.com/file/d/17o_JDm0Myg_EGn3VxMzQ5tvsqf5Kevuf/view?usp=drive_link" }
    ], testId: null, xp: 100 },

  { id: 1014, day: 3, category: "業務フロー・ツール", skillName: "セールスフォース活用", priority: "高",
    objective: "自分の仕事がスムーズになる仕組みを作る",
    inputTask: "SFダッシュボードを活用する方法を学ぶ。フォローリストの作成、タスク管理ができるようになる",
    practiceTask: "SFでフォローリストを作成し、日々のタスク管理に活用する",
    links: [
      { text: "SFやミトコを活用しよう", url: "https://drive.google.com/file/d/1dFyCCODh6yiWW-zyNS_e9Yg6ER0thCEt/view?usp=drive_link" }
    ], testId: null, xp: 150 },

  { id: 1015, day: 7, category: "業務フロー・ツール", skillName: "Indeed広告", priority: "高",
    objective: "Indeedの概要を理解する",
    inputTask: "Indeed広告について、管理画面操作マニュアル、困ったら見るリストを確認する",
    practiceTask: "Indeedテストに合格する（80%以上）",
    links: [
      { text: "Indeed広告について", url: "https://drive.google.com/file/d/1fahDcXGh8unLyZCcPnjZcuJtArkx32AG/view?usp=drive_link" },
      { text: "Indeed管理画面操作マニュアル", url: "https://docs.google.com/presentation/d/13W4sqJexzLCbX50nKnCH451yjyWylb1QiHz5mskN3rw/edit#slide=id.p1" },
      { text: "Indeedで困ったら見るリスト", url: "https://docs.google.com/spreadsheets/d/1LlY8Av6V59LQTuHpDbRQ0EU2M3gkI-s3zeNYZYjEhTc/edit?gid=1529353543#gid=1529353543" }
    ], testId: "indeed",
    testLink: "https://forms.gle/LzB34cC1Fq9Ea4pdA", xp: 150 },

  { id: 1016, day: 7, category: "業務フロー・ツール", skillName: "業務効率化・Googleスライド", priority: "中",
    objective: "資料作成の時間を短縮できるようになる",
    inputTask: "業務効率化資料を確認。Googleスライドとパワーポイントの違いを学ぶ",
    practiceTask: "業務効率化DL後、資料内の課題（P5~7）を行い合格する",
    links: [
      { text: "Googleスライドとパワーポイントの違い", url: "https://ppt.design4u.jp/differences-between-google-slides-and-powerpoint/" },
      { text: "業務効率化", url: "https://drive.google.com/file/d/1lQ7HXQECdQwoN6FQcHGp5zCzw2W_wZah/view?usp=drive_link" },
      { text: "Googleスライド入門講座（3時間）【完全版】", url: "https://www.youtube.com/watch?v=jGRKsZKIZ_w&list=PLL3jV1gMoAAZ4_YckEPx1qBOp2ciNYh2Y" }
    ], testId: null, xp: 100 },

  { id: 1017, day: 7, category: "業務フロー・ツール", skillName: "Google Meet研修", priority: "小",
    objective: "オンラインミーティングツールを使いこなす",
    inputTask: "Google Meetの使い方動画を視聴する",
    practiceTask: "近くの人とMeetで繋いで実践する",
    links: [
      { text: "【全解説】初心者向け Google Meetの使い方", url: "https://www.youtube.com/watch?v=JBgI3ZIQp9M" }
    ], testId: null, xp: 50 },

  // ── マーケティング・思考（Day 4-5） ──
  { id: 1018, day: 4, category: "マーケティング・思考", skillName: "WEBマーケティング全体像", priority: "高",
    objective: "WEBマーケティングの全体像を体系的に理解し使えるようになる",
    inputTask: "WEBマーケティングの全体像.pdfを学習する",
    practiceTask: "WEBマーケティングの全体像を自分の言葉で説明できる",
    links: [
      { text: "WEBマーケティングの全体像", url: "https://drive.google.com/file/d/17PiLGhU3ZY7bE4dygH-CVo4bkJ5LdQ_j/view?usp=drive_link" }
    ], testId: null, xp: 150 },

  { id: 1019, day: 4, category: "マーケティング・思考", skillName: "マーケティング用語", priority: "高",
    objective: "1年目から知っておくべきマーケティング用語を習得する",
    inputTask: "マーケティング用語集を学習する",
    practiceTask: "業種用語テストに合格する（80%以上）",
    links: [
      { text: "マーケティング用語集", url: "https://ferret-one.com/blog/marketing-glossary" }
    ], testId: "industry_terms",
    testLink: "https://docs.google.com/forms/d/1abAZBPmuepmchg1bnGkToRfiYEV4-3rx_AcC2gqlwYA/viewform?edit_requested=true", xp: 150 },

  { id: 1020, day: 4, category: "マーケティング・思考", skillName: "ラテラルシンキング", priority: "中",
    objective: "水平思考を理解し、柔軟な発想力を身につける",
    inputTask: "ラテラルシンキングに関する記事を読む",
    practiceTask: "ラテラルシンキングの考え方を実例で説明できる",
    links: [
      { text: "ラテラルシンキングとは", url: "https://www.profuture.co.jp/mk/recruit/management/15731" }
    ], testId: null, xp: 100 },

  { id: 1021, day: 4, category: "マーケティング・思考", skillName: "思考研修（採用・構造化・マーケ・クリエイティブ）", priority: "高",
    objective: "4つの思考フレームワークを習得する",
    inputTask: "採用戦略思考、構造化思考、マーケティング思考、クリエイティブ思考の資料を学習する。中小企業のHP運用.pdf、論理的思考.pptxも確認する",
    practiceTask: "思考テストに合格する（80%以上）",
    links: [
      { text: "中小企業のホームページ運用.pdf", url: "https://drive.google.com/file/d/1T_gMTmTPfZpFljtBgIW43wLrLHx-IpAx/view" },
      { text: "論理的思考_新卒研修", url: "https://docs.google.com/presentation/d/16qaa0jQcAMFpOS9VcT5tVlDxinhiYnJY/edit?slide=id.p1#slide=id.p1" },
      { text: "思考研修フォルダ", url: "https://drive.google.com/drive/u/0/folders/1ZIP-yZgWVRt3YQdDIfT33Hx9TRoKNANW" },
      { text: "【ランチェスター戦略①】弱者が強者に勝つための法則", url: "https://www.youtube.com/watch?v=D1Tcw238Z-U" },
      { text: "【ランチェスター戦略②】中田がYouTubeで勝つための戦略とは？", url: "https://www.youtube.com/watch?v=zBKdqJJCbi8" },
      { text: "仮説思考について", url: "https://drive.google.com/file/d/1OC1xDteQJbeWIUk2J5LGphdTFaRn1Hul/view?usp=drive_link" }
    ], testId: "thinking",
    testLink: "https://forms.gle/f9M48VYtGcUxd5Fy5", xp: 150 },

  { id: 1022, day: 5, category: "マーケティング・思考", skillName: "ロジックツリー", priority: "高",
    objective: "4営業日の思考研修で学んだことを表に落とし込む",
    inputTask: "ロジックツリーの作り方を学び、シートに記入する",
    practiceTask: "ロジックツリーワークシートを完成させ、上長からフィードバックを受ける",
    links: [
      { text: "ロジックツリーの使い方・作り方", url: "https://logicalthinking.net/logic-tree/" },
      { text: "ロジックツリー記入例（画像）", url: "https://gyazo.com/6f7fc01e092845025f85cf08b2cb8d83" }
    ], testId: null, worksheetType: "logic_tree", xp: 150 },

  { id: 1023, day: 5, category: "マーケティング・思考", skillName: "3C分析", priority: "高",
    objective: "WEBマーケティングの3C分析を理解する",
    inputTask: "WEBマーケティングの3C分析資料を学習する。市場調査と競合分析の方法を習得する",
    practiceTask: "3C分析ワークシートを完成させる",
    links: [
      { text: "ロジックツリーの縦と横の関係", url: "https://ryosukeishii.com/logicalthinking/personal-skills/structure/2-1-%E3%83%AD%E3%82%B8%E3%83%83%E3%82%AF%E3%83%84%E3%83%AA%E3%83%BC%E7%B8%A6%E3%81%A8%E6%A8%AA%E3%81%AE%E9%96%A2%E4%BF%82/" }
    ], testId: null, worksheetType: "3c_analysis", xp: 150 },

  { id: 1024, day: 5, category: "マーケティング・思考", skillName: "1〜5営業日の総復習", priority: "高",
    objective: "1週間の振り返りと知識の定着確認",
    inputTask: "1〜5営業日の学習内容を振り返る",
    practiceTask: "1〜5営業日の確認テストに合格する（80%以上）",
    links: [], testId: "week1_review", xp: 150 },

  // ── フォロー・提案（Day 6, 15-16） ──
  { id: 1025, day: 6, category: "フォロー・提案", skillName: "挨拶連絡・ロープレ", priority: "高",
    objective: "資料の管理や展開ができるようになる。フォローの流れを知る",
    inputTask: "挨拶連絡スクリプトを確認。新顧客カルテの完全ガイドブックを読む",
    practiceTask: "挨拶連絡ロープレを実施し、6〜10営業日目で同席3件終える",
    links: [
      { text: "挨拶連絡スクリプト", url: "https://docs.google.com/document/d/1BJnLqQkLRx2hlknLUfJtsAJ54k4yDChXULD5A3bYVOM/edit?tab=t.0" },
      { text: "資料格納について", url: "https://drive.google.com/file/d/1ZI5KSdYG5eod45bT8B8Xq0LSk8tFZORi/view?usp=drive_link" },
      { text: "新顧客カルテ 完全ガイドブック", url: "https://docs.google.com/presentation/d/1_QMXN22s54vWP7MQMNuPqtKvm2wCDHogjBh_BT64pAI/edit?slide=id.g3bca5c4b8a7_0_322#slide=id.g3bca5c4b8a7_0_322" },
      { text: "議事録AIカルテ", url: "https://script.google.com/a/macros/e-tenki.co.jp/s/AKfycbz4vk2I4dAURXJglUzkkuU9JloV4SMR2_kIQtIxsNO5h6Th5KD70Us6XyivSB_JDbMT/exec" }
    ], testId: null, xp: 150 },

  { id: 1026, day: 6, category: "フォロー・提案", skillName: "資料閲覧・格納", priority: "中",
    objective: "提案資料の確認をしながら疑問点をチーム人と共有する",
    inputTask: "集客用・求人用の資料を確認する。資料格納方法を学ぶ",
    practiceTask: "資料の格納場所と使い方を正しく説明できる",
    links: [
      { text: "資料雛フォルダ", url: "https://drive.google.com/drive/u/0/folders/1K1OLNlnOK0vA8UDTDcOM7NYmFWDW9vri" },
      { text: "無償VC 各対応マニュアル資料まとめ", url: "https://docs.google.com/spreadsheets/d/18N7co17Bm8pNU0CyWhkuC6QF9fgaVZoriTmt5bz9jOs/edit?gid=0#gid=0" },
      { text: "【宗和】VC資料雛形集", url: "https://docs.google.com/document/d/1cCAvgZ35r0h5nVb7rtVdt76BqrJkSAhksrqppnb53ag/edit?tab=t.0" },
      { text: "集客用資料フォルダ", url: "https://drive.google.com/drive/folders/1R2B-L7ZbFT1kLuvAYT0-9QkxKQo9aUkS?usp=drive_link" },
      { text: "求人用資料フォルダ", url: "https://drive.google.com/drive/folders/1B8eMaFThjDvnH8H0n2BDbg5k1s0JuLa_?usp=drive_link" }
    ], testId: null, xp: 100 },

  { id: 1027, day: 15, category: "フォロー・提案", skillName: "トス提案", priority: "高",
    objective: "売上の意識を持ち、顧客に最適な提案を考えられるようになる",
    inputTask: "トスについて、トスに関しての資料を学習する。完成版トス資料を確認する",
    practiceTask: "自分の企業で行ってみる。2回目の資料や方針立ての際に使用する",
    links: [
      { text: "トスについて", url: "https://drive.google.com/file/d/1V8kOlANdK5b2LxKtYQ9Fjm-gy5Www8nq/view?usp=drive_link" },
      { text: "トスに関して", url: "https://docs.google.com/document/d/1iFdpP3JPKzttrhpTMKaSUOWLf7Z2_8XLOSvPjGExc6k/edit?tab=t.0#heading=h.ezwitak5ulzd" },
      { text: "【完成版】トス資料", url: "https://docs.google.com/spreadsheets/d/1tzChpHVjcfrp6DxHswn0LUteRXAqo0ibKwWQfD-c6VE/edit?gid=1052189143#gid=1052189143" }
    ], testId: null, xp: 150 },

  { id: 1028, day: 16, category: "フォロー・提案", skillName: "SWOT分析・ロープレ", priority: "高",
    objective: "自分の条件企業の今後の方針を立てられるようになる",
    inputTask: "SWOT分析の方法を学ぶ。資料を作成する",
    practiceTask: "SWOT分析を自分の企業で行い、前回ロープレ練習2回目を実施。上長に確認してもらう",
    links: [
      { text: "SWOT分析とは？やり方・戦略立案の方法をフレームワークで解説", url: "https://www.salesforce.com/jp/marketing/analytics/what-is-swot-analysis/" },
      { text: "SWOT分析：ユニクロの事例で分かりやすく解説【5分講座】", url: "https://www.youtube.com/watch?v=GQTmtKmfE08" },
      { text: "資料用 カルテ用 施策集フォルダ", url: "https://drive.google.com/drive/u/0/folders/15aOgeOzVc68Pz3TMuiVSqm-Jq2I1oHgQ" }
    ], testId: null, xp: 150 },

  // ── SEO・コンテンツ（Day 8-11） ──
  { id: 1029, day: 8, category: "SEO・コンテンツ", skillName: "コンテンツSEO記事作成", priority: "高",
    objective: "SEOの基礎知識を深める",
    inputTask: "コンテンツSEOの記事作成について学ぶ。パスカルの使い方、ランサー依頼マニュアルを確認する",
    practiceTask: "コンテンツSEOの基本的な流れを説明できるようになる",
    links: [
      { text: "コンテンツSEOの記事作成について", url: "https://drive.google.com/file/d/1bfhZHbiS3bpQ5WnTe_6MzBPpmyCO8x0p/view?usp=drive_link" },
      { text: "パスカルの使い方②シーン別マニュアル", url: "https://drive.google.com/file/d/1w1g23HS9GXXAsECt9cMDXoQHoclT9J9Z/view?usp=drive_link" },
      { text: "ランサー依頼マニュアル", url: "https://drive.google.com/file/d/17VccmxfZ0JIPl1SIBPEc1sXvNM-Sk7HP/view?usp=drive_link" },
      { text: "パスカル（SEOツール）", url: "https://analyze.pascaljp.com/user/login/" },
      { text: "ランサーズ（外注先）", url: "https://www.lancers.jp/mypage" },
      { text: "トランスコープ（AI見出し）", url: "https://transcope.io/app" }
    ], testId: null, xp: 150 },

  { id: 1030, day: 8, category: "SEO・コンテンツ", skillName: "PLAN-B社 SEO研修①（実務基礎）", priority: "高",
    objective: "SEOの基礎知識を深める",
    inputTask: "PLAN-B社のSEO研修を受講する。第4回GA4研修、第5回サイト制作研修を受ける",
    practiceTask: "引き継ぎ準備として学んだ内容をまとめる",
    links: [
      { text: "PLAN-B社 SEO研修フォルダ", url: "https://drive.google.com/drive/u/0/folders/1A1dNqSNIUFnZI2avzdYGIIJiVdCf1dz0" }
    ], testId: null, xp: 150 },

  { id: 1031, day: 9, category: "SEO・コンテンツ", skillName: "PLAN-B社 SEO研修②（施策基礎）", priority: "高",
    objective: "SEOの基礎知識を深める",
    inputTask: "第1回SEO基礎研修、第2回SEOプランニング研修、第3回SEOキーワード戦略研修を受講する",
    practiceTask: "カスタマージャーニーマップの作成（toC：英会話教室）。引継ぎ予定の条件も可",
    links: [], testId: null, worksheetType: "customer_journey", xp: 150 },

  { id: 1032, day: 10, category: "SEO・コンテンツ", skillName: "PLAN-B社 SEO研修③（施策基礎続き）", priority: "高",
    objective: "SEOの基礎知識を深める",
    inputTask: "第6回SEOキーワード戦略、第9回MEO対策研修を受講する",
    practiceTask: "カスタマージャーニーマップの作成（toB：店舗改装リフォーム）。引継ぎ予定の条件も可",
    links: [], testId: null, xp: 150 },

  { id: 1033, day: 11, category: "SEO・コンテンツ", skillName: "PLAN-B社 SEO研修④（施策応用）", priority: "高",
    objective: "SEOの基礎知識を深め、実践的に使えるように落とし込む",
    inputTask: "第7回SEOプランニング研修（前半）、第8回SEOプランニング研修（後半）を受講する",
    practiceTask: "カスタマージャーニーマップの作成を完成させる",
    links: [], testId: null, xp: 150 },

  // ── 広告運用（Day 12, 17） ──
  { id: 1034, day: 12, category: "広告運用", skillName: "前回打ち合わせロープレテスト", priority: "高",
    objective: "広告の理解を深める",
    inputTask: "VC対応、成果条件（追加配信・動画修正）対応マニュアルを確認する",
    practiceTask: "前回打ち合わせのロープレテストに合格する",
    links: [], testId: null, xp: 150 },

  { id: 1035, day: 12, category: "広告運用", skillName: "リスティング広告", priority: "高",
    objective: "リスティング広告の仕組みと運用を理解する",
    inputTask: "研修資料構成、リスティング広告の概要について、フォロー担当分のリスト運用研修資料を学習する",
    practiceTask: "リスティング広告テストに合格する（80%以上）",
    links: [
      { text: "研修資料構成：リスティング広告の概要について", url: "https://docs.google.com/document/d/1uQWxNsNixplfhIAoN52HTiktUjbPbpJvI_6SReNn4gI/edit?usp=sharing" },
      { text: "リスティング広告について", url: "https://drive.google.com/file/d/1Bho19hQvVmyWIwuQitbVs5lvjV0v8UeO/view?usp=drive_link" },
      { text: "【フォロー担当向け】リス運用研修資料", url: "https://docs.google.com/presentation/d/1EjXjOJmsx9f8hZZHrxZ1UKLdf9cDWnmE/edit?slide=id.p2#slide=id.p2" }
    ], testId: "listing_ad",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLScuMEmOpK2H4akevws_hiAxXcrcLKcpaxtBEMo6Lbmjyy1e0A/viewform?usp=dialog", xp: 150 },

  { id: 1036, day: 12, category: "広告運用", skillName: "ディスプレイ広告（Google・Yahoo）", priority: "高",
    objective: "ディスプレイ広告の仕組みを理解する",
    inputTask: "ディスプレイ広告（Google、Yahoo）の資料を学習する",
    practiceTask: "ディスプレイ広告テストに合格する（80%以上）",
    links: [
      { text: "ディスプレイ広告（Google、Yahoo）", url: "https://docs.google.com/document/d/1wYuz9_t1MiY16rlfPsXsnpgKnwzKtFfGwsXmDM9EOk4/edit?tab=t.0#heading=h.85j9dsmhykdg" }
    ], testId: "display_ad",
    testLink: "https://docs.google.com/forms/d/16cSx92MMI-zPqT1W0y_YdOcvoSJ09WJoKmSchUjrZag/edit", xp: 150 },

  { id: 1037, day: 12, category: "広告運用", skillName: "バナー広告・Google広告", priority: "高",
    objective: "バナー広告とGoogle広告全般を理解する",
    inputTask: "バナー広告のお説明資料.pdfを学習する",
    practiceTask: "Google広告テストに合格する（80%以上）",
    links: [
      { text: "バナー広告 ご説明資料.pdf", url: "https://drive.google.com/file/d/1MgeO6093llgA8G-gGzkLWPu3hk_X-LSL/view?usp=drive_link" },
      { text: "バナー広告フォルダ", url: "https://drive.google.com/drive/folders/1YBuubsfyhVkSwJ8velCLmGQuAcs_lova" }
    ], testId: "google_ad",
    testLink: "https://docs.google.com/forms/d/1EyOikiuPFFLbW0SFe_2fpkH13f-g2opF-kMObLqXNi4/edit", xp: 150 },

  { id: 1038, day: 12, category: "広告運用", skillName: "Trueview広告", priority: "高",
    objective: "YouTube広告（Trueview）を理解する",
    inputTask: "YouTube広告に関する基礎研修.mp4、Trueviewお説明資料.pdfを学習する",
    practiceTask: "Trueview広告テストに合格する（80%以上）",
    links: [
      { text: "Youtube広告に関する基礎研修.mp4", url: "https://drive.google.com/file/d/13RyFEtTo_3ZkE0MrIOHAWAAbTec6D1pn/view?usp=drive_link" },
      { text: "Trueview広告 ご説明資料.pdf", url: "https://drive.google.com/file/d/1sNTfh1WKT7MS1lKRklV_mdVtLKjTRCH9/view?usp=drive_link" },
      { text: "有償案件（追加配信・動画修正）対応マニュアル", url: "https://drive.google.com/file/d/1rFZVbR359wticncn4qS58MqgriugECgp/view?usp=drive_link" },
      { text: "20260120_Trueview広告 ご説明資料.pptx", url: "https://docs.google.com/presentation/d/1IE0STKqKnbY47ou0PHW5CIu9Z2fWOZAz/edit?slide=id.g3b915ff833e_0_231#slide=id.g3b915ff833e_0_231" }
    ], testId: "trueview_ad",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfIaROnadPOUEeycHCmkGlncfr8ntyjkWKXFkHP_HmlLGqr0Q/viewform?usp=dialog", xp: 150 },

  { id: 1039, day: 17, category: "広告運用", skillName: "SNS広告（TikTok・Meta）", priority: "高",
    objective: "SNS広告についての理解を深める",
    inputTask: "SNS広告に関して、Meta広告について、CMSとWEBサイトについて、TikTok広告について、応用SNS広告についてを学習する",
    practiceTask: "TikTok広告・Meta広告テストに合格する（80%以上）",
    links: [
      { text: "SNS広告に関して", url: "https://drive.google.com/file/d/1u3YvTB8Wtxcd3Qa-Mvv1Cbh3Cb_fIO7G/view?usp=drive_link" },
      { text: "Meta広告について", url: "https://drive.google.com/file/d/1FdafLVTCphPHipxherp3IQZV0tqPWTGd/view?usp=drive_link" },
      { text: "CMSとWEBサイトについて", url: "https://drive.google.com/file/d/1OAUicVGB2HTK3oxv8S_-QoEmoYvBWxnr/view?usp=drive_link" },
      { text: "【応用】SNS広告について(活用方法)", url: "https://drive.google.com/file/d/1TBF4oGy8U1f9yqv7cnJWmM4L5gDFA0dC/view?usp=drive_link" },
      { text: "TikTok広告について", url: "https://drive.google.com/file/d/17N2b5M4ftBExGS3Cl3lZBJcm6uFcoKyM/view?usp=drive_link" },
      { text: "TikTok・Meta広告の研修", url: "https://drive.google.com/drive/folders/19mR6pvKJ-xk3_jzY6a0Ri2MBTTKqyHBZ" },
      { text: "TikTok広告 概要説明", url: "https://drive.google.com/file/d/1fMYJUe_fChyorkbpve_d7pTSJcBji3of/view?usp=drive_link" },
      { text: "TikTok広告研修_納品部向け", url: "https://drive.google.com/drive/u/0/folders/1tXcAn4hTYKWTsJO61m-MGttFXanycYbp" }
    ], testId: "sns_ad",
    testLink: "https://docs.google.com/forms/d/1Q6-kFqr2Z9XbY28OPIVDitvbPeDUY7XjeJR-C42IS8g/edit", xp: 150 },

  // ── GA4・データ分析（Day 6, 14） ──
  { id: 1040, day: 6, category: "GA4・データ分析", skillName: "GA4初期編・ロジックツリー", priority: "高",
    objective: "GA4の概要を理解する",
    inputTask: "GA4の初期編ロジックツリーを作成する",
    practiceTask: "GA4アナリティクス用語テストに合格する（80%以上）",
    links: [
      { text: "GA4の初期編ロジックツリー", url: "https://docs.google.com/spreadsheets/d/1m4XA0TUy2N6xY5Ia0mP60QZtjKjTkVyb/edit?gid=1298962529#gid=1298962529" }
    ], testId: "ga4_terms",
    testLink: "https://docs.google.com/forms/d/e/1FAIpQLSfGVX89uUdx43ONXei_UmwWG7j9kLnVmlCIRP62KIqUnfx7JQ/viewform", xp: 150 },

  { id: 1041, day: 6, category: "GA4・データ分析", skillName: "GA4データ分析手順・Search Console", priority: "中",
    objective: "GA4とSearch Consoleの基本操作を習得する",
    inputTask: "GA4データ分析手順（初期編）、Search Console設定方法を学ぶ",
    practiceTask: "GA4とSearch Consoleの基本操作ができるようになる",
    links: [
      { text: "GA4データ分析手順（初期編）", url: "https://drive.google.com/file/d/1DcP-yw8RYgSoJTH8b6lwWeAo0VbSEgSP/view?usp=drive_link" },
      { text: "Search Console設定方法", url: "https://drive.google.com/file/d/1LmIk4kF5SiNWhL4XQhOvOpZQUuj3iaOf/view?usp=drive_link" },
      { text: "Googleサーチコンソール", url: "https://search.google.com/search-console/welcome?hl=ja" },
      { text: "Googleアナリティクス", url: "https://analytics.google.com/" }
    ], testId: null, xp: 100 },

  { id: 1042, day: 6, category: "GA4・データ分析", skillName: "タグマネ・データポータル作成", priority: "中",
    objective: "タグマネージャーとデータポータルの使い方を理解する",
    inputTask: "タグマネ・データポータル作成の手順を学ぶ",
    practiceTask: "タグマネージャーの設置とデータポータルの作成ができるようになる",
    links: [
      { text: "タグマネ・データポータル作成", url: "https://drive.google.com/file/d/1qCQACUg8aaH5FFyucoSnTlObyluvHzHx/view?usp=drive_link" },
      { text: "タグマネージャー", url: "https://tagmanager.google.com/" },
      { text: "ルッカースタジオ", url: "https://lookerstudio.google.com/u/0/navigation/reporting" },
      { text: "データポータル作成参考", url: "https://inhouse-plus.notion.site/e29a8847330c433e8f8b62f3abdf1480?v=a4e50a3647ac4eb5a1ae2a09e016b406" }
    ], testId: null, xp: 100 },

  { id: 1043, day: 14, category: "GA4・データ分析", skillName: "Googleビジネスプロフィール", priority: "中",
    objective: "フォロー2回目の資料理解を深める",
    inputTask: "Googleビジネスプロフィールの概要と活用方法.pdf、登録方法を学ぶ",
    practiceTask: "フォロー1回目の資料をスムーズに話せるようになる",
    links: [
      { text: "Googleビジネスプロフィールの概要と活用方法.pdf", url: "https://drive.google.com/file/d/1O6r_3daphv4Ai7sDiVI-o6kDZHnJkyui/view?usp=drive_link" },
      { text: "GBP登録方法を画像付きで解説", url: "https://meo-analytics.com/column/google-businessprofile-registration/" },
      { text: "GA4 Campaign URL Builder", url: "https://ga-dev-tools.google/ga4/campaign-url-builder/" }
    ], testId: null, xp: 100 },

  { id: 1044, day: 14, category: "GA4・データ分析", skillName: "Google仕事検索", priority: "小",
    objective: "Google仕事検索の仕組みを理解する",
    inputTask: "構造化データ生成ツール、リッチリザルトテストを確認する",
    practiceTask: "Google仕事検索に掲載される仕組みを説明できる",
    links: [
      { text: "構造化データ生成ツール", url: "https://google-job-search.jp/tool/" },
      { text: "リッチリザルトテスト", url: "https://search.google.com/test/rich-results?hl=ja" }
    ], testId: null, xp: 50 },

  { id: 1045, day: 14, category: "GA4・データ分析", skillName: "データポータルマニュアル", priority: "小",
    objective: "データポータルの活用方法を習得する",
    inputTask: "タグマネ・データポータル作成、GA4データポータルマニュアルを確認する",
    practiceTask: "データポータルを作成できるようになる",
    links: [
      { text: "タグマネ・データポータル作成", url: "https://drive.google.com/file/d/1qCQACUg8aaH5FFyucoSnTlObyluvHzHx/view?usp=drive_link" },
      { text: "GA4データポータルマニュアル", url: "https://docs.google.com/spreadsheets/d/1eGzQJPInloeGm4WLc3Ip-rXloLoDgNGehUDzXyIl0LY/edit?gid=1391137521#gid=1391137521" }
    ], testId: null, xp: 50 },

  // ── デザイン・HP（Day 13） ──
  { id: 1046, day: 13, category: "デザイン・HP", skillName: "Raise・ATOMの理解", priority: "中",
    objective: "Raiseの概要とATOMの概要を理解する",
    inputTask: "Raise サービス利用マニュアル.pdf、ATOMについての資料を学習する",
    practiceTask: "RaiseとATOMの基本操作ができるようになる",
    links: [
      { text: "Raise サービス利用マニュアル.pdf", url: "https://drive.google.com/file/d/1P7ef-zeOCfoyLb1SJC0jsKehnMaOxj2l/view?usp=drive_link" },
      { text: "ATOMについて", url: "https://drive.google.com/file/d/1NiB6eqzHree13RHX8nNgLyWUnUkcQ56g/view?usp=drive_link" },
      { text: "Raiseログイン", url: "https://app.rai-se.com/login/" },
      { text: "ATOM", url: "https://www.atom.tools/auth" }
    ], testId: null, xp: 100 },

  { id: 1047, day: 13, category: "デザイン・HP", skillName: "デザイン研修", priority: "高",
    objective: "デザインについて知る",
    inputTask: "資料作成時のデザインの考え方.pdf、色が持つ心理的な効果.pdf、便利なツール共有資料.pdfを学習する。WEBデザイン参考サイトを確認する",
    practiceTask: "Canva、Gyazoを使って参考資料を参考にした資料を作成する",
    links: [
      { text: "資料作成時のデザインの考え方.pdf", url: "https://drive.google.com/file/d/1aFvCrpft8QOVNBVJYHs4mC2nc_BYFxQ-/view?usp=drive_link" },
      { text: "色が持つ心理的な効果.pdf", url: "https://drive.google.com/file/d/1vnIopFkUcaj4TAgONVmRsIOW452yUcKe/view?usp=drive_link" },
      { text: "便利なツール共有資料.pdf", url: "https://drive.google.com/file/d/10qShplVlVFjxw8hbdT7KUONgTqcgsnhL/view?usp=drive_link" },
      { text: "HPデザイン参考事例", url: "https://docs.google.com/spreadsheets/d/1DyfhylNj2--jmDSYAS8uDuPp1bjhMcEWqLVrav4VukQ/edit?gid=0#gid=0" },
      { text: "Canva", url: "https://www.canva.com/" },
      { text: "Gyazo", url: "https://gyazo.com/captures" },
      { text: "WEBデザイン・参考サイト集", url: "https://mirai-works.co.jp/uragawa/" }
    ], testId: null, xp: 150 },

  { id: 1048, day: 13, category: "デザイン・HP", skillName: "HP・広告修正方法", priority: "中",
    objective: "HPの修正方法を知る",
    inputTask: "HP・広告修正方法の資料を学ぶ。HPデザイン参考事例を確認する",
    practiceTask: "修正依頼の手順を説明でき、実際に修正依頼を出せるようになる",
    links: [
      { text: "HP・広告修正方法", url: "https://drive.google.com/file/d/1wfPcYF3Ydc2ANeQXrOXcjB4j2LIxeSWN/view?usp=drive_link" },
      { text: "AUN（修正依頼ツール）", url: "https://aun.tools/" },
      { text: "CSSストック", url: "https://pote-chil.com/css-stock/ja/qa" },
      { text: "SEOツール高評価", url: "https://ko-hyo-ka.com/" },
      { text: "PageSpeed Insights", url: "https://pagespeed.web.dev/" }
    ], testId: null, xp: 100 },

  // ── 事務・管理（Day 18-20） ──
  { id: 1049, day: 18, category: "事務・管理", skillName: "各種フロー確認（停止・再開・解約）", priority: "高",
    objective: "KFを申請できるようになる",
    inputTask: "サービス停止・再開・解約・増額・予算変更の手順を確認する。解約や増減額などのフローチャートを確認する",
    practiceTask: "各種申請フローを正しく説明でき、実際に申請できるようになる",
    links: [
      { text: "サービス停止・再開・解約・増額・予算変更", url: "https://drive.google.com/file/d/1ZOUamuSW9pM0BioynNTZbcPzy5degrpq/view?usp=drive_link" },
      { text: "解約や増減額などのフローチャート", url: "https://docs.google.com/spreadsheets/d/1-5-K6Fsr6PEntZQ44LXDlWmbd5OxJywz-I3_-8km2y0/edit?gid=0#gid=0" }
    ], testId: null, xp: 150 },

  { id: 1050, day: 19, category: "事務・管理", skillName: "月末業務", priority: "高",
    objective: "月末作業を覚え、条件漏れを防げるようになる",
    inputTask: "変動確認シート、コンテンツSEO管理シート、初回・未収チェックシートを確認する",
    practiceTask: "月末業務を一通り実施し、条件漏れなく完了する",
    links: [
      { text: "変動確認シート", url: "https://docs.google.com/spreadsheets/d/1tlv-ve_sSJz0Zg57jFN7aAi8oFxJ1YeaUtK78DOfJMM/edit?gid=587332884#gid=587332884" },
      { text: "コンテンツSEO管理シート 2025/2~", url: "https://docs.google.com/spreadsheets/d/1ThOhmiaEKKh7giPsOu2EVtt42y6L7qMVZiIXV0jJ8Qo/edit?gid=1620649182#gid=1620649182" },
      { text: "原本【未収チェックシート】", url: "https://docs.google.com/spreadsheets/d/1-twiGZL6pTPTbCgz-NeMEIZ0Q7sPXdhhImHWBBDRsJo/edit?gid=750113659#gid=750113659" }
    ], testId: null, xp: 150 },

  { id: 1051, day: 20, category: "事務・管理", skillName: "総復習・ロープレテスト", priority: "高",
    objective: "1ヶ月間の復習を行う",
    inputTask: "わからないことは全部聞く！！各項目のテストを再度やりなおす。フォロー同席含む5件（ADとVCどちらも可）",
    practiceTask: "課長にロープレを行い合格する。全テスト満点。方針立てシート完成",
    links: [
      { text: "ロープレテスト・提案書採点", url: "https://docs.google.com/spreadsheets/d/1Z_cqGgQyk_E_MKHoh5q7_KhvusvFMKIL3nAI_4R7wSo/edit?resourcekey=&gid=154997828#gid=154997828" },
      { text: "方針立てシート", url: "https://docs.google.com/spreadsheets/d/11HEXAfKigFPacTQcpDsmipiJnR5vMgxthuDRTBDfL8c/edit?gid=0#gid=0" },
      { text: "【indeed促進PJB】最終成果物（原本）", url: "https://docs.google.com/spreadsheets/d/1oBGPuw71Eb5icXl0hgAmps83bi84PvIjplTpXII1yz4/edit?gid=1531157496#gid=1531157496" },
      { text: "【完全版】業界まるっと分析＆広告成果事例集", url: "https://docs.google.com/spreadsheets/d/1H5PfpkCrk3ygp8seSTVU2S7UyNKa6WEoGMvkY9q3Tp4/edit?gid=81667958#gid=81667958" }
    ], testId: null, xp: 150 },

  // ── スキルチェック ──
  { id: 1052, day: 0, category: "スキルチェック", skillName: "コミュニケーション能力（上長面談）", priority: "高",
    objective: "営業やフォロー者など社内のメンバーと適切なコミュニケーションをとっている",
    inputTask: "日々の業務でチームメンバーと積極的にコミュニケーションを取る",
    practiceTask: "3ヶ月目の上長判断でコミュニケーション力が評価される",
    links: [
      { text: "成果物・FB内容格納フォルダ", url: "https://drive.google.com/drive/folders/1-eKf1l5dCO6F_b-MjtD2_f0YninQdxD-?usp=share_link" }
    ], testId: null, xp: 150 },

  { id: 1053, day: 0, category: "スキルチェック", skillName: "ヒアリング能力", priority: "高",
    objective: "顧客の課題とニーズをしっかりと理解し、正しい方向に進められる",
    inputTask: "ヒアリングシートの見方を学ぶ。粒度の高いヒアリングマニュアルを確認する",
    practiceTask: "ヒアリングシートに足りない情報は個人的にしっかり口頭で補えている。3ヶ月目の方針立て評価で課題設定3点以上",
    links: [], testId: null, xp: 150 },

  { id: 1054, day: 0, category: "スキルチェック", skillName: "顧客対応能力", priority: "高",
    objective: "顧客との連絡において、追い連絡や翌日の設定、翌日を過ぎた後の進め方などスムーズに行える",
    inputTask: "取り方・拡大方法を学ぶ。初回フォロー後のアナリティクス・タグマネ権限の拡大を行う",
    practiceTask: "担当決定後2営業日以内に連絡できている。かつ初回フォロー時にタグマネージャの設置やアナリティクスの権限拡大を行っている",
    links: [], testId: null, xp: 150 },

  { id: 1055, day: 0, category: "スキルチェック", skillName: "実績分析能力", priority: "高",
    objective: "数値データに基づいた分析ができる能力",
    inputTask: "アナリティクスの見方の勉強。広告管理画面の見方の勉強",
    practiceTask: "3ヶ月目の方針立て評価でデータ分析3点以上",
    links: [], testId: null, xp: 150 },

  { id: 1056, day: 0, category: "スキルチェック", skillName: "市場分析能力（3C分析）", priority: "高",
    objective: "3Cの要素を分析し、競合優位性を見出す能力",
    inputTask: "見本を作成し、1社やってみる",
    practiceTask: "3C分析ワークシートを完成させ、上長から合格をもらう",
    links: [
      { text: "3C分析記入例：ファーストストーリー（会社概要）", url: "https://first-story.co.jp/company/" },
      { text: "3C分析記入例：神奈人材（会社概要）", url: "https://www.kanna-jinzai.jp/company/" },
      { text: "3C分析記入例：arrows", url: "https://arrows-y.net/" },
      { text: "3C分析記入例：神奈人材（ご利用の流れ）", url: "https://www.kanna-jinzai.jp/flow/" },
      { text: "3C分析記入例：神奈人材（サポート）", url: "https://www.kanna-jinzai.jp/support/" },
      { text: "3C分析記入例：ファーストストーリー（お客様の声）", url: "https://first-story.co.jp/voice/" },
      { text: "3C分析記入例：ファーストストーリー（トップ）", url: "https://first-story.co.jp/" }
    ], testId: null, xp: 150 },

  { id: 1057, day: 0, category: "スキルチェック", skillName: "論理的思考能力", priority: "中",
    objective: "網羅的に論点を整理して筋道を考える能力",
    inputTask: "フォロー担当条件の課題を出してみる",
    practiceTask: "3ヶ月目の方針立て評価で論理的項目3点以上",
    links: [], testId: null, xp: 100 },

  { id: 1058, day: 0, category: "スキルチェック", skillName: "PowerPoint・文章・構成力", priority: "中",
    objective: "PowerPointの基本的な理解と、伝わりやすい資料を作成できる",
    inputTask: "YouTubeなどで解説動画を視聴する",
    practiceTask: "初期資料評価で3点以上。提案資料の見やすさ3点以上",
    links: [], testId: null, xp: 100 },

  { id: 1059, day: 0, category: "スキルチェック", skillName: "タスク管理能力", priority: "高",
    objective: "優先順位をつけて効率的に仕事を進めることができる",
    inputTask: "フォローの7営業日前（目安）で資料作成やダッシュボードにあたっておく。フォローの日程調整は前月中に完了させるようにする",
    practiceTask: "フォローを全条件漏れなく実行できている、かつ残業時間が30〜時間未満（3ヶ月目）",
    links: [], testId: null, xp: 150 },

  { id: 1060, day: 0, category: "スキルチェック", skillName: "報連相・リスクマネジ能力", priority: "高",
    objective: "問題があった時点で、上長に報告・連絡・相談を行っている",
    inputTask: "クレームの際に電話の録音をとること、メールやSFに紐づけておく。宛先（cc,Bcc）を適宜合わせている",
    practiceTask: "事象発生時の報告ができている",
    links: [], testId: null, xp: 150 },

  { id: 1061, day: 0, category: "スキルチェック", skillName: "各種申請フロー理解", priority: "中",
    objective: "解約・停止・再開・増減額・稟議書の正しい申請フローを理解し行える",
    inputTask: "各フローチャートなどを確認し、時間を設ける",
    practiceTask: "テストを作成・実施し、申請内容に相違がないことを確認",
    links: [], testId: null, xp: 100 },

  { id: 1062, day: 0, category: "スキルチェック", skillName: "工数・休暇の事務処理", priority: "中",
    objective: "工数のズレを出さず、各種工数を理解して正しく工数登録できる。休暇を適切に申請できる",
    inputTask: "教育担当から説明を受ける。変動後のズレの確認方法を学ぶ",
    practiceTask: "日々の工数登録と休暇申請が正しくできている",
    links: [], testId: null, xp: 100 }
];

// ============================================
// カテゴリ定義
// ============================================
const CATEGORIES = {
  "基礎理解・社内ルール": {
    color: "text-blue-500", bgColor: "bg-blue-500", bgLight: "bg-blue-50",
    border: "border-blue-200", icon: "building-2", description: "BASICS"
  },
  "社会人基礎・自己理解": {
    color: "text-cyan-500", bgColor: "bg-cyan-500", bgLight: "bg-cyan-50",
    border: "border-cyan-200", icon: "user-circle", description: "FOUNDATION"
  },
  "業務フロー・ツール": {
    color: "text-teal-500", bgColor: "bg-teal-500", bgLight: "bg-teal-50",
    border: "border-teal-200", icon: "workflow", description: "WORKFLOW"
  },
  "マーケティング・思考": {
    color: "text-purple-500", bgColor: "bg-purple-500", bgLight: "bg-purple-50",
    border: "border-purple-200", icon: "brain", description: "THINKING"
  },
  "フォロー・提案": {
    color: "text-emerald-500", bgColor: "bg-emerald-500", bgLight: "bg-emerald-50",
    border: "border-emerald-200", icon: "handshake", description: "CONSULTING"
  },
  "SEO・コンテンツ": {
    color: "text-orange-500", bgColor: "bg-orange-500", bgLight: "bg-orange-50",
    border: "border-orange-200", icon: "search", description: "SEO"
  },
  "広告運用": {
    color: "text-rose-500", bgColor: "bg-rose-500", bgLight: "bg-rose-50",
    border: "border-rose-200", icon: "megaphone", description: "ADVERTISING"
  },
  "GA4・データ分析": {
    color: "text-sky-500", bgColor: "bg-sky-500", bgLight: "bg-sky-50",
    border: "border-sky-200", icon: "bar-chart-3", description: "ANALYTICS"
  },
  "デザイン・HP": {
    color: "text-pink-500", bgColor: "bg-pink-500", bgLight: "bg-pink-50",
    border: "border-pink-200", icon: "palette", description: "DESIGN"
  },
  "事務・管理": {
    color: "text-amber-500", bgColor: "bg-amber-500", bgLight: "bg-amber-50",
    border: "border-amber-200", icon: "clipboard-list", description: "ADMIN"
  },
  "スキルチェック": {
    color: "text-violet-500", bgColor: "bg-violet-500", bgLight: "bg-violet-50",
    border: "border-violet-200", icon: "shield-check", description: "SKILL CHECK"
  }
};

// ============================================
// バッジ定義
// ============================================
const BADGES = [
  { id: 'basics_clear', name: '基礎マスター', description: 'BASICS 全クリア', category: '基礎理解・社内ルール', threshold: 1.0, icon: '🏢' },
  { id: 'foundation_clear', name: '自己理解達成', description: 'FOUNDATION 全クリア', category: '社会人基礎・自己理解', threshold: 1.0, icon: '🧑' },
  { id: 'workflow_clear', name: '業務マスター', description: 'WORKFLOW 全クリア', category: '業務フロー・ツール', threshold: 1.0, icon: '⚙️' },
  { id: 'thinking_clear', name: '思考の達人', description: 'THINKING 全クリア', category: 'マーケティング・思考', threshold: 1.0, icon: '🧠' },
  { id: 'consulting_clear', name: 'フォローマスター', description: 'CONSULTING 全クリア', category: 'フォロー・提案', threshold: 1.0, icon: '🤝' },
  { id: 'seo_clear', name: 'SEOエキスパート', description: 'SEO 全クリア', category: 'SEO・コンテンツ', threshold: 1.0, icon: '🔍' },
  { id: 'ad_clear', name: '広告マスター', description: 'ADVERTISING 全クリア', category: '広告運用', threshold: 1.0, icon: '📢' },
  { id: 'analytics_clear', name: 'データアナリスト', description: 'ANALYTICS 全クリア', category: 'GA4・データ分析', threshold: 1.0, icon: '📊' },
  { id: 'design_clear', name: 'デザイナー見習い', description: 'DESIGN 全クリア', category: 'デザイン・HP', threshold: 1.0, icon: '🎨' },
  { id: 'admin_clear', name: '事務の鬼', description: 'ADMIN 全クリア', category: '事務・管理', threshold: 1.0, icon: '📋' },
  { id: 'skill_clear', name: 'スキル認定', description: 'SKILL CHECK 全クリア', category: 'スキルチェック', threshold: 1.0, icon: '🛡️' },
  { id: 'week1_clear', name: '1週目制覇', description: '1〜5営業日のクエスト全完了', category: null, threshold: null, icon: '⭐',
    check: (ids) => SKILL_DATA.filter(s => s.day >= 1 && s.day <= 5).every(s => ids.includes(s.id)) },
  { id: 'month1_clear', name: '1ヶ月目制覇', description: '20営業日のクエスト全完了', category: null, threshold: null, icon: '🏅',
    check: (ids) => SKILL_DATA.filter(s => s.day >= 1 && s.day <= 20).every(s => ids.includes(s.id)) },
  { id: 'test_perfect', name: 'テストの鬼', description: '全テスト一発合格', category: null, threshold: null, icon: '💯' },
  { id: 'legend', name: '伝説のCSメンバー', description: '全スキル制覇', category: null, threshold: 1.0, icon: '🏆' }
];

// ============================================
// ツールデータ（ブックマーク必須シートから）
// ============================================
const TOOLS_DATA = [
  // Google系
  { category: "Google系", name: "Googleアナリティクス", url: "https://analytics.google.com/", description: "サイトの流入状況をみる。いろいろ色々できるのでいじって散歩してほしい" },
  { category: "Google系", name: "Googleサーチコンソール", url: "https://search.google.com/search-console/welcome?hl=ja", description: "HPに入る前の流入KWをみたり、クローラーに向けた内部対策状況などをみる" },
  { category: "Google系", name: "ルッカースタジオ", url: "https://lookerstudio.google.com/u/0/navigation/reporting", description: "集められたデータを見やすくするために使用するBIツール" },
  { category: "Google系", name: "タグマネージャー", url: "https://tagmanager.google.com/", description: "HPに設置するタグを一括で管理するツール" },
  { category: "Google系", name: "Googleトレンド", url: "https://trends.google.com/trends/?geo=JP", description: "直近で検索ニーズが上がっているKWを調べたい。特定のKWの検索ニーズの動向を知りたい" },
  { category: "Google系", name: "Google広告", url: "https://ads.google.com/", description: "検索広告やGDN、TrueViewといったGoogle系の広告はここで一括管理できる" },
  // ツール系
  { category: "ツール系", name: "ChatGPT", url: "https://chat.openai.com/", description: "わからないなら全部答えてくれるなんて、使わないわけにはいかない" },
  { category: "ツール系", name: "ATOM", url: "https://www.atom.tools/auth", description: "TrueViewの実際のデータを見るときに使う" },
  // HP修正
  { category: "HP修正", name: "AUN", url: "https://aun.tools/", description: "修正依頼時に具体的にどこをどう修正してほしいのかをまとめる" },
  { category: "HP修正", name: "CSSストック", url: "https://pote-chil.com/css-stock/ja/qa", description: "修正依頼で文字のデザインを変えたいときにつかう" },
  // サイト分析
  { category: "サイト分析", name: "SEOツール高評価", url: "https://ko-hyo-ka.com/", description: "特定のKWに対して該当WEBサイトのSEO対策がどの程度できているのか調べたい" },
  { category: "サイト分析", name: "PageSpeed Insights", url: "https://pagespeed.web.dev/", description: "ウェブの読み込み時間（サイトの利便性）を知りたい。内部対策で使用" },
  { category: "サイト分析", name: "エイチレフス", url: "https://app.ahrefs.com/", description: "競合サイトのDRや外部リンク数などを見る" },
  { category: "サイト分析", name: "ミエルカ", url: "https://app.mieru-ca.com/", description: "ヒートマップのオプションを付けるときに使う" },
  // コンテンツSEO
  { category: "コンテンツSEO", name: "パスカル", url: "https://analyze.pascaljp.com/user/login/", description: "KWを探したり、サイト分析したり、色々なことが出来る" },
  { category: "コンテンツSEO", name: "ランサーズ", url: "https://www.lancers.jp/mypage", description: "コンテンツSEOの外注先" },
  { category: "コンテンツSEO", name: "トランスコープ", url: "https://transcope.io/app", description: "AIで見出しの作成ができる" },
  { category: "コンテンツSEO", name: "ラッコキーワード", url: "https://rakkokeyword.com/", description: "設定するKWの候補がほしい" },
  { category: "コンテンツSEO", name: "コピペチェック", url: "https://ccd.cloud/", description: "納品されたコンテンツがコピペではないか、AIが作っていないかを判断" },
  // MEO
  { category: "MEO", name: "Google Location Changer", url: "https://seranking.com/google-location-changer.html", description: "自分の今いる地域に関係なく検索結果を返す" },
  { category: "MEO", name: "MEO順位チェッカー", url: "https://meotool.white-link.com/", description: "Googleビジネスプロフィールの順位を調べる" },
  // その他
  { category: "その他", name: "I♡IMG", url: "https://www.iloveimg.com/ja/compress-image", description: "画像を圧縮できる。ページスピードを速くしたい時に" },
  { category: "その他", name: "I♡PDF", url: "https://www.ilovepdf.com/ja", description: "PDFをパワポで開ける形式に変換。セミナー等で送られた資料をパワポにしてフォローで使ったり" },
  { category: "その他", name: "URLビルダー", url: "https://ga-dev-tools.google/ga4/campaign-url-builder/", description: "新たにURLを発行したい。GA4で特定のキャンペーンからの流入を確認したい" },
  { category: "その他", name: "DeepL翻訳", url: "https://www.deepl.com/ja/translator", description: "翻訳したい" },
  // SNS
  { category: "SNS", name: "Facebook", url: "https://www.facebook.com/", description: "世界で一番使われているSNS" },
  { category: "SNS", name: "Instagram", url: "https://www.instagram.com/", description: "顧客のSNSを見るときに使う" },
  { category: "SNS", name: "Indeed", url: "https://account.indeed.com/", description: "Indeedでとりあえずデータの集計につかう" },
  // 管理画面
  { category: "管理画面", name: "MIL管理画面", url: "https://branch2-fines.com/manager/login/", description: "動画のレポートや、レビュー簡易的なり、サムネの変更ができる" },
  { category: "管理画面", name: "Raiseログイン", url: "https://app.rai-se.com/login/", description: "Raiseのログイン画面" },
  { category: "管理画面", name: "TikTok管理画面", url: "https://business.tiktok.com/", description: "TikTok広告の管理画面" },
  { category: "管理画面", name: "Meta広告管理画面", url: "https://business.facebook.com/", description: "Meta広告の管理画面" }
];

// ============================================
// 月別ゴール
// ============================================
const MONTHLY_GOALS = {
  month1: {
    title: "1ヶ月目ゴール",
    goals: [
      "VC: 条件数15件以上の保持",
      "AD: 条件数15件（同席10件、新規5件）",
      "ファインズ理（社内ルール・社員基礎理解）",
      "基礎系の履修を完了している状態"
    ]
  },
  month2: {
    title: "2ヶ月目ゴール",
    goals: [
      "条件数20〜25件（VC15件、AD20件）",
      "データを見て顧客の課題を見つけ施策を考えられるようになる",
      "同じ部署の人と円滑にコミュニケーションをとれる",
      "3C分析ができるようになる",
      "追い連絡・翌日の設定・未収/停止の連絡などスムーズにできる",
      "打ち合わせ時アプローチができる",
      "初期設定をスムーズに行える"
    ]
  },
  month3: {
    title: "3ヶ月目ゴール（一人前）",
    goals: [
      "VC: 条件数30件、AD: 条件数25件",
      "30件以上条件を持ちながらまわせるようになる",
      "クロス2件決められるようになる",
      "他部署の人と円滑にコミュニケーションをとれる",
      "SWOT分析ができ、顧客の課題解決に向けた方針設定ができる",
      "意味のある質問が出来るようになる",
      "結論ファーストで話せる"
    ]
  }
};
