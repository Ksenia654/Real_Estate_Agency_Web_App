import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PropertyList.css';


const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    const local = date.toLocaleString(undefined, { timeZoneName: "short" });
    const utc = date.toLocaleString("en-GB", { timeZone: "UTC", timeZoneName: "short" });

    return { local, utc };
};

const PropertyList = ({ properties }) => {
    return (
        <ul className="property-list">
            {properties.map(property => {
                const price = typeof property.price === 'object' && property.price !== null
                    ? property.price.$numberDecimal
                    : property.price;


                const { local, utc } = formatDate(property.updatedAt || property.createdAt);

                return (
                    <li key={property._id} className="property-item">
                        <Link to={`/properties/${property._id}`} className="property-link">
                            <h3 className="property-title">{property.title}</h3>
                            <p className="property-price">Price: ${price}</p>
                            {property.imageUrl && (
                                <img className="property-image" src={property.imageUrl} alt={property.title} />
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default PropertyList;
