import React, { useState } from 'react';
import ThumbsUp from '../assets/icon_thumbsUp_v6.png'
import ThumbsDown from '../assets/icon_thumbsDown_v6.png'
import axios from 'axios';

export default function WriteReviewBox(props) {
  const [reviewPositively, setReviewPositively] = useState(null);

  const textarea = document.getElementById('dynamic-textarea');
  const token = localStorage.getItem('token');
  const sendReview = () => {
    if (!textarea) {
      return
    }
    const reviewText = textarea.value;
    if (reviewText && (reviewPositively != null)) {
      axios.put('http://localhost:7070/games/' + props.game_id + '/reviews', 
          {
            isRecommended: reviewPositively,
            text: reviewText
          },
          {
            headers: {
              Authorization: token
            }
          },
        )
        .then(response => {
          console.log('Review added:', response.data);
          props.on_review();
          textarea.value = '';
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      // Handle the case when the textarea is empty
      console.error('Please enter a review before submitting.');
    }
  }

  function review_up() {
    const like_button = document.getElementById('like_button');
      const dislike_button = document.getElementById('dislike_button');
      setReviewPositively(true);
      like_button.classList.add('selected');
      dislike_button.classList.remove('selected');
    }
    
  function review_down() {
    const like_button = document.getElementById('like_button');
    const dislike_button = document.getElementById('dislike_button');
    setReviewPositively(false);
    dislike_button.classList.add('selected');
    like_button.classList.remove('selected');
  }

  return(
    <div className='add-review-block'>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop: '1em', marginLeft: '2em'}}>
        <img className='user-img' src={props.user.image} alt="user_image" />
        <p>{props.user.name}</p>
      </div>
      <div style={{width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', marginTop:'0.5em', marginBottom:'0.5em', gap: '1em'}}> {/*recommended*/}
          <p style={{marginTop:'0.5em', marginBottom:'0.5em'}}>Recomended</p>
          <img src={ThumbsUp} id='like_button' alt="Thumbs Up" className='like_dislike' onClick={review_up}/>
          <img src={ThumbsDown} id='dislike_button' alt="Thumbs Down" className='like_dislike' onClick={review_down}/>
        </div>
        <p style={{width: '100%', marginTop:'0.5em', marginBottom:'0.5em'}}>Text</p> {/*Text */}
        <textarea className='text-box' name='review-text-box' id='dynamic-textarea' ></textarea>
        <button className='blue-button' style={{padding:0, marginTop: '1em', marginBottom:'1em', marginLeft:0, marginRight:0, width:'8em'}} onClick={sendReview}>Add review</button>
      </div>
    </div>
  )
}