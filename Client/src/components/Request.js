import React from "react";
import { Link } from "react-router-dom";

const Request = ({ request }) => {
    return (
        <div className="request-item">
            <h3>
                <Link to={`/properties/${request.property?._id}`}>
                    {request.property?.title || "Property deleted"}
                </Link>
            </h3>
            <p>Status: {request.status}</p>
            <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
        </div>
    );
};

export default Request;

