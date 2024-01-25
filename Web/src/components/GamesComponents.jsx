import React, { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GamesWrapper({ gamesWrapperRef, games }) {
  useLayoutEffect(() => {
    if (gamesWrapperRef.current) {
      gamesWrapperRef.current.scrollTop = gamesWrapperRef.current.scrollHeight;
    }
  }, [games]);

  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate('/games/' + id)
    console.log("asdasd")
  }

  return (
    <div className="games-wrapper" ref={gamesWrapperRef}>
      {games.map((game) => (
        <div className="game-card" key={game.id} onClick={() => { navigate('/games/' + game.id) }}>
          <img src={game.mainImage.src} alt="game_image" className="" />
          <div className="game-card-info">
            <div className='game-text-container'>
              <h3 className="game-card-title">{game.name.toUpperCase()}</h3>
              <div className="game-card-tags">
                {game.tags.slice(0,8).map((tag, index) => (
                  <span key={index} className="game-card-tag">
                    {tag.name}, 
                  </span>
                ))}
              </div>
            </div>
            <div className="game-card-price">{game.price.currency} {game.price.amount.toFixed(2)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({ page, amountOfPages, handlePageChange }) {
  return (
    <div className="pagination-container">
      <button disabled={page === 1} onClick={() => handlePageChange(page - 1)} className='pagination-button'>
        &lt;
      </button>
      <span className='pagination-text'>{page} of {amountOfPages}</span>
      <button disabled={page === amountOfPages} onClick={() => handlePageChange(page + 1)} className='pagination-button'>
        &gt;
      </button>
    </div>
  );
}

export { GamesWrapper, Pagination };