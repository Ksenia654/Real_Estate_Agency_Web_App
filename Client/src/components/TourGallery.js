import { useState } from "react";
import "../styles/TourPage.css";

export default function TourGallery({ images = [] }) {
    const [active, setActive] = useState(0);

    const prevSlide = () => {
        setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    if (!images || images.length === 0) return null;

    return (
        <section className="gallery-grid" aria-label="Галерея фотографий">
            <figure className="gallery-main">
                <img
                    src={images[active]}
                    alt={`Фото ${active + 1}`}
                    className="gallery-image"
                />
                <figcaption className="gallery-caption">
                    Фото {active + 1} из {images.length}
                </figcaption>

                {/* 👉 стрелки */}
                <button className="gallery-arrow left" onClick={prevSlide}>
                    &#10094;
                </button>
                <button className="gallery-arrow right" onClick={nextSlide}>
                    &#10095;
                </button>
            </figure>

            <ul className="thumbs-list">
                {images.map((src, i) => (
                    <li key={src}>
                        <button
                            className={`thumb ${i === active ? "is-active" : ""}`}
                            onClick={() => setActive(i)}
                        >
                            <img src={src} alt={`Миниатюра ${i + 1}`} />
                        </button>
                    </li>
                ))}
            </ul>

        </section>
    );
}

