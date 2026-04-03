// Load environment variables FIRST — before anything else
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware — runs on every request
app.use(express.json()); // parse JSON request bodies
app.use(cors());         // allow frontend to call this backend

// --- Import and mount routes ---
const testRoute = require('./src/routes/testRoute');

// All routes in testRoute will be prefixed with /api
// So router.get('/test') becomes GET /api/test
app.use('/api', testRoute);

// Root route — just a health check
app.get('/', (req, res) => {
  res.json({ message: 'Construction Tracker API is running!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});