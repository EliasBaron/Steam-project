import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import '../styles/styles.css';

export default function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:7070/login/', { email, password });

      if (response.status === 200) {
        const user = response.data;
        const token = response.headers.authorization;
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        console.log(user);
        navigate('/');
      } else {
        setError('');
      }
    } catch (error) {
      console.error(error);
      setError('Invalid email or password');
    }
  }
  
  return (
    <div className='main-container'>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label>
          <span>SIGN IN WITH EMAIL:</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label>
          <span>PASSWORD:</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
