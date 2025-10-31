import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Signup from './pages/signup';
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import Campaign from './pages/campaign';
import CampaignDetails from './pages/CampaignDetails';
import DonationPage from './pages/campaign/components/DonationPage.jsx';
import CampaignForm from './pages/campaign/components/CampaignForm.jsx';
import ManageRewards from './pages/campaign/components/ManageRewards.jsx';
import RewardTier from './pages/campaign/components/RewardTier.jsx';

// Supporter Pages
import MyRewards from './pages/rewards';
import RewardProof from './pages/rewards/RewardProof';
import VerifyReward from './pages/VerifyReward';
import Updates from './pages/updates';
import EditProfile from './pages/profile/EditProfile';
import Dashboard from './pages/Dashboard';
import BrowseCampaigns from './pages/BrowseCampaigns';

// Business Representative Pages
import ViewSupporters from './pages/campaign/components/ViewSupporters';
import CampaignComments from './pages/campaign/components/CampaignComments';
import BusinessDashboard from './pages/BusinessDashboard';
import CampaignAnalytics from './pages/CampaignAnalytics';
import ReviewSubmission from './pages/ReviewSubmission';

// Administrator Pages
import AdminLogin from './pages/admin/AdminLogin';
import PendingCampaigns from './pages/admin/PendingCampaigns';
import ApprovedCampaigns from './pages/admin/ApprovedCampaigns';
import SuspendedCampaigns from './pages/admin/SuspendedCampaigns';
import PlatformStats from './pages/admin/PlatformStats';

// Public Pages
import TermsConditions from './pages/public/TermsConditions';
import FAQ from './pages/public/FAQ';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import HowItWorks from './pages/public/HowItWorks';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Header onSearch={setSearchQuery} />
      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home searchQuery={searchQuery} />} />

          {/* Authentication */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Supporter Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<BrowseCampaigns />} />
          <Route path="/rewards" element={<MyRewards />} />
          <Route path="/rewards/:id" element={<RewardProof />} />
          <Route path="/verify-reward/:id" element={<VerifyReward />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/profile/edit" element={<EditProfile />} />

          {/* Campaign Routes */}
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaign/:id/donation" element={<DonationPage />} />
          <Route path="/campaign/:id/comments" element={<CampaignComments />} />
          <Route path="/campaign/:id/analytics" element={<CampaignAnalytics />} />
          <Route path="/campaign/create" element={<CampaignForm mode="create" />} />
          <Route path="/campaign/edit" element={<CampaignForm mode="edit" />} />
          <Route path="/campaign/review" element={<ReviewSubmission />} />
          <Route path="/campaign/rewards" element={<ManageRewards />} />
          <Route path="/campaign/rewards/:tierId" element={<RewardTier />} />
          <Route path="/campaign/rewards/:tierId/supporters" element={<ViewSupporters />} />

          {/* Business Representative Dashboard */}
          <Route path="/business/dashboard" element={<BusinessDashboard />} />

          {/* Administrator Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/pending" element={<PendingCampaigns />} />
          <Route path="/admin/approved" element={<ApprovedCampaigns />} />
          <Route path="/admin/suspended" element={<SuspendedCampaigns />} />
          <Route path="/admin/stats" element={<PlatformStats />} />

          {/* Public Pages */}
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
