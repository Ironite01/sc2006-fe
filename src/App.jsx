import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Signup from './pages/signup';
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import Campaign from './pages/campaign';
import CampaignDetails from './pages/CampaignDetails';
import DonationPage from './pages/campaign/components/DonationPage.jsx';
import CampaignForm from './pages/campaign/components/CampaignForm.jsx';
import ManageRewards from './pages/campaign/components/ManageRewards.jsx';
import RewardTier from './pages/campaign/components/RewardTier.jsx';
import EditProfile from './pages/profile/EditProfile.jsx';
import Admin from './pages/admin/index.jsx';
import AdminDataset from './pages/admin/dataset/index.jsx';
import AdminDatasetViewer from './pages/admin/dataset/filename/index.jsx';
import AdminUsers from './pages/admin/users/index.jsx';
import AdminCampaign from './pages/admin/campaign/index.jsx';
import Rewards from './pages/rewards/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RewardProof from './pages/rewards/RewardProof.jsx';
import Updates from './pages/campaign/updates/index.jsx';

// VCD Feature Pages
import Dashboard from './pages/Dashboard.jsx';
import BusinessDashboard from './pages/BusinessDashboard.jsx';
import BrowseCampaigns from './pages/BrowseCampaigns.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import CampaignAnalytics from './pages/CampaignAnalytics.jsx';
import ReviewSubmission from './pages/ReviewSubmission.jsx';
import VerifyReward from './pages/VerifyReward.jsx';

// VCD Admin Pages
import AdminLogin from './pages/admin/AdminLogin.jsx';
import PendingCampaigns from './pages/admin/PendingCampaigns.jsx';
import ApprovedCampaigns from './pages/admin/ApprovedCampaigns.jsx';
import SuspendedCampaigns from './pages/admin/SuspendedCampaigns.jsx';
import PlatformStats from './pages/admin/PlatformStats.jsx';

// VCD Public Pages
import About from './pages/public/About.jsx';
import Contact from './pages/public/Contact.jsx';
import FAQ from './pages/public/FAQ.jsx';
import HowItWorks from './pages/public/HowItWorks.jsx';
import TermsConditions from './pages/public/TermsConditions.jsx';

// VCD Update Pages
import UpdatesIndex from './pages/updates/index.jsx';
import UpdateComposer from './pages/updates/UpdateComposer.jsx';
import UpdateComments from './pages/updates/UpdateComments.jsx';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Header onSearch={setSearchQuery} />
      <main>
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/business-dashboard" element={<BusinessDashboard />} />

          {/* Campaign Routes */}
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaigns/browse" element={<BrowseCampaigns />} />
          <Route path="/campaigns/category/:category" element={<CategoryPage />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaign/:campaignId/updates/:updateId" element={<Updates />} />
          <Route path="/campaign/:id/donation" element={<DonationPage />} />
          <Route path="/campaign/create" element={<CampaignForm mode="create" />} />
          <Route path="/campaign/edit" element={<CampaignForm mode="edit" />} />
          <Route path="/campaign/:campaignId/analytics" element={<CampaignAnalytics />} />
          <Route path="/campaign/review" element={<ReviewSubmission />} />

          {/* Rewards Routes */}
          <Route path="/campaign/:campaignId/rewards" element={<ManageRewards />} />
          <Route path="/campaign/:campaignId/rewards/:tierId" element={<RewardTier />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/rewards/:userRewardId" element={<RewardProof />} />
          <Route path="/rewards/verify" element={<VerifyReward />} />

          {/* Updates Routes */}
          <Route path="/updates" element={<UpdatesIndex />} />
          <Route path="/updates/create" element={<UpdateComposer />} />
          <Route path="/updates/:updateId/comments" element={<UpdateComments />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/pending" element={<PendingCampaigns />} />
          <Route path="/admin/approved" element={<ApprovedCampaigns />} />
          <Route path="/admin/suspended" element={<SuspendedCampaigns />} />
          <Route path="/admin/stats" element={<PlatformStats />} />
          <Route path="/admin/dataset" element={<AdminDataset />} />
          <Route path="/admin/dataset/:filename" element={<AdminDatasetViewer />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/campaign" element={<AdminCampaign />} />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/terms" element={<TermsConditions />} />
        </Routes>
        <ToastContainer className="toast-container" />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
