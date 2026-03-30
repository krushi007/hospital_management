const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static media files
const mediaPath = path.resolve(__dirname, 'media');
app.use('/media', express.static(mediaPath));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medcore';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Basic routes
app.get('/', (req, res) => res.json({ message: 'Welcome to the Node.js Hospital Management API' }));
app.get('/api/health', (req, res) => res.json({ status: 'healthy', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/pharmacy', require('./routes/pharmacy'));
app.use('/api/ai_engine', require('./routes/aiEngine'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/labs', require('./routes/labs'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/notifications', require('./routes/notifications'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});
