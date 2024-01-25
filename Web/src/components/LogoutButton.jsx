

export const handleLogout = (setIsLoggedIn) => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    };
    
export default handleLogout;