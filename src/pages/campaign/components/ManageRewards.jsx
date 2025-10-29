import { Link } from "react-router-dom";
import "./ManageRewards.css"; // optional; create if you want custom styles

// Dummy rewards data – replace with API data later
const rewards = [
  { id: 1, name: "Reward 1", pending: 3, completed: 5, redeemed: 2, total: 10 },
  { id: 2, name: "Reward 2", pending: 1, completed: 2, redeemed: 1, total: 4 },
  { id: 3, name: "Reward 3", pending: 0, completed: 7, redeemed: 4, total: 11 },
  { id: 4, name: "Reward 4", pending: 6, completed: 0, redeemed: 0, total: 6 },
];

export default function ManageRewards() {
  return (
    <div className="manage-rewards-page">
      <h1 className="page-title">My Campaign</h1>
      <h2 className="page-subtitle">Manage Rewards</h2>

      <div className="rewards-list">
        {rewards.map((r) => (
          <div key={r.id} className="reward-row">
            <div className="reward-badge"> {r.name} </div>

            <div className="reward-stats">
              <div>{r.pending} / {r.total} Pending Rewards</div>
              <div>{r.completed} / {r.total} Completed Rewards</div>
              <div>{r.redeemed} / {r.total} Redeemed Rewards</div>
            </div>

            <div className="reward-actions">
              <Link className="view-btn" to={`/campaign/rewards/${r.id}`}>
                View Supporters
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
