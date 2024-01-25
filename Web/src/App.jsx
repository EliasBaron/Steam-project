import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Error404 from './components/Error404';
import TagsPage from './components/TagsPage';
import LoginForm from './components/Login';
import GamesSearch from './components/GamesSearch';
import User from './components/User';
import Register from './components/Register';
import Library from './components/Library';
import PurchasePage from './components/PurchasePage';
import Game from './components/Game'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <div className='main-container'>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </Router>
    </div>
  );
}

function AppRoutes({ isLoggedIn, setIsLoggedIn }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="*" element={<Error404 />} />
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/gamesSearch/:q" element={<GamesSearch />} />
      <Route path="/user/:id" element={<User isLoggedIn={isLoggedIn}/>} />
      <Route path='/library' element={isLoggedIn ? <Library /> : <Navigate to="/login" replace />} />
      <Route path='/games/:id/purchase' element={isLoggedIn ? <PurchasePage /> : <Navigate to="/login" replace />} />
      <Route path="/games/:id" element={<Game isLoggedIn={isLoggedIn}/>} />
    </Routes>
  );
}

export default App;