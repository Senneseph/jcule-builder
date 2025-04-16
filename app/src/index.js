const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API endpoints for PWA generation
app.post('/api/generate', (req, res) => {
    // TODO: Implement PWA generation logic
    res.json({ status: 'not implemented' });
});

// Start server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Jcule Builder running at http://localhost:${port}`);
    });
}

module.exports = app;