import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';
import { LuMaximize, LuShoppingBag } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';

const HeroCarousel = ({ onImageChange }) => {
  const [looks, setLooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/api/products/trending/viewed?limit=5`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLooks(data);
        } else {
          return fetch(`${apiUrl}/api/products`)
            .then(res => res.json())
            .then(all => setLooks(Array.isArray(all) ? all.slice(0, 5) : []));
        }
      })
      .catch(() => setLooks([]))
      .finally(() => setLoading(false));
  }, []);

  const currentImage = looks[currentImageIndex];

  const handlePreviousClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? looks.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % looks.length
    );
  };

  const handleMaximize = () => {
    window.open(currentImage.mainImage, '_blank');
  };

  const handleProductClick = () => {
    navigate(`/look/${currentImage._id}`);
  };

  useEffect(() => {
    if (looks.length === 0 || !currentImage) return;

    onImageChange(currentImage);

    const timer = setTimeout(() => {
      handleNextClick();
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentImageIndex, looks]);

  if (loading) {
    if (loading) {
      return (
        <div className="image-container">
          <Skeleton
            variant="rounded"
            animation="wave"
            width="100%"
            height="100%"
            sx={{ borderRadius: 2 }}
          />
        </div>
      );
    }
  }

  if (looks.length === 0) {
    return null; // nothing to show — no products yet
  }

  return (
    <div className="image-container">

      <button
        className="nav-button left"
        onClick={handlePreviousClick}
      >
        &lt;
      </button>

      {looks.map((look, index) => (
        <React.Fragment key={look._id}>

          {/* Blurred backdrop — same image, scaled + blurred, fills empty space */}
          <div
            className={`image-backdrop ${currentImageIndex === index ? 'block' : 'hidden'}`}
            style={{ backgroundImage: `url(${look.mainImage})` }}
          />

          <img
            src={`${look.mainImage.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')}`}
            alt={look.name}
            className={currentImageIndex === index ? 'block' : 'hidden'}
          />
          {currentImageIndex === index && (
            <div className="image-actions">
              <button className="image-action-btn" onClick={handleMaximize} title="View larger">
                <LuMaximize size={20} />
              </button>
              <button className="image-action-btn" onClick={handleProductClick} title="View product">
                <LuShoppingBag size={20} />
              </button>
            </div>
          )}

        </React.Fragment>
      ))}
      <button
        className="nav-button right"
        onClick={handleNextClick}
      >
        &gt;
      </button>

    </div>
  );
};

export default HeroCarousel;