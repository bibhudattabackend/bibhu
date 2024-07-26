// index.js
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.config();

const app = express();
app.use(cors({
    origin: "https://isattendance.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(helmet());
app.use(cors());
app.use(express.json());

// MongoDB connection and other routes...

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/test') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('API is working!');
    } else {
        app(req, res); // Pass control to Express for all other routes
    }
});

// Define the port to listen on
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
