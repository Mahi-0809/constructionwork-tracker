import supabase from '../supabaseClient';

// Fetch all equipment
export const getEquipment = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Add new equipment
export const createEquipment = async (equipment) => {
  const { data, error } = await supabase
    .from('equipment')
    .insert([{
      name: equipment.name,
      type: equipment.type,
      condition: equipment.condition,
      status: equipment.status,
      notes: equipment.notes
    }])
    .select();

  return { data, error };
};

// Update equipment status
export const updateEquipmentStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('equipment')
    .update({ status })
    .eq('id', id)
    .select();

  return { data, error };
};

// Delete equipment
export const deleteEquipment = async (id) => {
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id);

  return { error };
};