import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-stars text-warning me-2"></i> Stylemate
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/wardrobe">Wardrobe</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-clothing">Add Clothes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-outfit">Create Outfit</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/outfits">Outfits</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/planner">Planner</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light nav-link px-3" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-light nav-link px-3" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary nav-link text-white px-3" to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
