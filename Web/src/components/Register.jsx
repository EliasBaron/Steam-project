import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import '../styles/styles.css';

export default function Register({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:7070/register/', {
        email,
        password,
        name,
        image,
        backgroundImage,
      });

      if (response.status === 200) {
        const user = response.data;
        const token = response.headers.authorization;
        localStorage.setItem('token', token);
        setIsLoggedIn(true); // Set the isLoggedIn state to true
        navigate('/'); // Navigate to the desired route (change to your route)
      } else {
        setError(''); // Clear any previous error message
      }
    } catch (error) {
      console.error(error);
      setError('Email is taken');
    }
  };

  return (
    <div className="main-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <label>
          <span>EMAIL:</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label>
          <span>PASSWORD:</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        <label>
          <span>NAME:</span>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label>
          <span>IMAGE:</span>
          <input type="text" value={image} onChange={(event) => setImage(event.target.value)} />
        </label>

        <label>
          <span>BACKGROUND IMAGE:</span>
          <input type="text" value={backgroundImage} onChange={(event) => setBackgroundImage(event.target.value)} />
        </label>

        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
