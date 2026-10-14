import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      const res = await api.get('/outfits');
      setOutfits(res.data);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await api.put(`/outfits/${id}/favorite`);
      setOutfits(outfits.map(o => o._id === id ? res.data : o));
      // Since toggleFavorite in controller might not populate items, we might just update the isFavorite locally
      // Actually, if we just spread the previous outfit and update isFavorite, it's safer for populated items.
      setOutfits(outfits.map(o => o._id === id ? { ...o, isFavorite: !o.isFavorite } : o));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const deleteOutfit = async (id) => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        await api.delete(`/outfits/${id}`);
        setOutfits(outfits.filter(o => o._id !== id));
      } catch (error) {
        console.error('Error deleting outfit:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-images text-primary me-2"></i>My Outfits</h2>
        <Link to="/create-outfit" className="btn btn-primary shadow-sm">
          <i className="bi bi-plus-lg me-1"></i> Create Outfit
        </Link>
      </div>

      {outfits.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border-0">
          <i className="bi bi-magic display-1 text-light mb-3"></i>
          <h4 className="fw-semibold mt-3">No outfits yet</h4>
          <p className="text-muted mb-4">Mix and match your clothes to create outfits.</p>
          <Link to="/create-outfit" className="btn btn-outline-primary">Create Your First Outfit</Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {outfits.map(outfit => (
            <div className="col" key={outfit._id}>
              <div className="card h-100 border-0 shadow-sm overflow-hidden">
                <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold text-truncate">{outfit.name}</h5>
                  <div>
                    <button 
                      className="btn btn-sm btn-light border me-2 rounded-circle"
                      onClick={() => toggleFavorite(outfit._id)}
                      style={{ width: '32px', height: '32px', padding: '0' }}
                    >
                      <i className={`bi ${outfit.isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-light border text-danger rounded-circle"
                      onClick={() => deleteOutfit(outfit._id)}
                      style={{ width: '32px', height: '32px', padding: '0' }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body p-3 bg-light">
                  <div className="d-flex flex-nowrap overflow-auto gap-2 pb-2">
                    {outfit.items?.filter(Boolean).map(item => (
                      <div key={item._id} className="position-relative" style={{ minWidth: '80px', width: '80px', height: '80px' }}>
                        <img 
                          src={item.imageUrl?.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`}
                          alt={item.category || 'Clothing item'}
                          className="rounded shadow-sm"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          title={item.name || item.category}
                        />
                      </div>
                    ))}
                  </div>
                  {outfit.plannedDate && (
                    <div className="mt-3 text-muted small">
                      <i className="bi bi-calendar-check me-1 text-success"></i>
                      Planned for: {new Date(outfit.plannedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Outfits;
