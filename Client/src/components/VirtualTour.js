import React from "react";

const VirtualTour = ({ property, onTourStart, onClientMatch, onViewingSchedule }) => {
    return (
        <div className="virtual-tour">
            <h3>Виртуальный тур</h3>
            <p><strong>Объект:</strong> {property?.title || "Без названия"}</p>

            <div style={{ marginTop: 12 }}>
                {onTourStart && (
                    <button onClick={() => onTourStart(property)} className="tour-button">
                        Начать тур
                    </button>
                )}

                {onClientMatch && (
                    <button onClick={() => onClientMatch(property)} className="match-button" style={{ marginLeft: 8 }}>
                        Сопоставить клиента и тур
                    </button>
                )}

                {onViewingSchedule && (
                    <button onClick={() => onViewingSchedule(property)} className="schedule-button" style={{ marginLeft: 8 }}>
                        Зафиксировать доступ в БД
                    </button>
                )}
            </div>
        </div>
    );
};

export default VirtualTour;
