import supabase from '../supabaseClient';

// Fetch all incidents newest first
export const getIncidents = async () => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Create a new incident
export const createIncident = async (incident) => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('incidents')
    .insert([{
      reported_by: user.id,
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      location: incident.location,
      status: 'open',
      incident_date: new Date().toISOString()
    }])
    .select();

  return { data, error };
};

// Update incident status
export const updateIncidentStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('incidents')
    .update({ status })
    .eq('id', id)
    .select();

  return { data, error };
};

// Delete an incident
export const deleteIncident = async (id) => {
  const { error } = await supabase
    .from('incidents')
    .delete()
    .eq('id', id);

  return { error };
};