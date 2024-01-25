import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import { useParams } from 'react-router-dom';
import botonLike from '../assets/icon_thumbsUp_v6.png';
import botonDisLike from '../assets/icon_thumbsDown_v6.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function GamesPages({isLoggedIn}) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [friendButtonText, setFriendButtonText] = useState('');
  const { id } = useParams();
  const gamesWrapperRef = useRef(null);

  useEffect(() => {
    setLoading(true);
  
    axios
      .get('http://localhost:7070/users/'+ id)
      .then((res) => {
        setReviews(res.data.reviews);
        setUser(res.data);
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  },[id, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user) {
      setLoading(true);
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:7070/users/current', {
          headers: {
            Authorization: token
          }
        })
        .then((res) => {
          setCurrentUser(res.data);
          if (res.data.friends.some(f => f.id == user.id)) {
            setFriendButtonText('Delete friend');
          } else {
            setFriendButtonText('Add friend');
          }
        })
        .catch((err) => {
          console.error('api error', err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isLoggedIn, user]);

  useLayoutEffect(() => {
    if (gamesWrapperRef.current) {
      gamesWrapperRef.current.scrollTop = gamesWrapperRef.current.scrollHeight;
    }
  }, [reviews]);

  function renderReviews() {
    return (
      <div className="games-wrapper" ref={gamesWrapperRef}>
        {reviews.map(review => (
          <div className="game-card" key={review.id}>
            <img src={review.game.mainImage.src} alt="game_image" />
            <div className="game-card-info">
              <div className='user-review-container'>
                <div className="title-icon-container">
                  <h3 className="game-card-title">{review.game.name}</h3>
                  <img src= {review.isRecommended? botonLike: botonDisLike} alt="boton like" />
                </div>
                <div className="game-card-reviews">
                    <p>{review.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  function handleFriendButton() {
    const token = localStorage.getItem('token');
    axios
      .put(`http://localhost:7070/users/${id}/friends`, {}, {
        headers: {
          Authorization: token
        }
      })
      .then((res) => {
        setCurrentUser(res.data);
        if (friendButtonText === 'Add friend') {
          setFriendButtonText('Delete friend');
        } else {
          setFriendButtonText('Add friend');
        }
      })
      .catch((err) => {
        console.error('api error', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  
  if (error) {
    toast.error('Something went wrong...'); // Mostrar mensaje de error con toast
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="games-container">
      { user &&
        <div className='user-info'>
          <div className='user-avatar'>
            <img src={user.image} alt='user avatar' />
          </div>
          <div className='user-name'>
            <h3>{user.name}</h3>
          </div>
          <div className='user-button'>
          {isLoggedIn && currentUser && user.id !== currentUser.id && (
          <button 
            onClick={handleFriendButton}
            className={friendButtonText === 'Add friend' ? 'add-friend-button' : 'delete-friend-button'}>
              {friendButtonText}
          </button>
        )}
          </div>
        </div>
      }
      <h1 className="feature-title">REVIEWS</h1>
      {renderReviews()}
      <ToastContainer /> {/* Container para mostrar los toasts */}
    </div>
  );
}