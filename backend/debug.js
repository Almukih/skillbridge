const express = require('express');
const cors = require('cors');

const app = express();

// Test CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());

// Test route
app.post('/api/debug/register', (req, res) => {
    console.log('📨 Received registration request:', req.body);
    res.json({
        success: true,
        message: 'Debug endpoint working',
        receivedData: req.body
    });
});

app.get('/api/debug/test', (req, res) => {
    res.json({ message: 'Debug test endpoint working' });
});

app.listen(5001, () => {
    console.log('🔧 Debug server running on port 5001');
    console.log('Test with: curl -X POST http://localhost:5001/api/debug/register -H "Content-Type: application/json" -d \'{"test":"data"}\'');
});