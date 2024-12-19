import React, { useState, useEffect } from 'react';
import '../css/Home.css'; // File CSS để định kiểu

const Home = () => {
  const images = [
    'https://oisp.hcmut.edu.vn/en/wp-content/uploads/2018/12/BachKhoaUniversity.jpg',
    'https://hcmut.edu.vn/img/carouselItem/36986508.jpeg?t=36986508',
    'https://hcmut.edu.vn/img/carouselItem/07531069.jpg?t=07531113',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh sau mỗi 5 giây
//   useEffect(() => {
//     const interval = setInterval(() => {
//       handleNext();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex]);

useEffect(() => {
  const interval = setInterval(handleNext, 3000);
  return () => clearInterval(interval);
}, []); // Chỉ chạy một lần khi component được mount

const handlePrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    console.log('New Index (Prev):', newIndex);
    setCurrentIndex(newIndex);
  };
  
  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    console.log('New Index (Next):', newIndex);
    setCurrentIndex(newIndex);
    console.log('Current Image Index:', currentIndex);
    console.log('Current Image URL:', images[currentIndex]);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div
        className={`carousel-slide `}
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            <div className="carousel-text">Chào mừng đến với dịch vụ in ấn SPSS</div>
        </div>
    

      </div>
      <button className="carousel-control prev" onClick={handlePrev}>
        {'<'}
      </button>
      <button className="carousel-control next" onClick={handleNext}>
        {'>'}
      </button>
    </div>
  );
};

export default Home;
