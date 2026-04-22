// Mock data for development
export const MOCK_USER = {
  id: 'user-1',
  full_name: 'Current User',
  email: 'user@business.com',
  business_name: 'Your Business',
  city: 'Metropolis',
  role: 'business_owner',
  avatar_url: null,
};

export const MOCK_BATCH = {
  id: 'batch-1',
  name: 'Q2 2026 — Batch 1',
  batch_code: '2026-Q2-B1',
  start_date: '2026-04-14',
  end_date: '2026-07-06',
  status: 'active',
};

export const WEEKS_DATA = [
  { week: 1, session: 'Health Updates & Baseline', focus: 'Setup and log initial health metrics', type: 'individual', status: 'current' },
  { week: 2, session: 'Team Aspiration & Goal Setting', focus: 'Business & team goals', type: 'individual', status: 'locked' },
  { week: 3, session: 'Business Model Changes', focus: 'Scaling model, B2B/B2C channels', type: 'individual', status: 'locked' },
  { week: 4, session: 'Role Clarity', focus: 'Team responsibilities & KPIs', type: 'group', status: 'locked' },
  { week: 5, session: 'Culture & Values', focus: 'Company identity & behaviour', type: 'group', status: 'locked' },
  { week: 6, session: 'Growth Accelerator & Review-to-React', focus: 'Monthly business review, performance correction', type: 'group', status: 'locked' },
  { week: 7, session: 'Branding', focus: 'Identity and brand positioning', type: 'individual', status: 'locked' },
  { week: 8, session: 'Creating Reels', focus: 'Content generation and video strategy', type: 'individual', status: 'locked' },
  { week: 9, session: 'Marketing Strategies – 3', focus: 'Advanced growth campaigns & automation', type: 'individual', status: 'locked' },
  { week: 10, session: 'Sales Strategies – 1', focus: 'Sales process design & scripts', type: 'individual', status: 'locked' },
  { week: 11, session: 'Sales Strategies – 2', focus: 'Conversion psychology & objection handling', type: 'individual', status: 'locked' },
  { week: 12, session: 'Sales Strategies – 3', focus: 'Closing systems, scaling sales & FINAL REVIEW', type: 'individual', status: 'locked' },
];

export const MOCK_TASKS = {
  1: [],
  2: [
    { id: 't4', title: 'Team Aspiration Meeting', description: 'Host a team aspiration meeting and submit the summary.', points: 30, is_completed: false, due_date: 'Mon', task_type: 'action' },
    { id: 't5', title: 'Goal Poster Creation', description: 'Design and finalize your quarterly/yearly goal poster.', points: 30, is_completed: false, due_date: 'Wed', task_type: 'action' },
    { id: 't6', title: 'Goal Poster Revealing', description: 'Reveal the goal poster to the team and submit proof of the session.', points: 30, is_completed: false, due_date: 'Fri', task_type: 'submission' },
  ],
  3: [
    { id: 't7', title: 'Business Model Definition', description: 'Document your complete business model and submit proof.', points: 90, is_completed: false, due_date: 'Wed', task_type: 'action' },
  ],
  4: [
    { id: 't8', title: 'Role Clarity Document', description: 'Establish clear roles and KPIs for your key team members and submit proof.', points: 90, is_completed: false, due_date: 'Wed', task_type: 'action' },
  ],
  5: [
    { id: 't9', title: 'Culture Verification', description: 'Provide proof of culture building activities or workshops implemented with the team.', points: 90, is_completed: false, due_date: 'Wed', task_type: 'action' },
  ],
  6: [
    { id: 't10', title: 'Growth Accelerator & Implementation', description: 'Submit proof of implementation for your Growth Accelerator meeting strategies.', points: 90, is_completed: false, due_date: 'Wed', task_type: 'action' },
  ],
  7: [
    { id: 't11', title: 'Branding Strategy Document', description: 'Submit your defined branding strategy and identity documentation.', points: 90, is_completed: false, due_date: 'Wed', task_type: 'action' },
  ],
  8: [
    { id: 't12', title: 'Creating Reels', description: 'Submit 3 finished reels for content marketing along with posting proofs.', points: 90, is_completed: false, due_date: 'Wed', task_type: 'action' },
  ]
};

export const MOCK_LEADERBOARD = [
  { id: 'u1', rank: 1, name: 'Participant 1', business: 'Business 1', points: 90, tasks_done: 3, total: 3, pct: 100, avatar: null },
  { id: 'u2', rank: 2, name: 'Participant 2', business: 'Business 2', points: 90, tasks_done: 3, total: 3, pct: 100, avatar: null },
  { id: 'u3', rank: 3, name: 'Participant 3', business: 'Business 3', points: 60, tasks_done: 2, total: 3, pct: 67, avatar: null },
  { id: 'u4', rank: 4, name: 'Participant 4', business: 'Business 4', points: 60, tasks_done: 2, total: 3, pct: 67, avatar: null },
  { id: 'user-1', rank: 5, name: 'Current User', business: 'Your Business', points: 30, tasks_done: 1, total: 3, pct: 33, avatar: null },
  { id: 'u6', rank: 6, name: 'Participant 6', business: 'Business 6', points: 30, tasks_done: 1, total: 3, pct: 33, avatar: null },
  { id: 'u7', rank: 7, name: 'Participant 7', business: 'Business 7', points: 30, tasks_done: 1, total: 3, pct: 33, avatar: null },
  { id: 'u8', rank: 8, name: 'Participant 8', business: 'Business 8', points: 0, tasks_done: 0, total: 3, pct: 0, avatar: null },
  { id: 'u9', rank: 9, name: 'Participant 9', business: 'Business 9', points: 0, tasks_done: 0, total: 3, pct: 0, avatar: null },
  { id: 'u10', rank: 10, name: 'Participant 10', business: 'Business 10', points: 0, tasks_done: 0, total: 3, pct: 0, avatar: null },
];

export const ACHIEVEMENTS = [
  { id: 'a1', icon: '🌱', name: 'Starter', desc: 'Completed first task', unlocked: false },
  { id: 'a2', icon: '⚡', name: 'Momentum', desc: 'Completed Week 1 fully', unlocked: false },
  { id: 'a3', icon: '🔥', name: 'On Fire', desc: '3 consecutive perfect weeks', unlocked: false },
  { id: 'a4', icon: '💎', name: 'Diamond', desc: '80%+ completion at week 6', unlocked: false },
  { id: 'a5', icon: '🏆', name: 'Champion', desc: '100% completion at week 12', unlocked: false },
  { id: 'a6', icon: '👑', name: 'Legend', desc: '#1 rank in a batch', unlocked: false },
];
