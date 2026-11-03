import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropertyDetail from '../components/PropertyDetail';

const PropertyDetailPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
            setProperty(response.data);
        };
        fetchProperty();
    }, [id]);

    if (!property) return <div>Loading...</div>;

    return (
        <div>
            <PropertyDetail property={property} />
        </div>
    );
};

export default PropertyDetailPage;