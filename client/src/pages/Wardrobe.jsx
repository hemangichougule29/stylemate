import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'];

  const fetchWardrobe = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/clothing');
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching wardrobe:", err);
      setError(err.response?.data?.message || 'Failed to load wardrobe items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardrobe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/clothing/${id}`);
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting clothing item:', error);
      }
    }
  };

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-grid-fill me-2 text-primary"></i>My Wardrobe</h2>
        <Link to="/add-clothing" className="btn btn-primary shadow-sm">
          <i className="bi bi-plus-lg me-1"></i> Add Item
        </Link>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <ul className="nav nav-pills nav-fill flex-nowrap overflow-auto" style={{ whiteSpace: 'nowrap' }}>
            {categories.map(category => (
              <li className="nav-item mx-1" key={category}>
                <button
                  className={`nav-link rounded-pill ${filter === category ? 'active shadow-sm' : 'text-muted'}`}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm mb-4" role="alert">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchWardrobe}>
            <i className="bi bi-arrow-clockwise me-1"></i> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading your wardrobe...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredItems.map(item => (
            <div className="col" key={item._id}>
              <div className="card h-100 shadow-sm border-0 clothing-card overflow-hidden">
                <div className="position-relative">
                  <img 
                    src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`} 
                    className="card-img-top" 
                    alt={item.name || 'Clothing item'}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <span className="badge bg-white text-dark position-absolute top-0 end-0 m-2 shadow-sm">
                    {item.category}
                  </span>
                  <button 
                    className="btn btn-sm btn-danger position-absolute top-0 start-0 m-2 shadow-sm rounded-circle"
                    onClick={() => handleDelete(item._id)}
                    style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title="Delete item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate fw-semibold">{item.name || `${item.color} ${item.category}`}</h5>
                  <div className="d-flex justify-content-between text-muted small mt-3">
                    <span><i className="bi bi-palette me-1"></i> {item.color}</span>
                    <span><i className="bi bi-cloud-sun me-1"></i> {item.season}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-white rounded-3 mt-4 shadow-sm border-0">
          <i className="bi bi-emoji-frown display-1 text-light mb-3"></i>
          <h4 className="fw-semibold mt-3">No items found</h4>
          <p className="text-muted mb-4">You don't have any clothes in this category yet.</p>
          <Link to="/add-clothing" className="btn btn-outline-primary">
            Add Your First Item
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;
