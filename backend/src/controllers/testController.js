// Import our database connection
const supabase = require('../config/supabaseClient');

// This function runs when someone calls GET /api/test
const testConnection = async (req, res) => {
  try {
    // Send a lightweight query to Supabase to confirm connection works
    // We ask for the current time from the database
    const { data, error } = await supabase
      .from('_prisma_migrations') // any table, but we'll use a safe built-in check
      .select('*')
      .limit(1);

    // If Supabase returns an error, handle it gracefully
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = "table not found" which is fine — we just want to check connection
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      });
    }

    // If we get here, connection works!
    return res.status(200).json({
      success: true,
      message: 'Supabase connected successfully!',
    });

  } catch (err) {
    // Catch any unexpected errors (network issues, wrong URL, etc.)
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// Export so the route file can use it
module.exports = { testConnection };