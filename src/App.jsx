import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './pages/signup';
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import Campaign from './pages/campaign';
import CampaignDetails from './pages/CampaignDetails';
import AuthCallback from './pages/auth/AuthCallback';
import DonationPage from "./pages/campaign/components/DonationPage.jsx";

// Profile pages
import EditProfile from './pages/profile/EditProfile';
import RewardsPage from './pages/profile/RewardsPage';
import RewardProof from './pages/profile/RewardProof';

// Campaign components
import UpdateComposer from './pages/campaign/components/UpdateComposer';

// Static pages
import FAQ from './pages/static/FAQ';
import ContactUs from './pages/static/ContactUs';
import AboutUs from './pages/static/AboutUs';
import HowItWorks from './pages/static/HowItWorks';
import TermsAndConditions from './pages/static/TermsAndConditions';


function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Header onSearch={setSearchQuery} />
      <main>
        <Routes>
          {/* Home & Auth */}
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Campaign Routes */}
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaign/:id/donation" element={<DonationPage />} />
          <Route path="/campaign/:id/updates" element={<UpdateComposer />} />

          {/* Profile Routes */}
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/rewards/:rewardId" element={<RewardProof />} />
          <Route path="/reward/:rewardId" element={<RewardProof />} />

          {/* Static/Info Routes */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* Alias for updates - shows user's updates feed */}
          <Route path="/updates" element={<RewardsPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
