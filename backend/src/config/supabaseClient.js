// Import the Supabase library
const { createClient } = require('@supabase/supabase-js');

// Read credentials from environment variables (never hardcode these)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create the Supabase client — this is our "connection" to the database
const supabase = createClient(supabaseUrl, supabaseKey);

// Export it so other files can use it
module.exports = supabase;