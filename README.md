# SC2006 Frontend - Local Business Crowdfunding Platform

A modern React-based web application for supporting local businesses in Singapore through crowdfunding campaigns, built with Vite and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Maps Integration](#maps-integration)
- [Development](#development)
- [Build & Deployment](#build--deployment)

---

## Overview

This frontend application provides an intuitive interface for three distinct user types:

- **Supporters**: Discover and donate to local business campaigns
- **Business Representatives**: Create campaigns, manage shops, post updates
- **Admins**: Moderate campaigns, manage users, and oversee platform operations

The application emphasizes ease of use, visual appeal, and seamless navigation with interactive maps, real-time updates, and a comprehensive reward system.

---

## Tech Stack

### Core Framework
- **React 19.1.1** - Modern UI library with latest features
- **Vite 7.1.2** - Lightning-fast build tool and dev server
- **@vitejs/plugin-react 5.0.0** - React plugin for Vite with Fast Refresh

### Routing
- **react-router-dom 7.9.3** - Client-side routing with nested routes

### Styling
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **@tailwindcss/vite 4.1.12** - Vite integration for Tailwind
- **Custom CSS** - Additional styling for specific components

### Maps & Visualization
- **leaflet 1.9.4** - Interactive map library
- **react-leaflet 5.0.0** - React bindings for Leaflet
- **leaflet.heat 0.2.0** - Heatmap layer for geographic data

### UI & UX
- **react-toastify 11.0.5** - Toast notifications for user feedback
- **js-cookie 3.0.5** - Cookie management for authentication

### Development Tools
- **ESLint 9.33.0** - Code linting and quality
- **@eslint/js** - ESLint JavaScript configuration
- **eslint-plugin-react-hooks** - React Hooks linting rules
- **eslint-plugin-react-refresh** - React Fast Refresh linting

---

## Features

### 1. User Authentication

**Multiple Login Methods:**
- Email/Password authentication
- Google OAuth2 integration
- Persistent login with JWT cookies
- Role selection for OAuth users

**Account Management:**
- User registration with role selection
- Profile editing
- Password change
- Password reset via email

### 2. Campaign Discovery

**Browse & Search:**
- Grid view of all campaigns
- Filter by category
- Filter by status
- Search by keywords
- Sort options (newest, ending soon, most funded)

**Interactive Map:**
- Leaflet-based geographic discovery
- Shop location markers
- Campaign clustering
- Heatmap visualization
- Click markers for campaign details

### 3. Campaign Pages

**Public View:**
- Campaign details with images
- Progress bar showing funding status
- Reward tiers display
- Donation history
- Social engagement (likes, comments)
- Campaign updates feed

**Business Representative View:**
- Create new campaigns
- Edit campaign details
- Manage reward tiers
- Post updates
- View analytics
- Delete campaigns

### 4. Donation Flow

**Seamless Payment:**
1. Select donation amount
2. Choose reward tier (optional)
3. Add personal message (optional)
4. PayPal payment integration
5. Instant confirmation
6. QR code generation (for rewards)

### 5. Reward System

**For Supporters:**
- View all claimed rewards
- Display QR code proof
- Track redemption status
- Three-stage workflow visualization

**For Business Owners:**
- Create reward tiers
- Set donation thresholds
- Limit availability
- Scan and redeem QR codes
- Track redemption analytics

### 6. Social Features

**Campaign Engagement:**
- Like/unlike campaigns
- Comment on campaigns
- View count tracking
- Share campaigns (planned)

**Update System:**
- Business posts updates
- Supporters receive feed
- Comment on updates
- Like updates
- Rich text formatting

### 7. Shop Management

**For Business Representatives:**
- Register shop with details
- Upload shop photos
- Set geographic location
- Link to campaigns
- Edit shop information

### 8. Admin Dashboard

**Moderation Tools:**
- Campaign approval/rejection
- User management
- Shop verification
- Platform statistics
- Data import/export

**Analytics:**
- Total campaigns, users, donations
- Funding trends
- Category breakdown
- Geographic distribution

### 9. Responsive Design

**Mobile-First Approach:**
- Fully responsive layout
- Touch-friendly interactions
- Optimized images
- Progressive enhancement

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- Backend server running on `http://localhost:3000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd sc2006-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:5173`

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## Project Structure

```
sc2006-fe/
├── public/                  # Static assets
│   └── vite.svg
│
├── src/
│   ├── assets/             # Images, fonts, etc.
│   │
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Footer.jsx      # Footer component
│   │   ├── CampaignCard.jsx # Campaign preview card
│   │   ├── Map.jsx         # Leaflet map component
│   │   └── ...
│   │
│   ├── pages/              # Route-based page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Login page
│   │   ├── Signup.jsx      # Registration page
│   │   │
│   │   ├── campaign/       # Campaign-related pages
│   │   │   ├── CampaignList.jsx
│   │   │   ├── CampaignDetail.jsx
│   │   │   ├── CreateCampaign.jsx
│   │   │   ├── EditCampaign.jsx
│   │   │   └── DonationPage.jsx
│   │   │
│   │   ├── shop/           # Shop pages
│   │   │   ├── CreateShop.jsx
│   │   │   └── EditShop.jsx
│   │   │
│   │   ├── user/           # User pages
│   │   │   ├── Profile.jsx
│   │   │   ├── Rewards.jsx
│   │   │   └── Updates.jsx
│   │   │
│   │   ├── admin/          # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CampaignManagement.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   └── Statistics.jsx
│   │   │
│   │   └── public/         # Public pages
│   │       ├── About.jsx
│   │       ├── Contact.jsx
│   │       ├── FAQ.jsx
│   │       └── HowItWorks.jsx
│   │
│   ├── context/            # React Context for state
│   │   └── AuthContext.jsx # Authentication state
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js      # Authentication hook
│   │   ├── useCampaign.js  # Campaign data hook
│   │   └── useApi.js       # API request hook
│   │
│   ├── utils/              # Utility functions
│   │   ├── api.js          # API client
│   │   ├── auth.js         # Auth helpers
│   │   └── format.js       # Formatting functions
│   │
│   ├── styles/             # Global styles
│   │   └── index.css       # Tailwind imports & custom styles
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global CSS
│
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
├── package.json
└── README.md
```

---

## Routing

### Public Routes
Anyone can access these pages without authentication.

```javascript
/ - Home page
/about - About the platform
/contact - Contact form
/how-it-works - User guide
/terms - Terms and conditions
/discover - Browse campaigns
/map - Geographic campaign map
/campaign/:id - Campaign details (public view)
/login - Login page
/signup - Registration page
/forgot-password - Password reset request
```

### Protected Routes

**Supporter Routes** (SUPPORTER role required):
```javascript
/updates - Feed of updates from backed campaigns
/rewards - View claimed rewards
/rewards/:userRewardId - QR code proof display
/campaign/:id/donation - Donation page
```

**Business Representative Routes**:
```javascript
/campaign - Campaign manager dashboard
/campaign/create - Create new campaign
/campaign/:campaignId/edit - Edit campaign
/campaign/:campaignId/rewards - Manage reward tiers
/updates/new - Create campaign update
/shop/create - Register shop
/campaign/:campaignId/user/:userId/rewards/:userRewardsId/redeem - Verify QR
```

**Admin Routes** (ADMIN role required):
```javascript
/admin - Admin dashboard
/admin/campaign - Campaign moderation
/admin/users - User management
/admin/shop - Shop verification
/admin/stats - Platform statistics
/admin/dataset - Data management
```

### Route Protection Example

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
```

---

## State Management

### Authentication Context

**AuthContext.jsx** provides global authentication state:

```javascript
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**Usage in Components:**
```javascript
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## UI Components

### Reusable Components

#### CampaignCard
Displays campaign preview with image, title, progress bar, and stats.

```javascript
function CampaignCard({ campaign }) {
  const progress = (campaign.currentAmount / campaign.goalAmount) * 100;

  return (
    <div className="campaign-card">
      <img src={campaign.imageUrl} alt={campaign.title} />
      <h3>{campaign.title}</h3>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <p>${campaign.currentAmount} raised of ${campaign.goalAmount}</p>
      <Link to={`/campaign/${campaign.id}`}>View Details</Link>
    </div>
  );
}
```

#### Navbar
Responsive navigation with role-based menu items.

```javascript
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/discover">Discover</Link>
      {user ? (
        <>
          {user.role === 'SUPPORTER' && (
            <>
              <Link to="/updates">Updates</Link>
              <Link to="/rewards">Rewards</Link>
            </>
          )}
          {user.role === 'BUSINESS_REPRESENTATIVE' && (
            <>
              <Link to="/campaign">My Campaigns</Link>
              <Link to="/shop/create">Register Shop</Link>
            </>
          )}
          {user.role === 'ADMIN' && (
            <Link to="/admin">Admin Dashboard</Link>
          )}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

#### Toast Notifications

```javascript
import { toast } from 'react-toastify';

// Success notification
toast.success('Campaign created successfully!');

// Error notification
toast.error('Failed to process donation');

// Info notification
toast.info('Campaign pending approval');

// Custom notification
toast('Processing...', { autoClose: 2000 });
```

---

## API Integration

### API Client Setup

**utils/api.js:**
```javascript
const API_BASE_URL = 'http://localhost:3000';

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include'
    });
    return response.json();
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  upload: async (endpoint, formData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData // Don't set Content-Type for FormData
    });
    return response.json();
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  }
};
```

### Usage Examples

**Fetch Campaigns:**
```javascript
import { api } from '../utils/api';
import { useState, useEffect } from 'react';

function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await api.get('/campaign');
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <div>Loading campaigns...</div>;

  return (
    <div className="campaign-grid">
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.campaignId} campaign={campaign} />
      ))}
    </div>
  );
}
```

**Create Campaign:**
```javascript
async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('goalAmount', goalAmount);
  formData.append('endDate', endDate);
  formData.append('category', category);
  formData.append('shopId', shopId);
  formData.append('image', imageFile);

  try {
    const data = await api.upload('/campaign', formData);
    toast.success('Campaign created! Pending approval.');
    navigate('/campaign');
  } catch (error) {
    toast.error('Failed to create campaign');
  }
}
```

---

## Authentication Flow

### Login Flow

```
User enters credentials → POST /login → Backend validates
                                       ↓
                          Sets JWT cookie ← Returns user data
                                       ↓
              Frontend stores user in AuthContext
                                       ↓
                          Redirects to dashboard
```

### Google OAuth Flow

```
User clicks "Login with Google" → Redirects to Google
                                       ↓
               User authenticates with Google
                                       ↓
          Google redirects to /login/google/callback
                                       ↓
               Backend validates OAuth token
                                       ↓
         New user? → Role selection page (/auth/callback)
         Existing user? → Sets JWT cookie → Redirect to dashboard
```

### Protected Route Access

```
User navigates to /campaign/create
                ↓
    ProtectedRoute checks AuthContext
                ↓
        User authenticated?
        /           \
      NO            YES
       |             |
 Redirect to     Role allowed?
   /login        /           \
               NO            YES
                |             |
          Redirect to     Render page
           homepage
```

---

## Maps Integration

### Leaflet Setup

**Map.jsx Component:**
```javascript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function CampaignMap() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Fetch shop coordinates
    api.get('/shop/map/data').then(setShops);
  }, []);

  return (
    <MapContainer
      center={[1.3521, 103.8198]} // Singapore
      zoom={12}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {shops.map(shop => (
        <Marker
          key={shop.shopId}
          position={[shop.latitude, shop.longitude]}
        >
          <Popup>
            <h3>{shop.name}</h3>
            <p>{shop.campaigns.length} active campaigns</p>
            <Link to={`/shop/${shop.shopId}`}>View Shop</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

### Heatmap Integration

```javascript
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

function Heatmap({ data }) {
  const map = useMap();

  useEffect(() => {
    const points = data.map(d => [d.lat, d.lng, d.intensity]);
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17
    });
    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, map]);

  return null;
}
```

---

## Development

### Available Scripts

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

### Vite Configuration

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

### Tailwind Configuration

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444'
      }
    }
  },
  plugins: []
};
```

---

## Build & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory with:
- Minified JavaScript
- Optimized CSS
- Compressed assets
- Source maps (optional)

### Deployment Options

**Static Hosting (Netlify, Vercel, GitHub Pages):**
```bash
# Build the project
npm run build

# Deploy the dist/ folder
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables for Production:**
- `VITE_API_BASE_URL`: Your production API URL
- Ensure CORS is configured on backend for your domain

---

## Troubleshooting

### Common Issues

**Blank page after deployment:**
- Check browser console for errors
- Ensure `base` path is correct in `vite.config.js`
- Verify API URL is accessible

**Maps not displaying:**
```
Error: Leaflet CSS not loaded
```
- Ensure `import 'leaflet/dist/leaflet.css'` is in your component
- Check marker icons are properly configured

**Authentication not persisting:**
- Verify `credentials: 'include'` is in all fetch requests
- Check backend CORS allows credentials
- Ensure cookies are not being blocked

**Image upload fails:**
- Check file size (backend has 50MB limit)
- Verify Content-Type is not set for FormData
- Ensure proper error handling

---

## Contributing

### Code Style Guidelines

**Component Structure:**
```javascript
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  const handleEvent = () => {
    // Event handler
  };

  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
}

MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default MyComponent;
```

**Naming Conventions:**
- Components: PascalCase (`CampaignCard.jsx`)
- Utilities: camelCase (`formatDate.js`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

---

## License

ISC

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/Ironite01/sc2006-fe/issues
- Email: Contact your project administrator

---

## Acknowledgments

- React team for the amazing library
- Vite team for the blazing-fast tooling
- Leaflet for the mapping capabilities
- Tailwind CSS for the utility-first styling
- All contributors to this project
