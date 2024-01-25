import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';

export default function Slider() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setLoading(true);

    axios
      .get('http://localhost:7070/games/recommended')
      .then((res) => {
        setGames(res.data);
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (error) { return <div>Something went wrong...</div>; }

  if (loading) { return <div>Loading...</div>; }

  return (
    <div className="swiper-container">
      <h1 className='feature-title'>FEATURED & RECOMMENDED</h1>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {games.map((game) => (
          <SwiperSlide key={game.id} >
            <img src={game.mainImage.src} alt="slide_image" className='swiper-img' onClick={() => { navigate('/games/' + game.id);}}/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}