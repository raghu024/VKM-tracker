-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  business_type TEXT,
  city TEXT,
  state TEXT DEFAULT 'Telangana',
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'business_owner')) DEFAULT 'business_owner',
  is_active BOOLEAN DEFAULT true,
  current_streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Broadcasts
CREATE TABLE broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success'
  created_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  requirement_type TEXT NOT NULL, -- 'points', 'tasks', 'streak'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Resources (Library)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  type TEXT CHECK (type IN ('video', 'document', 'link', 'template')) DEFAULT 'document',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Batches
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  batch_code TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'active', 'completed', 'archived')) DEFAULT 'upcoming',
  max_participants INTEGER DEFAULT 50,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Batch Enrollments
CREATE TABLE batch_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  status TEXT CHECK (status IN ('active', 'dropped', 'completed')) DEFAULT 'active',
  UNIQUE(batch_id, user_id)
);

-- Weeks
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 12),
  session_name TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  session_type TEXT CHECK (session_type IN ('group', 'individual')) NOT NULL,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  is_locked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(batch_id, week_number)
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 30,
  task_order INTEGER NOT NULL DEFAULT 1,
  task_type TEXT CHECK (task_type IN ('action', 'reflection', 'submission', 'quiz')) DEFAULT 'action',
  due_date DATE,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task Completions
CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  proof_urls JSONB DEFAULT '[]',
  points_earned INTEGER DEFAULT 0,
  verified_by UUID REFERENCES profiles(id),
  verification_status TEXT CHECK (verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(task_id, user_id, batch_id)
);

-- ─── Row Level Security (RLS) ───
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Task Completions Policies
CREATE POLICY "Users can view their own completions" ON task_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update their own completions" ON task_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all completions" ON task_completions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Broadcasts & Resources (Read-only for users, full access for admins)
CREATE POLICY "Anyone can view broadcasts" ON broadcasts FOR SELECT USING (true);
CREATE POLICY "Admins manage broadcasts" ON broadcasts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Admins manage resources" ON resources FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Core Curriculum (Read-only for all, managed by admins)
CREATE POLICY "Anyone can view curriculum" ON batches FOR SELECT USING (true);
CREATE POLICY "Anyone can view weeks" ON weeks FOR SELECT USING (true);
CREATE POLICY "Anyone can view tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);

CREATE POLICY "Admins manage curriculum" ON batches FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Admins manage weeks" ON weeks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Admins manage tasks" ON tasks FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Admins manage achievements" ON achievements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- User Specific Data (Enrollments & Achievements)
CREATE POLICY "Users can view their own enrollments" ON batch_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage enrollments" ON batch_enrollments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
CREATE POLICY "Admins manage user achievements" ON user_achievements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));
