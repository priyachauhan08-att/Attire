import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';

// images from pexels.com
const images = [
    { id: 1, url: "https://images.pexels.com/photos/29089597/pexels-photo-29089597/free-photo-of-stunning-autumn-beach-sunset-with-waves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"},
    { id: 2, url: "https://images.pexels.com/photos/691668/pexels-photo-691668.jpeg"},
    { id: 3, url: "https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"},
    { id: 4, url: "https://images.pexels.com/photos/325044/pexels-photo-325044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"},
    { id: 5, url: "https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"},
]

const HeroCarousel = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePreviousClick = () => {
        setCurrentImageIndex(
            currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleNextClick();
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentImageIndex]);

    return (
            <div className="image-container">
                <button className="nav-button left" onClick={handlePreviousClick}>&lt;</button>

                {images.map((image, index) => (
                    <img 
                        src={image.url} 
                        alt="images" 
                        className={ currentImageIndex === index ? 'block' : 'hidden'}
                        key={image.id} 
                    />
                ))}

                <button className="nav-button right" onClick={handleNextClick}>&gt;</button>

            </div>
    )
}

export default HeroCarousel