-- ============================================
-- CS新人育成 追加テーブル マイグレーション
-- ============================================
-- 既存のコンソル新人育成Supabaseプロジェクトに
-- CS版で必要な新テーブルを追加するSQL
-- Supabase Dashboard → SQL Editor で実行してください

-- ============================================
-- 1. test_results テーブル（テスト結果記録）
-- ============================================
create table if not exists public.test_results (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  test_id text not null,
  score integer not null,
  total integer not null,
  percentage integer not null,
  passed boolean not null,
  attempt_number integer not null,
  answers jsonb default '[]',
  completed_at timestamptz default now()
);

-- RLS有効化
alter table public.test_results enable row level security;

-- 全認証ユーザーが閲覧可能（マネージャーが確認するため）
create policy "全員がテスト結果を閲覧可能"
  on public.test_results for select
  to authenticated
  using (true);

-- 自分のテスト結果のみ追加可能
create policy "自分のテスト結果を追加可能"
  on public.test_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ============================================
-- 2. worksheets テーブル（ワークシート記録）
-- ============================================
create table if not exists public.worksheets (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('self_analysis', 'logic_tree', '3c_analysis', 'customer_journey')),
  content jsonb not null default '{}',
  status text default 'draft' check (status in ('draft', 'submitted', 'reviewed')),
  feedback text default '',
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS有効化
alter table public.worksheets enable row level security;

-- 全認証ユーザーが閲覧可能
create policy "全員がワークシートを閲覧可能"
  on public.worksheets for select
  to authenticated
  using (true);

-- 自分のワークシートのみ追加可能
create policy "自分のワークシートを追加可能"
  on public.worksheets for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 自分のワークシートを更新可能
create policy "自分のワークシートを更新可能"
  on public.worksheets for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- マネージャーは担当メンバーのワークシートを更新可能（レビュー用）
create policy "マネージャーが担当メンバーのワークシートを更新可能"
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

-- updated_at 自動更新トリガー
create or replace function public.handle_worksheets_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists worksheets_updated_at on public.worksheets;
create trigger worksheets_updated_at
  before update on public.worksheets
  for each row execute procedure public.handle_worksheets_updated_at();
