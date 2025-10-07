import { useState } from 'react';
import CampaignManager from './components/CampaignManager';
import CampaignForm from './components/CampaignForm';
import './Campaign.css';

export default function Campaign() {
    const [activeTab, setActiveTab] = useState('campaign-manager');
    const [showForm, setShowForm] = useState(false);

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
                            UPDATE COMPOSER
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="campaign-content">
                        {activeTab === 'campaign-manager' && (
                            <CampaignManager onCreateCampaign={handleCreateCampaign} />
                        )}

                        {activeTab === 'update-composer' && (
                            <div className="update-composer-placeholder">
                                <h2>UPDATE COMPOSER</h2>
                                <p>this section would contain the update composer functionality</p>
                            </div>
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
