import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminDataset.css";
import { admin } from "../../../../paths";

export default function DatasetTable() {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [datasets, setDatasets] = useState(new Set([]));

    useEffect(() => {
        getDatasets();
    }, []);

    async function getDatasets() {
        const res = await fetch(admin.datasets, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            toast.error("Unable to fetch datasets...");
            return;
        }
        const { datasets } = await res.json();
        setDatasets(new Set(datasets));
    }

    const handleDelete = async (filename) => {
        if (!confirm(`Confirm delete ${filename}?`)) return;
        const res = await fetch(admin.dataset(filename), {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) {
            toast.error(`An error occured deleting dataset with name: ${filename}`);
            return;
        }
        setDatasets(new Set([...datasets].filter((file) => file !== filename)));
        toast.success("File deleted successfully!");
    };

    const handleOpen = (filename) => {
        navigate(`/admin/dataset/${filename}`);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (datasets.has(file.name)) {
            if (!confirm("A dataset with a name already exists! Would you like to overwrite it?")) return;
        }

        const formData = new FormData();
        formData.append("dataset", file);

        setUploading(true);
        try {
            const res = await fetch(admin.datasets, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
            if (!res.ok) {
                throw new Error("Failed to upload dataset.");
            }
            toast.success("Dataset uploaded successfully!");
            setDatasets(datasets.add(file.name));
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="dataset-container">
            <div className="header-row">
                <div className="viewer-header">
                    <button className="back-btn" onClick={() => navigate("/admin")}>←</button>
                    <h2>Datasets</h2>
                </div>
                <label className="upload-btn">
                    {uploading ? "Uploading..." : "Upload Dataset"}
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>
            <table className="dataset-table">
                <thead>
                    <tr>
                        <th className="filename-col">Filename</th>
                        <th className="actions-col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...datasets].map((file) => (
                        <tr key={file}>
                            <td className="filename-col">{file}</td>
                            <td className="actions-col">
                                <button className="delete-btn" onClick={() => handleDelete(file)}>Delete</button>
                                <button className="open-btn" onClick={() => handleOpen(file)}>Open</button>
                            </td>
                        </tr>
                    ))}
                    {datasets.size === 0 && (
                        <tr>
                            <td colSpan="2" className="no-data">
                                No datasets available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}