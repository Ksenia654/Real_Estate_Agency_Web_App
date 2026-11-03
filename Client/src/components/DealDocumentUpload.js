import React, { useState } from "react";

function DealDocumentUpload({ dealId, onUploaded }) {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const upload = () => {
        if (!file || !dealId) return;

        setError(null);
        setProgress(0);

        const formData = new FormData();
        formData.append("document", file);
        formData.append("dealId", dealId);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5000/api/deal-documents", true);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const res = JSON.parse(xhr.responseText);
                    onUploaded?.(res.document);
                    setFile(null);
                    setProgress(100);
                } catch {
                    setError("Некорректный ответ сервера");
                }
            } else {
                setError(`Ошибка: ${xhr.status}`);
            }
        };

        xhr.onerror = () => setError("Ошибка сети при загрузке");
        xhr.send(formData);
    };

    return (
        <div style={{ marginTop: 12 }}>
            <input type="file" accept=".doc,.docx,.pdf" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={upload} disabled={!file} style={{ marginLeft: 8 }}>
                Загрузить
            </button>
            {progress > 0 && <span style={{ marginLeft: 8 }}>Прогресс: {progress}%</span>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default DealDocumentUpload;
