const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only JPEG and PNG images are allowed'));
        }
    }
});

const users = [];

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

app.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
        const { username, email, password, user_type } = req.body;

        if (!username || !email || !password || !user_type) {
            return res.status(400).json({
                message: 'All fields are required',
                field: 'general'
            });
        }

        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({
                message: 'Username already exists',
                field: 'username'
            });
        }

        const existingEmail = users.find(u => u.email === email);
        if (existingEmail) {
            return res.status(400).json({
                message: 'Email already exists',
                field: 'email'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePicture = null;
        if (req.file) {
            profilePicture = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        }

        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            user_type,
            profilePicture,
            createdAt: new Date()
        };

        users.push(user);

        const token = jwt.sign(
            { id: user.id, username: user.username, user_type: user.user_type },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

        res.cookie('user', JSON.stringify({ username: user.username, user_type: user.user_type }), {
            httpOnly: false,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                profilePicture: user.profilePicture
            },
            profilePicture: user.profilePicture
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration',
            field: 'general'
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        const user = users.find(u => u.username === username || u.email === username);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, user_type: user.user_type },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

        res.cookie('user', JSON.stringify({ username: user.username, user_type: user.user_type }), {
            httpOnly: false,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                profilePicture: user.profilePicture
            },
            profilePicture: user.profilePicture
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login'
        });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('user');
    res.json({ message: 'Logout successful' });
});

app.get('/auth/check', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
        authenticated: true,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            user_type: user.user_type,
            profilePicture: user.profilePicture
        }
    });
});

app.get('/users', authMiddleware, (req, res) => {
    const userList = users.map(({ password, ...user }) => user);
    res.json({ users: userList });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('Frontend should be running on http://localhost:5173');
});
