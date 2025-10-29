import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Signup from './pages/signup';
import Login from './pages/login';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/forgot-password/ResetPassword';
import Campaign from './pages/campaign';
import CampaignDetails from './pages/CampaignDetails';
import DonationPage from "./pages/campaign/index.jsx";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/campaign/:id/donation" element={<DonationPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
