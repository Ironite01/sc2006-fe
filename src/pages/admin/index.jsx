import { useEffect, useState } from "react";
import "./Admin.css";
import { admin } from "../../../paths";
import { toast } from "react-toastify";

export default function Admin() {
    const [noOfDatasets, setNoOfDatasets] = useState(0);
    const [noOfCampaigns, setNoOfCampaigns] = useState(0);
    const [noOfUsers, setNoOfUsers] = useState(0);

    useEffect(() => {
        getNumberOfDatasets();
        getNumberOfCampaigns();
        getNumberOfUsers();
    }, []);

    async function getNumberOfDatasets() {
        const res = await fetch(admin.datasets, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            toast.error("Unable to fetch datasets...");
            return;
        }
        const { datasets } = await res.json();
        setNoOfDatasets(datasets.length);
    }

    async function getNumberOfCampaigns() {
        const res = await fetch(admin.campaigns, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            toast.error("Unable to fetch campaigns...");
            return;
        }
        const { campaigns } = await res.json();
        setNoOfCampaigns(campaigns.length);
    }

    async function getNumberOfUsers() {
        const res = await fetch(admin.users, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            toast.error("Unable to fetch users...");
            return;
        }
        const { users } = await res.json();
        setNoOfUsers(users.length);
    }

    const cards = [
        { title: "Datasets", value: noOfDatasets, description: "Click to view all datasets", link: 'dataset' },
        { title: "Campaigns", value: noOfCampaigns, description: "Click to review all campaigns", link: 'campaign' },
        { title: "User Management", value: noOfUsers, description: "Click here to manage users", link: 'users' }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Please note that all pages here are restricted</p>
            </div>

            <main className="dashboard-grid">
                {cards.map((card, idx) => (
                    <a href={`/admin/${card.link}`} className={card?.disabled ? 'disabled' : ''} onClick={(e) => {
                        if (card?.disabled) e.preventDefault()
                    }}>
                        <div key={idx} className="dashboard-card">
                            <h2>{card.title}</h2>
                            <p className="value">{card.value}</p>
                            <p className="description">{card.description}</p>
                        </div>
                    </a>
                ))}
            </main>
        </div>
    );
}