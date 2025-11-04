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
import TermsAndConditions from './pages/terms';
import ContactUs from './pages/contact';
import HowItWorks from './pages/how-it-works';
import ComingSoon from './pages/coming-soon';
import Campaign from './pages/campaign/CampaignManager';
import CampaignDetails from './pages/campaign/CampaignDetails';
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
import AdminShop from "./pages/admin/shop/index.jsx"
import Rewards from './pages/rewards/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RewardProof from './pages/rewards/RewardProof.jsx';
import Updates from './pages/campaign/updates/index.jsx';
import UserUpdates from './pages/updates/index.jsx';
import AuthCallback from './pages/auth/AuthCallback.jsx';
import RedeemUserReward from './pages/campaign/rewards/RedeemUserReward.jsx';
import RegisterShop from "./pages/shop/RegisterShop.jsx";
import RequireRole from './helpers/RequireRole.jsx';
import CampaignManager from './pages/campaign/CampaignManager.jsx';
import UpdateComposer from './pages/campaign/components/UpdateComposer.jsx';


function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <Header onSearch={setSearchQuery} />
      <main>
        <Routes>
          {/* =========================
              GENERAL + PROFILE (everyone)
             ========================= */}
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/profile" element={<EditProfile />} />

          {/* =========================
              SUPPORTER-ONLY PAGES
             ========================= */}
          {/* UserUpdates page (you said only supporters) */}
          <Route
            path="/updates"
            element={
              <RequireRole allowedRoles={['SUPPORTER']}>
                <UserUpdates />
              </RequireRole>
            }
          />

          {/* Donation page (supporters donate) */}
          <Route
            path="/campaign/:id/donation"
            element={
              <RequireRole allowedRoles={['SUPPORTER']}>
                <DonationPage />
              </RequireRole>
            }
          />

          {/* Rewards pages (supporter only) */}
          <Route
            path="/rewards"
            element={
              <RequireRole allowedRoles={['SUPPORTER']}>
                <Rewards />
              </RequireRole>
            }
          />
          <Route
            path="/rewards/:userRewardId"
            element={
              <RequireRole allowedRoles={['SUPPORTER']}>
                <RewardProof />
              </RequireRole>
            }
          />

          {/* =========================
              BUSINESS REP-ONLY PAGES
             ========================= */}
          {/* Main campaign page (business rep landing) */}
          <Route
            path="/campaign"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <CampaignManager />
              </RequireRole>
            }
          />

          <Route
            path="/updates/new"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <UpdateComposer />
              </RequireRole>
            }
          />

          {/* Campaign details (you said all campaign pages = biz rep only) */}
          <Route
            path="/campaign/:id"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <CampaignDetails />
              </RequireRole>
            }
          />

          {/* Per-campaign update page (biz rep only) */}
          <Route
            path="/campaign/:campaignId/updates/:updateId"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <Updates />
              </RequireRole>
            }
          />

          {/* Create / edit campaign (biz rep only) */}
          <Route
            path="/campaign/create"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <CampaignForm />
              </RequireRole>
            }
          />
          <Route
            path="/campaign/:campaignId/edit"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <CampaignForm />
              </RequireRole>
            }
          />

          {/* Manage rewards for campaign (biz rep only) */}
          <Route
            path="/campaign/:campaignId/rewards"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <ManageRewards />
              </RequireRole>
            }
          />
          <Route
            path="/campaign/:campaignId/rewards/:tierId"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <RewardTier />
              </RequireRole>
            }
          />
          <Route
            path="/campaign/:campaignId/user/:userId/rewards/:userRewardsId/redeem"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <RedeemUserReward />
              </RequireRole>
            }
          />

          {/* Shop registration (biz rep only) */}
          <Route
            path="/shop/create"
            element={
              <RequireRole allowedRoles={['BUSINESS_REPRESENTATIVE']}>
                <RegisterShop />
              </RequireRole>
            }
          />

          {/* =========================
              ADMIN-ONLY PAGES
             ========================= */}
          <Route
            path="/admin"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <Admin />
              </RequireRole>
            }
          />
          <Route
            path="/admin/dataset"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminDataset />
              </RequireRole>
            }
          />
          <Route
            path="/admin/dataset/:filename"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminDatasetViewer />
              </RequireRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminUsers />
              </RequireRole>
            }
          />
          <Route
            path="/admin/campaign"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminCampaign />
              </RequireRole>
            }
          />
          <Route
            path="/admin/shop"
            element={
              <RequireRole allowedRoles={['ADMIN']}>
                <AdminShop />
              </RequireRole>
            }
          />
        </Routes>

        <ToastContainer className="toast-container" />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;