import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddClothing = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tops',
    color: '',
    season: 'Summer',
    style: 'Casual'
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image for your clothing item');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('image', image);
      
      await api.post('/clothing', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/wardrobe');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to add clothing item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex align-items-center">
              <i className="bi bi-plus-circle-fill text-primary fs-3 me-2"></i>
              <h3 className="mb-0 fw-bold">Add New Clothing</h3>
            </div>
            <div className="card-body p-4 p-md-5">
              {error && <div className="alert alert-danger shadow-sm">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="row g-5">
                  {/* Image Upload Column */}
                  <div className="col-md-5">
                    <label className="form-label fw-semibold text-muted mb-3">Item Photo</label>
                    <div 
                      className="border rounded-3 text-center d-flex flex-column justify-content-center align-items-center bg-light shadow-sm transition-all"
                      style={{ 
                        height: '350px', 
                        cursor: 'pointer', 
                        position: 'relative', 
                        overflow: 'hidden',
                        borderStyle: preview ? 'solid' : 'dashed !important',
                        borderWidth: '2px'
                      }}
                      onClick={() => document.getElementById('imageInput').click()}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-75 text-white py-2" style={{ backdropFilter: 'blur(4px)' }}>
                            <i className="bi bi-camera me-2"></i>Change Photo
                          </div>
                        </>
                      ) : (
                        <div className="p-4">
                          <i className="bi bi-cloud-arrow-up display-1 text-primary opacity-50 mb-3"></i>
                          <h5 className="text-secondary">Upload a photo</h5>
                          <p className="text-muted small">Click to browse or drag and drop</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      id="imageInput" 
                      className="d-none" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </div>
                  
                  {/* Form Details Column */}
                  <div className="col-md-7">
                    <div className="mb-4">
                      <label className="form-label fw-semibold text-muted">Item Name <span className="fw-normal text-secondary">(Optional)</span></label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg bg-light" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Favorite Blue Denim Jacket"
                      />
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <label className="form-label fw-semibold text-muted">Category</label>
                        <select 
                          className="form-select form-select-lg bg-light" 
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="Tops">Tops</option>
                          <option value="Bottoms">Bottoms</option>
                          <option value="Dresses">Dresses</option>
                          <option value="Shoes">Shoes</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                      
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold text-muted">Color</label>
                        <input 
                          type="text" 
                          className="form-control form-control-lg bg-light" 
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          placeholder="e.g., Blue"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-4">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <label className="form-label fw-semibold text-muted">Season</label>
                        <select 
                          className="form-select form-select-lg bg-light" 
                          name="season"
                          value={formData.season}
                          onChange={handleChange}
                        >
                          <option value="Summer">Summer</option>
                          <option value="Winter">Winter</option>
                          <option value="Monsoon">Monsoon</option>
                        </select>
                      </div>
                      
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold text-muted">Style</label>
                        <select 
                          className="form-select form-select-lg bg-light" 
                          name="style"
                          value={formData.style}
                          onChange={handleChange}
                        >
                          <option value="Casual">Casual</option>
                          <option value="Formal">Formal</option>
                          <option value="Party">Party</option>
                        </select>
                      </div>
                    </div>
                    
                    <hr className="my-4" />
                    
                    <div className="d-flex justify-content-end gap-3 mt-4">
                      <button 
                        type="button" 
                        className="btn btn-light btn-lg px-4"
                        onClick={() => navigate('/wardrobe')}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg px-4 shadow-sm"
                        disabled={loading}
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                        ) : (
                          <><i className="bi bi-check2-circle me-2"></i>Add to Wardrobe</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClothing;
