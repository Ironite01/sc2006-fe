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
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/updates" element={<UserUpdates />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaign/:campaignId/updates/:updateId" element={<Updates />} />
          <Route path="/campaign/:id/donation" element={<DonationPage />} />
          <Route path="/campaign/create" element={<CampaignForm />} />
          <Route path="/campaign/:campaignId/edit" element={<CampaignForm />} />
          <Route path="/campaign/:campaignId/rewards" element={<ManageRewards />} />
          <Route path="/campaign/:campaignId/rewards/:tierId" element={<RewardTier />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/rewards/:userRewardId" element={<RewardProof />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dataset" element={<AdminDataset />} />
          <Route path="/admin/dataset/:filename" element={<AdminDatasetViewer />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/campaign" element={<AdminCampaign />} />
          <Route path="/admin/shop" element={<AdminShop />} /> 
        </Routes>
        <ToastContainer className="toast-container" />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
