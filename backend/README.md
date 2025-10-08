# Backend API Server

Node.js/Express backend for authentication and user management.

## Features

- User registration with profile picture upload
- User login with JWT authentication
- Password hashing with bcrypt
- Cookie-based session management
- CORS enabled for frontend at localhost:5173
- File upload handling with multer

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
# or
npm run dev
```

Server will run on http://localhost:3000

## API Endpoints

### POST /register
Register a new user

**Body (multipart/form-data):**
- username (string, required)
- email (string, required)
- password (string, required)
- user_type (string, required): "Supporter" or "business_representative"
- profilePicture (file, optional): JPEG/PNG image

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "user_type": "Supporter",
    "profilePicture": "http://localhost:3000/uploads/..."
  },
  "profilePicture": "http://localhost:3000/uploads/..."
}
```

### POST /login
Login with username/email and password

**Body (urlencoded):**
- username (string, required): username or email
- password (string, required)

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "user_type": "Supporter",
    "profilePicture": "http://localhost:3000/uploads/..."
  },
  "profilePicture": "http://localhost:3000/uploads/..."
}
```

### POST /logout
Logout current user

**Response:**
```json
{
  "message": "Logout successful"
}
```

### GET /auth/check
Check if user is authenticated (requires authentication)

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "user_type": "Supporter",
    "profilePicture": "http://localhost:3000/uploads/..."
  }
}
```

### GET /users
Get all users (requires authentication)

**Response:**
```json
{
  "users": [...]
}
```

## Notes

- Data is stored in memory (users array) - will be lost on server restart
- For production, replace with a real database (MongoDB, PostgreSQL, etc.)
- Change JWT_SECRET in production
- Profile pictures are stored in `uploads/` directory
- Maximum file size: 5MB
- Allowed image types: JPEG, PNG

## Security Considerations

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 7 days
- Cookies are httpOnly for token (prevents XSS)
- CORS configured for specific origin
- File upload validation (type and size)

## Future Improvements

- Add database integration (MongoDB/PostgreSQL)
- Add email verification
- Add password reset functionality
- Add refresh token mechanism
- Add rate limiting
- Add input sanitization
- Add logging system
