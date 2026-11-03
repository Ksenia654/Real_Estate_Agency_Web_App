import { useState } from "react";
import axios from "axios";

function ObjectAnalyzer({ onDescriptionGenerated }) {
    const [prompt, setPrompt] = useState("");
    const [description, setDescription] = useState("");

    const analyzeObject = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/describe-object", {
                objectPrompt: prompt,
            });
            const result = res.data.description;
            setDescription(result);
            if (onDescriptionGenerated) {
                onDescriptionGenerated(result);
            }
        } catch (err) {
            console.error("Ошибка:", err.message);
            setDescription("Не удалось получить описание");
        }
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Напишите, что нужно описать"
            />
            <button type="button" onClick={analyzeObject}>
                Сгенерировать описание объекта
            </button>
        </div>
    );
}

export default ObjectAnalyzer;

