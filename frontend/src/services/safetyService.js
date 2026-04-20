import supabase from '../supabaseClient';

// Default checklist items every safety check starts with
export const defaultChecklist = [
  { item: 'Fire extinguisher present and accessible', checked: false },
  { item: 'Workers wearing proper PPE (helmet, vest, boots)', checked: false },
  { item: 'No blocked emergency exits', checked: false },
  { item: 'Electrical wiring properly insulated', checked: false },
  { item: 'Scaffolding properly secured', checked: false },
  { item: 'First aid kit available on site', checked: false },
  { item: 'Warning signs and barriers in place', checked: false },
  { item: 'Equipment in safe working condition', checked: false },
];

// Calculate result based on how many items are checked
export const calculateResult = (checklist) => {
  const total = checklist.length;
  const checked = checklist.filter(item => item.checked).length;

  if (checked === total) return 'pass';
  if (checked === 0) return 'fail';
  return 'partial';
};

// Fetch all safety checks
export const getSafetyChecks = async () => {
  const { data, error } = await supabase
    .from('safety_checks')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

// Create a new safety check
export const createSafetyCheck = async (checkData) => {
  const { data: { user } } = await supabase.auth.getUser();

  const result = calculateResult(checkData.checklist);

  const { data, error } = await supabase
    .from('safety_checks')
    .insert([{
      user_id: user.id,
      area: checkData.area,
      check_date: checkData.check_date,
      checklist: checkData.checklist,
      result: result,
      notes: checkData.notes
    }])
    .select();

  return { data, error };
};

// Delete a safety check
export const deleteSafetyCheck = async (id) => {
  const { error } = await supabase
    .from('safety_checks')
    .delete()
    .eq('id', id);

  return { error };
};