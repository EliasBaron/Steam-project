import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import '../styles/game.css';


export default function GameMultimedia(props) {
  const [imgs, setImgs] = useState([]);
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (props.images && props.images.length > 0) {
      setImgs(props.images);
      setMainImg(props.images[0].src);
    }
  }, [props.images]);

  return (
    <div className='multimedia-container'>
      <img src={mainImg} alt="Game Multimedia" key={mainImg.src} className='large-image'/>
      <div className='select-media'>
        {imgs.map((i) => (
            <img src={i.src} alt="Game Multimedia" key={i.src} onClick={() => { setMainImg(i.src) }} draggable="false" />
        ))}
      </div>
    </div>
  )
    
}