import React, { useEffect, useState } from "react";
import axios from "axios";
import Request from "../components/Request";

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.get(
                    `http://localhost:5000/api/requests/my?userId=${userId}`,
                    {
                        headers: { "x-auth-token": localStorage.getItem("token") },
                    }
                );
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError("Failed to load requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);


    if (loading) return <p>Loading requests...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>My Requests</h1>
            {requests.length === 0 ? (
                <p>No requests found.</p>
            ) : (
                <div className="requests-list">
                    {requests.map((req) => (
                        <Request key={req._id} request={req} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequests;

