import React, { useState, useEffect } from 'react';
import { BsSteam } from 'react-icons/bs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import handleLogout from './LogoutButton';
import '../styles/navbar.css';

function Navbar({ isLoggedIn, onLogout, setIsLoggedIn }) {
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      navigate('/gamesSearch/' + searchText);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/library') {
      setActiveLink('library');
    } else if (path.startsWith('/games/')) {
       setActiveLink('store');
     } else {
       setActiveLink('');
     }
   }, [location.pathname]);

   return (
     <nav className="navbar-steam">
       <div className="navbar-container">
         <div className="logo">
           <Link to="/">
            <BsSteam/> <span className="navbar-title">STEAM</span>
            <span className="register-brand">®</span>
          </Link>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={activeLink === 'store' ? 'nav-link active' : 'nav-link'}>
              STORE
            </Link>
          </li>
          <li>
            <Link to="/library" className={activeLink === 'library' ? 'nav-link active' : 'nav-link'}>
               LIBRARY
             </Link>
          </li>
         </ul>
         <div className="search-bar">
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={handleEnter} placeholder="SEARCH" />
            <i className="fas fa-search"></i>
           </div>
        <div className="user-menu">
          {isLoggedIn ? (
             <>
               <i className="fas fa-user"></i>
               <span
                 onClick={() => {
                   handleLogout(setIsLoggedIn);
                 }}
               >
                 LOG OUT
               </span>
             </>
           ) : (
             <>
               <Link to="/login">LOGIN</Link> / <Link to="/register">REGISTER</Link>
             </>
          )}
        </div>
      </div>
     </nav>
   );
}

export default Navbar;
