import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';
import '../styles/styles.css';
import '../styles/purchasePage.css';
import '../styles/login.css';

export default function PurchasePage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Obtiene el objeto de navegación
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:7070/games/${id}`);
        setGame(response.data);
      } catch (err) {
        console.error('API error', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:7070/games/${id}/purchase`, {
        cardHolderName,
        cvv,
        expirationDate,
        number
      }, {
        headers: {
          Authorization: token
        }
      });
      console.log('Purchase successful', response.data);
      navigate('/library');
    } catch (err) {
      console.error('API error', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error in the purchase data or you already have this game.</div>
      ) : game ? (
        <div>
          <div className='purchase-game-card'>
            <img src={game.mainImage.src} alt="game image"/>
            <div className='purchase-game-card-info'>
              <p>{game.name}</p>
              <p>{game.price.currency} {game.price.amount.toFixed(2)}</p>
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Buy {game.name}</h1>
            <label>
              <span>Card Holder Name:</span>
              <input type="text" value={cardHolderName} onChange={(event) => setCardHolderName(event.target.value)} />
            </label>
            <br />
            <label>
              <span>CVV:</span>
              <input type="text" value={cvv} onChange={(event) => setCvv(event.target.value)} />
            </label>
            <br />
            <label>
              <span>Expiration Date:</span>
              <input type="text" value={expirationDate} onChange={(event) => setExpirationDate(event.target.value)} placeholder="MM-dd-yyyy"/>
            </label>
            <br />
            <label>
              <span>Number:</span>
              <input type="text" value={number} onChange={(event) => setNumber(event.target.value)} />
            </label>
            <br />
            <button type="submit">Buy Now</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
