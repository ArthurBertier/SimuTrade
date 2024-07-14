import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/navBar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuItems = [
    { name: 'HOME', path: '/home' },
    { name: 'WATCHLIST', path: '/watchlist' },
    { name: 'STOCK LISTING', path: '/stock-listing' },
    { name: 'DISCOVERY', path: '/discovery' },
    { name: 'LIST ORDERS', path: '/list-orders' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="path-to-your-image.jpg" alt="Logo" className="navbar-image"/>
        </div>
        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item, index) => (
            <li className="navbar-item" key={index}>
              <a
                href={item.path}
                className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="navbar-hamburger" onClick={toggleMenu}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
