import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PropertyUpdateForm from './PropertyUpdateForm';
import axios from 'axios';
import '../styles/PropertyDetail.css';

import PropertyTour from './PropertyTour';

const PropertyDetail = ({ property, fetchProperties }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                await axios.delete(`http://localhost:5000/api/properties/${property._id}`, {
                    headers: { "x-auth-token": localStorage.getItem("token") },
                });
                if (typeof fetchProperties === 'function') {
                    fetchProperties();
                }
                navigate("/properties");
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('Failed to delete property. Please try again.');
            }
        }
    };

    const handleTakeRequest = async () => {
        try {
            await axios.post("http://localhost:5000/api/requests", {
                propertyId: property._id,
                userId: user._id
            }, {
                headers: { "x-auth-token": localStorage.getItem("token") },
            });
            alert("Request taken successfully!");
            navigate("/my-requests");
        } catch (error) {
            console.error("Error taking request:", error);
            alert("Failed to take request.");
        }
    };


    if (!property) return <div>Loading...</div>;

    const price = property?.price?.$numberDecimal ?? property?.price ?? 'N/A';

    const formatDate = (dateString) => {
        if (!dateString) return { local: "N/A", utc: "N/A" };
        const date = new Date(dateString);

        const local = date.toLocaleString(undefined, { timeZoneName: "short" });
        const utc = date.toLocaleString("en-GB", { timeZone: "UTC", timeZoneName: "short" });

        return { local, utc };
    };

    const { local, utc } = formatDate(property.updatedAt || property.createdAt);

    return (
        <div className="property-detail">
            <h3 className="property-title">{property.title}</h3>
            <p className="property-description">{property.description}</p>
            <p className="property-price">Price: ${price}</p>
            {property.imageUrl && <img className="property-image" src={property.imageUrl} alt={property.title} />}

            <p className="property-date">Last update (local): {local}</p>
            <p className="property-date">Last update (UTC): {utc}</p>

            {/* блок для админа */}
            {user?.role === "admin" && (
                <div className="edit-delete">
                    <PropertyUpdateForm property={property} fetchProperties={fetchProperties} />
                    <button onClick={handleDelete} className="delete-button">
                        Delete Property
                    </button>
                </div>
            )}

            {user?.role === "user" && (
                <button onClick={handleTakeRequest} className="take-request-button">
                    Take request
                </button>
            )}

            <PropertyTour property={property} />
        </div>
    );
};

export default PropertyDetail;
