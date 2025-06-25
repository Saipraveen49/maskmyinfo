import React, { useState, useEffect } from 'react';
import './ScrollToTop.css'; // Import the CSS for the button

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 20px from the top
  const toggleVisibility = () => {
    if (window.scrollY > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the window to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'show' : ''}`}
      title="Go to top"
    >
      <i className="fas fa-chevron-up"></i> {/* Font Awesome icon */}
    </button>
  );
};

export default ScrollToTop;
