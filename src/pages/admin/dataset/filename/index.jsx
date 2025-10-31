import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { admin } from "../../../../../paths";
import "./AdminDatasetViewer.css";

export default function AdminDatasetViewer() {
    const navigate = useNavigate();
    const { filename } = useParams(); // filename
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDataset();
    }, [filename]);

    async function fetchDataset() {
        try {
            const res = await fetch(admin.dataset(filename), {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) {
                toast.error("Failed to fetch dataset.");
                return;
            }
            const { data } = await res.json();
            setData(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="dataset-viewer-container"><p>Loading dataset...</p></div>;

    if (!data || data.length === 0) {
        return (
            <div className="dataset-viewer-container">
                <h2>{filename}</h2>
                <p>No data available in this dataset.</p>
            </div>
        );
    }

    const columns = Object.keys(data[0]);

    return (
        <div className="dataset-viewer-container">
            <div className="viewer-header">
                <button className="back-btn" onClick={() => navigate("/admin/dataset")}>←</button>
                <h2>{filename}</h2>
            </div>
            <div className="table-wrapper">
                <table className="dataset-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                {columns.map((col) => (
                                    <td key={col}>{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}