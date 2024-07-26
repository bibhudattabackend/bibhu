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
app.use(helmet());
app.use(cors({
    origin: "https://isattendance.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Define your schemas and models...
// User schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    contactMethod: { type: String, enum: ['email', 'mobile'], required: true },
    emailOrMobile: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' } // Role field
});

const User = mongoose.model('User', userSchema);

// Define other schemas: Attendance, Course, Instructor...

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied, admin only' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Define your routes (register, login, attendance, records, etc.)
// Example: User registration
app.post('/api/register', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dob,
            contactMethod,
            emailOrMobile,
            gender,
            username,
            password,
            role
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = role === 'admin' ? 'admin' : 'user';

        const newUser = new User({
            firstName,
            lastName,
            dob,
            contactMethod,
            emailOrMobile,
            gender,
            username,
            password: hashedPassword,
            role: assignedRole
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Other routes...

const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
