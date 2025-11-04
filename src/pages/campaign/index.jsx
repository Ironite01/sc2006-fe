import { useState, useEffect } from 'react';
import CampaignManager from './components/CampaignManager';
import CampaignForm from './components/CampaignForm';
import './Campaign.css';
import UpdateComposer from "./components/UpdateComposer";
import getUser from '../../helpers/getUser';
import { USER_ROLES } from '../../helpers/constants';
import { toast } from 'react-toastify';
import { campaigns as campaignsPath } from '../../../paths';

export default function Campaign() {
    const [activeTab, setActiveTab] = useState('campaign-manager');
    const [showForm, setShowForm] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        getCampaigns();
    }, []);

    async function getCampaigns() {
        const user = await getUser();
        if (!user || user.role !== USER_ROLES.BUSINESS_REPRESENTATIVE) {
            toast.error("This page is only for business representatives!");
            navigate("/");
            return;
        }
        const res = await fetch(`${campaignsPath.get}?userId=${user.userId}?offset=10000`, {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        setCampaigns(data.campaigns);
    }

    const handleCreateCampaign = () => {
        setShowForm(true);
    };

    const handleBackToManager = () => {
        setShowForm(false);
    };

    return (
        <div className="campaign-container">
            {!showForm && (
                <>
                    {/* Navigation Tabs */}
                    <div className="campaign-nav">
                        <button
                            className={`nav-tab ${activeTab === 'campaign-manager' ? 'active' : ''}`}
                            onClick={() => setActiveTab('campaign-manager')}
                        >
                            Campaign Manager
                        </button>
                        <button
                            className={`nav-tab ${activeTab === 'update-composer' ? 'active' : ''}`}
                            onClick={() => setActiveTab('update-composer')}
                        >
                            Update Composer
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="campaign-content">
                        {activeTab === 'campaign-manager' && (
                            <CampaignManager campaigns={campaigns} onCreateCampaign={handleCreateCampaign} />
                        )}

                        {activeTab === 'update-composer' && (
                            <UpdateComposer campaigns={campaigns} />
                        )}

                    </div>
                </>
            )}

            {showForm && (
                <div className="campaign-form-wrapper">
                    <div className="form-header">
                        <button onClick={handleBackToManager} className="back-btn">
                            ← Back to Campaign Manager
                        </button>
                    </div>
                    <CampaignForm />
                </div>
            )}
        </div>
    );
}
