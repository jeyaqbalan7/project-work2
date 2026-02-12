const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CineSync Backend is running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/messages', require('./routes/messages'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
