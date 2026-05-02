import supabase from '../supabaseClient';

// Fetch all materials
export const getMaterials = async () => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Add new material
export const createMaterial = async (material) => {
  const { data, error } = await supabase
    .from('materials')
    .insert([{
      name: material.name,
      unit: material.unit,
      quantity_available: parseFloat(material.quantity_available),
      quantity_used: 0,
      minimum_stock: parseFloat(material.minimum_stock),
      supplier: material.supplier,
      cost_per_unit: parseFloat(material.cost_per_unit)
    }])
    .select();

  return { data, error };
};

// Update material quantity used
export const updateMaterialUsage = async (id, quantity_used) => {
  const { data, error } = await supabase
    .from('materials')
    .update({ quantity_used })
    .eq('id', id)
    .select();

  return { data, error };
};

// Delete material
export const deleteMaterial = async (id) => {
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);

  return { error };
};