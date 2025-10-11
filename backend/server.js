require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

const users = [];

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;

    let user = users.find(u => u.googleId === profile.id);

    if (!user) {
        user = users.find(u => u.email === email);

        if (!user) {
            return done(null, false, { message: 'Please register first before using Google login' });
        }

        user.googleId = profile.id;
        user.picture = profile.photos[0]?.value;
    }

    return done(null, user);
}));

passport.use('azure', new OAuth2Strategy({
    authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.AZURE_CALLBACK_URL,
    scope: ['openid', 'profile', 'email', 'User.Read']
}, async (accessToken, refreshToken, params, profile, done) => {
    try {
        const userInfoResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = await userInfoResponse.json();

        const email = userInfo.mail || userInfo.userPrincipalName;

        let user = users.find(u => u.azureId === userInfo.id);

        if (!user) {
            user = users.find(u => u.email === email);

            if (!user) {
                return done(null, false, { message: 'Please register first before using Microsoft login' });
            }

            user.azureId = userInfo.id;
            user.picture = null;
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret');
        req.user = users.find(u => u.id === decoded.userId);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

app.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name
        };

        users.push(newUser);

        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET || 'jwt-secret',
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Registration successful',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = users.find(u => u.email === email);

        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'jwt-secret',
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/login/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=registration_required`,
        failureMessage: true
    }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.id },
            process.env.JWT_SECRET || 'jwt-secret',
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    }
);

app.get('/login/azure', passport.authenticate('azure', {
    scope: ['openid', 'profile', 'email']
}));

app.get('/auth/azure/callback',
    passport.authenticate('azure', {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=registration_required`,
        failureMessage: true
    }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user.id },
            process.env.JWT_SECRET || 'jwt-secret',
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
    }
);

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    req.logout(() => {
        res.json({ message: 'Logout successful' });
    });
});

app.post('/switch-account', (req, res) => {
    res.clearCookie('token');
    req.logout(() => {
        res.json({
            message: 'Account switched successfully',
            redirectToLogin: true
        });
    });
});

app.get('/auth/check', authenticateJWT, (req, res) => {
    res.json({
        authenticated: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            picture: req.user.picture
        }
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'SC2006 Backend API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
