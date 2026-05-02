import supabase from '../supabaseClient';

// Fetch all tasks
export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Create a new task
export const createTask = async (task) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: 'todo',
      due_date: task.due_date,
      created_by: user.id,
      assigned_to: user.id  // for now assign to self, later we add team members
    }])
    .select();

  return { data, error };
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select();

  return { data, error };
};

// Delete a task
export const deleteTask = async (id) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  return { error };
};
