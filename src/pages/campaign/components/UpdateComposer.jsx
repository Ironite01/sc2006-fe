import { useEffect, useState } from "react";
import { updates as updatesPath } from "../../../../paths";
import "./UpdateComposer.css";
import { toast } from "react-toastify";
import UpdateComposterModal from "./UpdateComposerModal";
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../../../helpers/constants";
import getUser from "../../../helpers/getUser";
import { campaigns as campaignsPath } from "../../../../paths";

export default function UpdateComposer() {
  const navigate = useNavigate();
  const [selectedCampaignId, setSelectCampaignId] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
    setSelectCampaignId(data.campaigns[0].id);
  }

  useEffect(() => {
    getUpdates();
  }, [selectedCampaignId]);

  async function getUpdates() {
    const res = await fetch(updatesPath.getAllByCampaignId(selectedCampaignId || campaigns[0]?.id), {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) {
      toast.error("Failed to get updates!");
      return;
    }

    const data = await res.json();
    setUpdates(data);
  }

  async function deleteUpdate(updateId) {
    if (!confirm("Are you sure you want to delete this update!")) return;
    const res = await fetch(updatesPath.getById(selectedCampaignId, updateId), {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      toast.error("Failed to delete update!");
      return;
    }

    location.reload();
  }

  return (
    <div className="update-composter-container">
      <UpdateComposterModal isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setSelectedUpdate(null);
      }} selectedCampaignId={selectedCampaignId}
        update={selectedUpdate}
        selectedCampaignName={campaigns?.find(c => parseInt(c.id) === parseInt(selectedCampaignId))?.name} />
      <div className="header-row">
        <div className="filter-controls">
          <label>Your updates:</label>
          <select
            value={selectedCampaignId}
            onChange={(e) => {
              setSelectCampaignId(e.target.value);
            }}
            className="status-filter"
          >
            {campaigns.map(c =>
              <option key={c.id} value={c.id}>{c.name}</option>
            )}
          </select>
        </div>
        <button className="compose-button" onClick={() => setIsOpen(true)}>Compose new update</button>
      </div>

      <div className="updates-table-container">
        <table className="updates-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Content</th>
              <th>Posted At</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((update) => (
              <tr key={update.updateId}>
                <td>{update.updateId}</td>
                <td>
                  {update.image ? (
                    <img
                      src={update.image}
                      alt={update.title}
                      className="campaign-image"
                    />
                  ) : (
                    <div className="campaign-image-placeholder">No Image</div>
                  )}
                </td>
                <td>
                  <strong>{update.title}</strong>
                  <br />
                  {update.description?.substring(0, 50)}...
                </td>
                <td>{new Date(update.postedAt).toLocaleDateString()}</td>
                <td>{update.likeCount}</td>
                <td>{update.commentCount}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => navigate(`/campaign/${selectedCampaignId}/updates/${update.updateId}`)}
                      className="go-btn"
                    >
                      Go
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUpdate(update);
                        setIsOpen(true);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUpdate(update.updateId)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {updates.length === 0 && (
          <div className="no-data">No updates found</div>
        )}
      </div>
    </div>
  )
}
