import React, { useState, useEffect } from 'react';

import '../styles/styles.css';
import '../styles/game.css';
import Review from './Review.jsx'

export default function Reviews(props) {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    if (props.reviews && props.reviews.length > 0) {
      setReviews(props.reviews);
    }
  }, [props.reviews]);

  return (
    <div style={{marginTop:'2em', width:'100%'}}>
      <h2 className='left-text' >REVIEWS</h2>
      <div className='review-block'>
        {reviews.map(r => (
          <React.Fragment key={r.id}>
            <Review userName= {r.user.name} isRecommended = {r.isRecommended} userImg= {r.user.image} text= {r.text} userId = {r.user.id }/>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
    
}