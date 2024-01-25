import { useState, useEffect } from 'react'
import '../styles/styles.css'
import axios from 'axios'
import '../styles/library.css'
import { useNavigate } from 'react-router-dom';

export default function Library() {
  const [user, setUser] = useState(null)
  const [games, setGames] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:7070/users/current', {
          headers: {
            Authorization: token
          }
        });
        setUser(response.data);
        setGames(response.data.games);
      } catch (err) {
        console.error('API error', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='main-container'>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error fetching data</div>
      ) : user ? (
				<>
        <div className='user-info'>
          <div className='user-avatar'>
            <img src={user.image} alt='user avatar' />
          </div>
          <div className='user-name'>
            <h3>{user.name}</h3>
          </div>
					</div>
					<div className="games-wrapper" >
					<h1 className='games-title'>Games</h1>
        {games.map((game) => (
          <div className="game-card" key={game.id} onClick={() => { navigate('../games/' + game.id)} }>
            <img src={game.mainImage.src} alt="game_image" className="" />
            <div className="game-card-info">
              <div className='game-text-container'>
                <h3 className="game-card-title">{game.name}</h3>
                <div className="game-card-tags">
                  {game.tags.slice(0,8).map((tag, index) => (
                    <span key={index} className="game-card-tag">
                      {tag.name}, 
                    </span>
                  ))}
                </div>
              </div>
              <div className="game-card-price">{game.price.amount.toFixed(2)} {game.price.currency}</div>
            </div>
          </div>
        ))}
      </div>
				</>
      ) : null}
    </div>
  )
}
