import { useState, useEffect } from "react";

export default function FloorPlan({ svgFile, zones }) {
    const [hoverZone, setHoverZone] = useState(null);
    const [svgContent, setSvgContent] = useState("");

    useEffect(() => {
        fetch(svgFile)
            .then(res => res.text())
            .then(setSvgContent);
    }, [svgFile]);

    useEffect(() => {
        const root = document.querySelector(".floorplan-svg");
        if (!root) return;
        root.querySelectorAll(".plan-zone").forEach(el => {
            const id = el.id; // теперь берём id
            el.classList.toggle("is-hover", id === hoverZone);
        });
    }, [hoverZone]);


    return (
        <section className="floorplan-panel" aria-label="Интерактивный план">
            <div
                className="floorplan-svg"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            <ul className="zones-legend">
                {zones.map(z => (
                    <li key={z.id}>
                        <button
                            className={`zone-item ${hoverZone === z.id ? "is-hover" : ""}`}
                            onMouseEnter={() => setHoverZone(z.id)}
                            onMouseLeave={() => setHoverZone(null)}
                            onFocus={() => setHoverZone(z.id)}
                            onBlur={() => setHoverZone(null)}
                            onClick={() => alert(`Открыть детали зоны: ${z.label}`)}
                        >
                            {z.label}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}

