import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../context/Api";
import TourGallery from "../components/TourGallery";
import FloorPlan from "../components/FloorPlan";
import "../styles/TourPage.css";

export default function TourPage() {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const load = async () => {
            const res = await api.get(`http://localhost:5000/api/properties/${propertyId}`);
            setProperty(res.data);
        };
        load();
    }, [propertyId]);

    if (!property) return <div className="tour-loading">Загрузка тура...</div>;

    const images = property.images || [property.imageUrl].filter(Boolean);

    // 👉 путь к файлу SVG
    const svgFile = property.floorPlanSvg || "/svg/plan3.svg";

    // 👉 список зон для легенды
    const zones = [
        { id: "kitchen", label: "Коридор" },
        { id: "bedroom", label: "Лестница" },
        { id: "living", label: "Гостиная" },
        { id: "hall", label: "Туалет №1" },
        { id: "kitchen2", label: "Кухня" },
        { id: "restroom", label: "Туалет №2" },
        { id: "bedroom1", label: "Спальня №1" },
        { id: "childroom", label: "Детская" },
        { id: "restroom3", label: "Туалет №3" },
        { id: "bedroom2", label: "Спальня №2" },
    ];


    return (
        <div className={`tour-page theme-${theme}`}>
            <header className="tour-header">
                <h1 className="tour-title">{property.title}</h1>
                <div className="controls">
                    <button
                        className="theme-toggle"
                        onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
                    >
                        Сменить тему
                    </button>
                </div>
            </header>

            <main className="tour-layout">
                <TourGallery images={images} />
                <FloorPlan svgFile={svgFile} zones={zones} />
                <aside className="sidebar">
                    <div className="info-card">
                        <h2 className="info-title">Характеристики</h2>
                        <ul className="info-list">
                            <li><strong>Площадь: 100</strong> {property.area} м²</li>
                            <li><strong>Комнат: 7</strong> {property.rooms}</li>
                            <li><strong>Этажей: 2</strong> {property.floor}</li>
                        </ul>
                    </div>
                </aside>
            </main>

            <footer className="tour-footer">
                <small>Виртуальный тур — бета</small>
            </footer>
        </div>
    );
}
