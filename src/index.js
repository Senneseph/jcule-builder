const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('builder', {
        title: 'PWA Builder'
    });
});

// API endpoints for PWA generation
app.post('/api/generate', (req, res) => {
    // TODO: Implement PWA generation logic
    res.json({ status: 'not implemented' });
});

app.listen(port, () => {
    console.log(`PWA Builder running at http://localhost:${port}`);
});