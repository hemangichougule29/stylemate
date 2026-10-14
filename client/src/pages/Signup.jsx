import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await signup(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus display-4 text-primary"></i>
                <h2 className="mt-2">Join Stylemate</h2>
                <p className="text-muted">Create your digital wardrobe today</p>
              </div>
              
              {error && <div className="alert alert-danger shadow-sm">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold">Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-lock"></i></span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Signing up...</>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
