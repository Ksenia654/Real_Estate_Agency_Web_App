import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:5000/api/requests");
                setRequests(res.data);
            } catch (err) {
                setError("Ошибка загрузки заявок");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await axios.patch(`http://localhost:5000/api/requests/${id}/status`, { status });
            setRequests((prev) =>
                prev.map((req) => (req._id === id ? { ...req, status: res.data.status } : req))
            );
        } catch (err) {
            console.error("Ошибка обновления статуса", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Заявки пользователей</h2>

            {loading && <p>Загрузка...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {requests.map((req) => (
                    <li key={req._id} style={{ marginBottom: "12px" }}>
                        <strong>Объект:</strong>{" "}
                        {typeof req.property === "object" ? req.property.title : req.property}
                        {" | "}
                        <strong>Пользователь:</strong>{" "}
                        {typeof req.user === "object" ? req.user.username : req.user}
                        {" | "}
                        <strong>Статус:</strong> {req.status}
                        <div style={{ marginTop: "6px" }}>
                            {req.status === "waiting" && (
                                <>
                                    <button onClick={() => updateStatus(req._id, "approved")}>Одобрить</button>
                                    <button
                                        onClick={() => updateStatus(req._id, "rejected")}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Отклонить
                                    </button>
                                </>
                            )}
                            {req.status === "approved" && (
                                <>
                                    <span style={{ color: "green" }}>✅ Одобрено</span>
                                    <Link to={`/admin/deals?requestId=${req._id}`} style={{ marginLeft: 10 }}>
                                        Перейти к сделке
                                    </Link>
                                </>
                            )}
                            {req.status === "rejected" && <span style={{ color: "red" }}>❌ Отклонено</span>}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminRequests;
