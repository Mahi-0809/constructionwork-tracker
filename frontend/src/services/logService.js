import supabase from '../supabaseClient';

// Fetch all logs from the database, newest first
export const getLogs = async () => {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Create a new log entry
export const createLog = async (log) => {
  // Get the currently logged in user
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('daily_logs')
    .insert([{
      title: log.title,
      description: log.description,
      location: log.location,
      log_date: log.log_date,
      user_id: user.id,   // attach log to the logged in user
      status: 'draft'
    }])
    .select(); // return the newly created row

  return { data, error };
};

// Delete a log by its id
export const deleteLog = async (id) => {
  const { error } = await supabase
    .from('daily_logs')
    .delete()
    .eq('id', id); // only delete the row where id matches

  return { error };
};