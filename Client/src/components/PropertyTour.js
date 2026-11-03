import React, { useEffect, useState, useContext } from "react";
import api from "../context/Api";
import VirtualTour from "../components/VirtualTour";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PropertyTour = ({ property }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [hasAccess, setHasAccess] = useState(false);
    const [clients, setClients] = useState([]); // список всех пользователей
    const [selectedClient, setSelectedClient] = useState(null);
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        const checkAccess = async () => {
            if (!user?._id || !property?._id) return;
            try {
                const res = await api.get("http://localhost:5000/api/tours/access", {
                    params: { userId: user._id, propertyId: property._id }
                });
                setHasAccess(res.data.hasAccess);
            } catch (err) {
                console.error("Ошибка проверки доступа:", err);
            }
        };
        checkAccess();
    }, [user?._id, property?._id]);

    useEffect(() => {
        const fetchClients = async () => {
            if (!isAdmin) return;
            try {
                const res = await api.get("http://localhost:5000/api/users", {
                    headers: { "x-auth-token": localStorage.getItem("token") }
                });
                setClients(res.data);
            } catch (err) {
                console.error("Ошибка загрузки пользователей:", err);
            }
        };
        fetchClients();
    }, [isAdmin]);

    const handleTourStart = (prop) => {
        navigate(`/tour/${prop._id}`);
        alert(`🚀 Тур по объекту "${prop.title}" начат!`);
    };

    const handleClientMatch = (prop) => {
        if (!selectedClient) {
            alert("Выберите клиента для сопоставления");
            return;
        }
        setHasAccess(true);
        alert(`🤝 Клиент ${selectedClient.username} сопоставлен с объектом "${prop.title}" `);
    };

    const handleViewingSchedule = async (prop, selectedUser) => {
        try {
            await api.post("http://localhost:5000/api/tours", {
                userId: selectedUser._id,
                propertyId: prop._id,
                access: true
            });
            setHasAccess(true);
            alert(`✅ Доступ клиента ${selectedUser.username} к туру "${prop.title}" успешно сохранён в базе`);
        } catch (err) {
            console.error("Ошибка записи в Tours:", err);
            alert("Не удалось сохранить доступ к туру");
        }
    };


    return (
        <div style={{ marginTop: "20px" }}>


            {hasAccess && !isAdmin && (
                <VirtualTour
                    property={property}
                    onTourStart={handleTourStart}
                />
            )}


            {isAdmin && (
                <>
                    <label>Выберите клиента:</label>
                    <select
                        onChange={(e) => setSelectedClient(clients.find(c => c._id === e.target.value))}
                        defaultValue=""
                    >
                        <option value="" disabled>-- выбрать --</option>
                        {clients.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.username}
                            </option>
                        ))}
                    </select>

                    <VirtualTour
                        property={property}
                        onClientMatch={handleClientMatch}
                        onViewingSchedule={(prop) => handleViewingSchedule(prop, selectedClient)}
                    />
                </>
            )}
        </div>
    );
};

export default PropertyTour;

