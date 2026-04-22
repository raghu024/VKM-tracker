import { supabase } from './supabase.js';

/**
 * Fetch high-level system statistics for admins.
 */
export async function getGlobalStats() {
  const { data: users, count: userCount } = await supabase.from('profiles').select('*', { count: 'exact' });
  const { data: batches, count: batchCount } = await supabase.from('batches').select('*', { count: 'exact' });
  const { data: completions } = await supabase.from('task_completions').select('points_earned');
  
  const totalPoints = completions?.reduce((sum, c) => sum + (c.points_earned || 0), 0) || 0;
  
  return {
    totalUsers: userCount || 0,
    totalBatches: batchCount || 0,
    totalPoints,
    avgPoints: userCount ? Math.round(totalPoints / userCount) : 0
  };
}

/**
 * Fetch all participants and their current progress.
 */
export async function getParticipantsProgress() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      task_completions (
        is_completed,
        points_earned,
        verification_status
      )
    `)
    .eq('role', 'business_owner')
    .order('full_name');

  if (error) throw error;

  return data.map(user => {
    const completed = user.task_completions?.filter(c => c.is_completed).length || 0;
    const totalPoints = user.task_completions?.reduce((sum, c) => sum + (c.points_earned || 0), 0) || 0;
    const pendingCount = user.task_completions?.filter(c => c.verification_status === 'pending').length || 0;

    return {
      ...user,
      completedCount: completed,
      totalPoints,
      pendingCount,
      progress: Math.min(Math.round((completed / 36) * 100), 100) // Assuming 36 tasks total (3 per week * 12 weeks)
    };
  });
}

/**
 * Fetch all pending completions that require verification.
 */
export async function getPendingProofs() {
  const { data, error } = await supabase
    .from('task_completions')
    .select(`
      *,
      profiles:user_id (full_name, business_name),
      tasks:task_id (title, description, points)
    `)
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Verify a task completion.
 */
export async function verifyCompletion(completionId, status, points, adminId, note = '') {
  const { data, error } = await supabase
    .from('task_completions')
    .update({
      verification_status: status,
      points_earned: status === 'approved' ? points : 0,
      verified_by: adminId,
      notes: note,
      updated_at: new Date().toISOString()
    })
    .eq('id', completionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a user's role (Super Admin only).
 */
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch all active broadcasts.
 */
export async function getBroadcasts() {
  const { data, error } = await supabase
    .from('broadcasts')
    .select('*, profiles:created_by (full_name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new broadcast.
 */
export async function createBroadcast(broadcast, adminId) {
  const { data, error } = await supabase
    .from('broadcasts')
    .insert([{ ...broadcast, created_by: adminId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch all library resources.
 */
export async function getResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new resource.
 */
export async function createResource(resource) {
  const { data, error } = await supabase
    .from('resources')
    .insert([resource])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a broadcast.
 */
export async function deleteBroadcast(id) {
  const { error } = await supabase
    .from('broadcasts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Delete a library resource.
 */
export async function deleteResource(id) {
  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
