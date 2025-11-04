import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RewardTier.css";
import { campaigns, rewards } from "../../../../paths";
import { toast } from "react-toastify";
import { USER_REWARDS_STATUS } from '../../../helpers/constants';

export default function RewardTier() {
  const { tierId, campaignId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (tierId, campaignId) {
      getRewardSupporters();
    }
  }, [tierId, campaignId]);

  async function getRewardSupporters() {
    const res = await fetch(rewards.getById(campaignId, tierId), {
      method: 'GET',
      credentials: 'include'
    });

    if (!res.ok) {
      toast.error("Unable to get supporters!");
      return;
    }

    const data = await res.json();
    setRows(data.map((d) => ({
      id: d.userRewardId,
      userId: d.userId,
      name: d.userName,
      email: d.userEmail,
      claimDate: d?.claimedAt ? new Date(d?.claimedAt).toLocaleString() : null,
      status: d.status,
      rewardName: d.rewardName
    })));
  }

  const markCompleted = async (id, userId) => {
    const res = await fetch(campaigns.userReward(campaignId, userId, id), {
      method: 'PUT',
      credentials: 'include'
    });

    if (!res.ok) {
      toast.error("Something went wrong completing the rewarding...");
      return;
    }
    toast.info("You have mark the user reward as completed!");
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, status: USER_REWARDS_STATUS.COMPLETED.toLowerCase() } : r))
    );
  };

  return (
    <div className="reward-tier-page">
      <h1 className="page-title">My Campaign</h1>
      <h2 className="page-subtitle">Manage Rewards</h2>

      <div className="tier-header">
        <div className="tier-pill">{rows[0]?.rewardName || `Reward ${tierId}`}</div>
        <button className="back-link" onClick={() => navigate(`/campaign/${campaignId}/rewards`)}>
          ← Back to Rewards
        </button>
      </div>

      <div className="table-wrap">
        <table className="supporters-table">
          <thead>
            <tr>
              <th>Supporter</th>
              <th>Contact Information</th>
              <th>Claim Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No supporters yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.claimDate}</td>
                  <td>{r.status}</td>
                  <td>
                    {r.status === USER_REWARDS_STATUS.PENDING.toLowerCase() ? (
                      <button className="mark-btn" onClick={() => markCompleted(r.id, r.userId)}>
                        Mark Completed
                      </button>
                    ) : (
                      "NA"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
