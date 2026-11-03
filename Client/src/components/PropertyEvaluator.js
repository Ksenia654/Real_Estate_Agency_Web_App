import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function PropertyEvaluator({ defaultValue = 0, onPropertyEvaluate }) {
    const { user } = useContext(AuthContext);
    const [value, setValue] = useState(defaultValue);
    const [estimated, setEstimated] = useState(null);

    const handleEvaluate = () => {
        const randomCoef = Math.random() * (1.3 - 0.8) + 0.8;

        const result = Math.round(value * randomCoef);

        setEstimated(result);

        if (onPropertyEvaluate) {
            onPropertyEvaluate(result);
        }
    };

    return (
        <div style={{ marginTop: "15px" }}>
            <h3>Оценка стоимости недвижимости</h3>
            <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                placeholder="Введите базовую стоимость"
            />
            <button type="button" onClick={handleEvaluate}>
                Оценить
            </button>

            {estimated && (
                <p>
                    {user?.username
                        ? `${user.role} ${user.username} получил оценку: ${estimated} $`
                        : `Оценка: ${estimated} $`}
                </p>
            )}
        </div>
    );
}

export default PropertyEvaluator;
