import React from 'react';

import '../styles/styles.css';
import '../styles/game.css';
import { Link } from 'react-router-dom';

import '../styles/login.css'



export default function TagList({game}) {


    return (
        <>
            <div id='popup-container' className='hidden'>
              <div className='popup-content'>
                <div className='popup-title-box'>
                  <p style={{flex:1}}>All tags</p>
                  <a href="#" style={{textDecoration: 'none'}} onClick={toggleShowAllTags}>x</a>
                </div>
                {
                  game.tags.map((tag) => (
                    <React.Fragment key={tag.id}>&nbsp; <Link to='/tags' key={tag.id}>{tag.name}</Link></React.Fragment>
                  ))
                }
              </div>
              <div className= 'popup-background' onClick={toggleShowAllTags}></div>
            </div>
        </>
  
      )
}
function toggleShowAllTags(event) {
  event.preventDefault();
  const popupContainer = document.getElementById('popup-container');
  popupContainer.classList.toggle("hidden")
  popupContainer.classList.toggle("visible");
}