import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="p-5 text-center bg-white rounded-3 shadow-sm border border-light">
        <i className="bi bi-stars display-1 text-primary mb-3"></i>
        <h1 className="display-4 fw-bold">Welcome to Stylemate</h1>
        <p className="lead mt-3 mx-auto" style={{ maxWidth: '600px' }}>
          Your personal digital wardrobe and outfit planner. Organize your clothes, create stunning outfits, and plan what to wear effortlessly.
        </p>
        <div className="mt-5">
          {user ? (
            <>
              <Link to="/wardrobe" className="btn btn-primary btn-lg me-3 px-4 shadow-sm">
                <i className="bi bi-grid-fill me-2"></i>My Wardrobe
              </Link>
              <Link to="/create-outfit" className="btn btn-outline-primary btn-lg px-4 shadow-sm">
                <i className="bi bi-magic me-2"></i>Create Your Outfit
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary btn-lg me-3 px-4 shadow-sm">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg px-4 shadow-sm">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="row mt-5 text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body py-5">
              <i className="bi bi-collection display-4 text-primary mb-3"></i>
              <h3 className="h5 font-weight-bold">Organize</h3>
              <p className="text-muted">Keep track of every piece of clothing you own in one digital space.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body py-5">
              <i className="bi bi-emoji-sunglasses display-4 text-primary mb-3"></i>
              <h3 className="h5 font-weight-bold">Style</h3>
              <p className="text-muted">Mix and match items to create the perfect outfits for any occasion.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0 bg-white">
            <div className="card-body py-5">
              <i className="bi bi-calendar-check display-4 text-primary mb-3"></i>
              <h3 className="h5 font-weight-bold">Plan</h3>
              <p className="text-muted">Schedule your outfits in advance so you're always ready to go.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
