import React, { useEffect, useState } from 'react';
import PropertyContainer from '../components/PropertyContainer';
import axios from 'axios';
import '../styles/PropertyList.css';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');

    const fetchProperties = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/properties', {
                params: { search, sort },
            });
            setProperties(response.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [search, sort]);

    return (
        <div className="properties-container">
            <h1>Property Listings</h1>
            <div className="search-sort">
                <input
                    type="text"
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <select
                    onChange={(e) => setSort(e.target.value)}
                    className="sort-select"
                >
                    <option value="">Sort by price</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>

            {/* передаём fetchProperties вниз */}
            <PropertyContainer properties={properties} fetchProperties={fetchProperties} />
        </div>
    );
};

export default Properties;
