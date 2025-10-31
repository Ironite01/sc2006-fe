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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfile from './pages/profile/EditProfile.jsx';
import Admin from './pages/admin/index.jsx';
import AdminDataset from './pages/admin/dataset/index.jsx';
import AdminDatasetViewer from './pages/admin/dataset/filename/index.jsx';

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
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaign/:id/donation" element={<DonationPage />} />
          <Route path="/campaign/create" element={<CampaignForm mode="create" />} />
          <Route path="/campaign/edit" element={<CampaignForm mode="edit" />} />
          <Route path="/campaign/rewards" element={<ManageRewards />} />
          <Route path="/campaign/rewards/:tierId" element={<RewardTier />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dataset" element={<AdminDataset />} />
          <Route path="/admin/dataset/:filename" element={<AdminDatasetViewer />} />
        </Routes>
        <ToastContainer className="toast-container" />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
