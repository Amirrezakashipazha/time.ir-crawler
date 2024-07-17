const express = require('express');
const cors = require('cors');
const app = express();

const crawler = require('../crawlers/crawler');
const { ROUTES } = require('../ROUTES');

app.use(express.static('public'));
app.use(cors({
    origin: "*",
    credentials: false
}));

// Define routes based on your ROUTES configuration
for (let index = 0; index < ROUTES.length; index++) {
    const route = ROUTES[index];
    app.get(route.route, async (req, res) => {
        try {
            const data = await crawler(route.crawler_url, route.crawler, req.query);
            res.json(route.response(data));
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}

module.exports = app;
