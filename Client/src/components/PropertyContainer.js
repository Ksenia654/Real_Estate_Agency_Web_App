import React, { useContext } from 'react';
import PropertyList from './PropertyList';
import PropertyForm from './PropertyForm';
import { AuthContext } from '../context/AuthContext';
import '../styles/PropertyList.css';

const PropertyContainer = ({ properties, fetchProperties }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="property-container">
            <h1 className="property-title">Properties</h1>
            {user && <PropertyForm fetchProperties={fetchProperties} />}
            <PropertyList properties={properties} fetchProperties={fetchProperties} />
        </div>
    );
};

export default PropertyContainer;
