-- ============================================
-- CS新人育成RPG - Supabase Schema（統合版）
-- ============================================
-- Supabase Dashboard → SQL Editor で実行してください
-- コンソル新人育成のスキーマをベースに、
-- CS部向けにカスタマイズ＋新機能テーブルを追加

-- ============================================
-- 1. profiles テーブル（ユーザー情報）
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  department text default 'カスタマーサクセス部',
  role text default 'user' check (role in ('user', 'manager', 'admin')),
  manager_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 2. skill_progress テーブル（クエスト達成記録・承認フロー対応）
-- ============================================
create table if not exists public.skill_progress (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_id integer not null,
  memo text default '',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  image_url text default '',
  approved_by uuid references public.profiles(id) on delete set null,
  feedback text default '',
  reviewed_at timestamptz,
  completed_at timestamptz default now(),
  unique(user_id, skill_id)
);

-- ============================================
-- 3. test_results テーブル（テスト結果記録）
-- ============================================
-- 新人がサイト内でテストを受けた結果を保存する
-- attempt_number で何回目の受験かを記録
-- answers に各問の回答詳細をJSON形式で格納
create table if not exists public.test_results (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_id text not null,           -- テストID（例: "cs1_rules"）
  score integer not null,          -- 正答数
  total integer not null,          -- 問題数
  percentage integer not null,     -- 正答率（%）
  passed boolean not null,         -- 合格かどうか（80%以上で合格）
  attempt_number integer not null, -- 何回目の受験か
  answers jsonb default '[]',      -- 各問の回答詳細 [{question_id, selected, correct, is_correct}]
  completed_at timestamptz default now()
);

-- ============================================
-- 4. worksheets テーブル（ワークシート記録）
-- ============================================
-- 自己分析、ロジックツリー、3C分析、カスタマージャーニーマップの記入内容を保存
-- status: draft（下書き）→ submitted（提出済み）→ reviewed（レビュー済み）
create table if not exists public.worksheets (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('self_analysis', 'logic_tree', '3c_analysis', 'customer_journey')),
  content jsonb not null default '{}',  -- ワークシートの内容（JSON）
  status text default 'draft' check (status in ('draft', 'submitted', 'reviewed')),
  feedback text default '',
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- 5. RLS（Row Level Security）有効化
-- ============================================
alter table public.profiles enable row level security;
alter table public.skill_progress enable row level security;
alter table public.test_results enable row level security;
alter table public.worksheets enable row level security;

-- ============================================
-- 6. profiles ポリシー
-- ============================================

-- 全認証ユーザーが全プロフィールを閲覧可能（リーダーボード用）
create policy "profiles: 認証ユーザーは全プロフィールを閲覧可能"
  on public.profiles for select
  to authenticated
  using (true);

-- 自分のプロフィールを作成可能
create policy "profiles: 自分のプロフィールを作成可能"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 自分のプロフィールのみ更新可能
create policy "profiles: 自分のプロフィールを更新可能"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- admin は全プロフィールを更新可能（ロール変更・マネージャー割当用）
create policy "profiles: adminは全プロフィールを更新可能"
  on public.profiles for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================
-- 7. skill_progress ポリシー
-- ============================================

-- 全認証ユーザーが全進捗を閲覧可能（リーダーボード用）
create policy "skill_progress: 認証ユーザーは全進捗を閲覧可能"
  on public.skill_progress for select
  to authenticated
  using (true);

-- 自分の進捗のみ追加可能
create policy "skill_progress: 自分の進捗を追加可能"
  on public.skill_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 自分の進捗のみ更新可能（メモ編集用）
create policy "skill_progress: 自分の進捗を更新可能"
  on public.skill_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- マネージャーが担当メンバーの進捗を更新可能（承認・却下用）
create policy "skill_progress: マネージャーは担当メンバーの進捗を更新可能"
  on public.skill_progress for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = skill_progress.user_id
      and profiles.manager_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = skill_progress.user_id
      and profiles.manager_id = auth.uid()
    )
  );

-- 自分の進捗のみ削除可能
create policy "skill_progress: 自分の進捗を削除可能"
  on public.skill_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================
-- 8. test_results ポリシー
-- ============================================

-- 認証ユーザーは全テスト結果を閲覧可能（マネージャーが確認するため）
create policy "test_results: 認証ユーザーは全結果を閲覧可能"
  on public.test_results for select
  to authenticated
  using (true);

-- 自分のテスト結果のみ追加可能
create policy "test_results: 自分の結果を追加可能"
  on public.test_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================
-- 9. worksheets ポリシー
-- ============================================

-- 認証ユーザーは全ワークシートを閲覧可能
create policy "worksheets: 認証ユーザーは全ワークシートを閲覧可能"
  on public.worksheets for select
  to authenticated
  using (true);

-- 自分のワークシートのみ追加可能
create policy "worksheets: 自分のワークシートを追加可能"
  on public.worksheets for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 自分のワークシートのみ更新可能（下書き保存・提出用）
create policy "worksheets: 自分のワークシートを更新可能"
  on public.worksheets for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- マネージャーが担当メンバーのワークシートを更新可能（レビュー・フィードバック用）
create policy "worksheets: マネージャーは担当メンバーのワークシートを更新可能"
  on public.worksheets for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = worksheets.user_id
      and profiles.manager_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = worksheets.user_id
      and profiles.manager_id = auth.uid()
    )
  );

-- ============================================
-- 10. トリガー関数: 新規ユーザー登録時に自動でプロフィール作成
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', 'ユーザー')
  );
  return new;
end;
$$ language plpgsql security definer;

-- 既存トリガーがあれば削除してから作成
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 11. トリガー関数: updated_at 自動更新
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- profiles の updated_at 自動更新
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- worksheets の updated_at 自動更新
drop trigger if exists worksheets_updated_at on public.worksheets;
create trigger worksheets_updated_at
  before update on public.worksheets
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- 12. Storage バケット作成（画像アップロード用）
-- ============================================
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', true)
on conflict (id) do nothing;

-- 認証ユーザーがアップロード可能
create policy "storage: 認証ユーザーはevidenceにアップロード可能"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'evidence');

-- 誰でも閲覧可能（public bucket）
create policy "storage: evidenceは誰でも閲覧可能"
  on storage.objects for select
  to public
  using (bucket_id = 'evidence');

-- ============================================
-- セットアップ後の手順:
--
-- 1. 最初に登録したユーザーを管理者にする:
--    UPDATE profiles SET role = 'admin'
--    WHERE display_name = 'あなたの名前';
--
-- 2. マネージャーを設定する:
--    UPDATE profiles SET role = 'manager'
--    WHERE display_name = 'マネージャーの名前';
--
-- 3. メンバーにマネージャーを紐づける:
--    UPDATE profiles SET manager_id = (
--      SELECT id FROM profiles WHERE display_name = 'マネージャーの名前'
--    ) WHERE display_name = 'メンバーの名前';
-- ============================================
