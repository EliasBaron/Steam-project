import React, { useState, useEffect } from 'react';

import '../styles/styles.css';
import '../styles/game.css';
import { Link } from 'react-router-dom';

import ThumbsUp from '../assets/icon_thumbsUp_v6.png'
import ThumbsDown from '../assets/icon_thumbsDown_v6.png'

export default function Review(props) {
    const [userName, setUserName] = useState('');
    const [userImg, setUserImg] = useState('');
    const [isRecommended, setIsRecommended] = useState(false);
    const [text, setText] = useState('');
    const [customClass, setCustomClass] = useState(null);
    const [userId, setUserId] = useState('');
    
    useEffect(() => {
      if (props.userName && props.userImg && (props.isRecommended !== null) && props.text) {
        setUserName(props.userName);
        setIsRecommended(props.isRecommended);
        setUserImg(props.userImg);
        setText(props.text);
        setUserId(props.userId)
      }
      if (props.customClass) {
        setCustomClass(props.customClass);
      }
    }, [props.reviews]);
  
    return (
            <div className={customClass ? customClass : 'review'}>
              <div className='review-top-row'>
                <img className='user-img' src={userImg} alt="user_image" />
                <div style={{flex:1}}><Link to={'/user/' + userId} >{userName}</Link></div>
                {/* <ink to={'/user/' + userId} >{userName}</Link> */}
                
                { isRecommended ?
                    <>
                      <img src={ThumbsUp} alt="Thumbs Up" />
                    </>
                  :
                    <>
                      <img src={ThumbsDown} alt="Thumbs Down" />
                    </>
                }
              </div>
              <div style={{marginLeft:'1em', marginRight:'1em'}}>
                <p>{text}</p>
              </div>
            </div>
    )
      
  }