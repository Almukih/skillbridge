const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    if (req.method === 'POST' && req.body) {
        console.log('Request body:', { ...req.body, password: '***' });
    }
    next();
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'SkillBridge API is running...',
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        database: 'Connected',
        timestamp: new Date().toISOString()
    });
});

// FIXED: Remove the problematic 404 handler for now
// We'll add a proper one later

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Server Error:', err.message);

    // MongoDB duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate entry found',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    // MongoDB validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors
        });
    }

    // Default error
    res.status(500).json({
        message: 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: http://localhost:3000`);
    console.log(`✅ Backend ready for login/registration requests`);
});