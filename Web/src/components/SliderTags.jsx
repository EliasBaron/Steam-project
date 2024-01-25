import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import black from '../assets/black.jpg';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

export default function SliderTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    axios
      .get('http://localhost:7070/tags')
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

  if (error) {
    return <div>Something went wrong...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="swiper-container">
      <h1 className="feature-title">BROWSE BY CATEGORY</h1>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        loop={false}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper"
      >
        {tags.slice(0, 8).map((tag) => (
          <SwiperSlide key={tag.id} onClick={() => { navigate('/tags');}}>
            <img src={tag.image.src} alt="slide_image" className="tag-slide-image" />
            <div className="tag-texto">{tag.name.toUpperCase()}</div>
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <Link to="/tags">
            <img src={black} alt="slide_image" className="tag-slide-image" />
            <div className="tag-texto">VIEW ALL TAGS</div>
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
