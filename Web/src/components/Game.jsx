import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';
import '../styles/game.css';
import { Link } from 'react-router-dom';
import GameMultimedia from './GameMultimedia';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation } from 'swiper/modules';
import Reviews from './Reviews'
import '../styles/login.css'
import Review from './Review'

import WriteReviewBox from './WriteReviewBox';
import TagList from './TagList';

export default function Game(props) {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasGame, setHasGame] = useState(false);
  

  useEffect(() => {
    setLoading(true);
    
    axios
      .get('http://localhost:7070/games/' + id)
      .then((res) => {
        setGame(res.data);
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, hasReviewed]);



  const token = localStorage.getItem('token');

  useEffect(() => {
    if (props.isLoggedIn){
      setLoading(true);
      
      axios
        .get('http://localhost:7070/users/current', {
          headers: {
            Authorization: token
          }
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error('api error', err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  function handleClick(game_id) {
    navigate('/games/' + game_id);
  }

  useEffect(() => {
    setHasGame(props.isLoggedIn && game && user && user.games.some(g => g.id == game.id));
    console.log(hasGame);
    setHasReviewed(hasGame && game.reviews.some(r => r.user.id == user.id));
  }, [props.isLoggedIn, game, user, hasGame, hasReviewed]);

  
  if (error) { return <div>Something went wrong...</div>; }

  if (loading) { return <div>Loading...</div>; }


  const textarea = document.getElementById('dynamic-textarea');
  

  const buyGame = () => {
    const isPurchased = user && user.games.some( g => g.id == game.id );
    if (props.isLoggedIn && !isPurchased) {
      navigate('/games/' + id + '/purchase');
    } else if (!props.isLoggedIn) {
      navigate('/register');
    }
  }

  window.addEventListener('resize', adjustReviewTextWithWidth);
  adjustReviewTextWithWidth();



  return (
    <>
      <div className='main-container' style={{ gap: '0em' }}>
        {game && 
          <>
            <TagList game={game}/>
            <div className='subtitled-img-container'>
              <img src={game.mainImage.src} alt="Game Image" />
              <p className='subtitled-text'>{game.name}</p>
            </div>
            <div className='left-text'>
              <p>Developer: &nbsp; {<a href={game.website} target="_blank">{game.developer.name}</a>}</p>
              <p>Website: &nbsp; <a href={game.website} target="_blank">{game.website}</a></p>
              <p>Release date: &nbsp; {game.releaseDate}</p>
              <p>Tags: {
                game.tags.slice(0,4).map((tag) => (
                  <React.Fragment key={tag.id + game.id + 'game_tags'}> &nbsp; <Link to="/tags" key={tag.id + 'game_tags'}>{tag.name}</Link></React.Fragment>
                ))}
                <>
                  &nbsp; &nbsp;
                  <a href="#" onClick={toggleShowAllTags}>more...</a>
                </>
              </p>
            </div>
            <GameMultimedia images = {game.multimedia}/>
            <div className='left-text'>
              <h2>About this game</h2>
              <p>{game.description}</p>
            </div>
            <div style={{alignItems: 'left', width: '100%'}}>
              <h2>Requirements</h2>
              <p>OS: {game.requirement.os.map(o => <React.Fragment key={o}>&nbsp; {o}</React.Fragment>)}</p>
              <p>Processor: {game.requirement.processor.map(p => <React.Fragment key={p}>&nbsp; {p}</React.Fragment>)}</p>
              <p>Memory: &nbsp;{game.requirement.memory}gb</p>
              <p>Graphics: {game.requirement.graphics.map(g => <React.Fragment key={g}>&nbsp; {g}</React.Fragment>)}</p>
            </div>
            {
              (!props.isLoggedIn || (user && !user.games.some( g => g.id == game.id ))) ? (
                <>
                  <div className='buy-game'>
                    <div className='buy-game-content'>
                      <p style={{flex:1}}>Buy &nbsp; {game.name}</p>
                      <p style={{textAlign: 'right'}}>{game.price.currency}{game.price.amount.toFixed(2)}</p>
                      <button className='blue-button' style={{width: '5em', textAlign: 'center'}} onClick={buyGame}>Buy</button>
                    </div>
                  </div>
                </>
              ) : <> </>
            }

            <div className="swiper-container" style={{height: 'auto', display: 'flex', flexDirection: 'column'}}>
              <h2 className='feature-title'>RELATED GAMES</h2>
              <Swiper
                slidesPerView={4}
                spaceBetween={10}
                loop={false}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
              >
                {game.relatedGames.map((g) => (
                  <SwiperSlide key={g.id} onClick={() => handleClick(g.id)} style={{height:'20em'}}>
                    <img src={g.mainImage.src} alt="slide_image" className='related-slide-image'/>
                    <div className="tag-texto">{g.name.toUpperCase()}</div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {
              hasGame ?
                (hasReviewed? 
                  (<>
                    { getOwnReview() }
                    <Reviews reviews= {game.reviews.filter(review => review.user.id !== user.id)}/>
                  </>)
                  :
                  (<>
                    <WriteReviewBox user={user} game_id={id} on_review={() => setHasReviewed(true)}/>
                    <Reviews reviews= {game.reviews}/>
                  </>)
                )
              :
                <Reviews reviews= {game.reviews}/>
            }
          </>
        }
      </div>
    </>
  )
  function getOwnReview() {
    const r = game.reviews.find(review => review.user.id === user.id);
    if (!r) return;
    return (
      <Review userName= {r.user.name} isRecommended = {r.isRecommended} userImg= {r.user.image} text= {r.text} userId = {r.user.id } customClass='own-review' ></Review>
    )
  }
  

  function adjustReviewTextWithWidth() {
    if (!textarea) { return }
    const containerWidth = textarea.clientWidth;
    const charWidth = 5;
    const cols = Math.floor(containerWidth / charWidth);
    textarea.setAttribute('cols', cols);
  }

  function toggleShowAllTags(event) {
    event.preventDefault();
    const popupContainer = document.getElementById('popup-container');
    popupContainer.classList.toggle("hidden")
    popupContainer.classList.toggle("visible");
  }

  
    
}