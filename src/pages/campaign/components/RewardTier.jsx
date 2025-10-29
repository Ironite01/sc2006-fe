import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./RewardTier.css";

// Mock supporters per tier – swap with API later
const MOCK = {
  1: [
    { id: 101, name: "John Tan", email: "john@email.com", claimDate: "2025-08-15", status: "Pending" },
    { id: 102, name: "Sarah Lee", email: "sarah@email.com", claimDate: "2025-08-18", status: "Completed" },
    { id: 103, name: "Sandra Ong", email: "sandra@email.com", claimDate: "2025-08-31", status: "Redeemed" },
  ],
  2: [],
  3: [],
  4: [],
};

export default function RewardTier() {
  const { tierId } = useParams();
  const navigate = useNavigate();
  const initial = useMemo(() => MOCK[tierId] ?? [], [tierId]);
  const [rows, setRows] = useState(initial);

  const markCompleted = (id) => {
    setRows((rs) =>
      rs.map((r) => (r.id === id ? { ...r, status: "Completed" } : r))
    );
  };

  return (
    <div className="reward-tier-page">
      <h1 className="page-title">My Campaign</h1>
      <h2 className="page-subtitle">Manage Rewards</h2>

      <div className="tier-header">
        <div className="tier-pill">Reward {tierId}</div>
        <button className="back-link" onClick={() => navigate("/campaign/rewards")}>
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
                    {r.status === "Pending" ? (
                      <button className="mark-btn" onClick={() => markCompleted(r.id)}>
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
