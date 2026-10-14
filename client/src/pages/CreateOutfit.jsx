import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateOutfit = () => {
  const [clothes, setClothes] = useState([]);
  const [outfitName, setOutfitName] = useState('');
  const [selectedItems, setSelectedItems] = useState({
    Tops: null,
    Bottoms: null,
    Dresses: null,
    Outerwear: null,
    Shoes: null,
    Accessories: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        const res = await api.get('/clothing');
        setClothes(res.data);
      } catch (err) {
        console.error('Error fetching clothes:', err);
        setError('Failed to load clothes');
      } finally {
        setLoading(false);
      }
    };
    fetchClothes();
  }, []);

  // Category matching case-insensitively (e.g. "tops", "Tops", "top")
  const getItemsByCategory = (cat) => {
    return clothes.filter((c) => {
      if (!c.category) return false;
      const itemCat = c.category.toLowerCase().trim();
      const targetCat = cat.toLowerCase().trim();
      return itemCat === targetCat || itemCat === targetCat.slice(0, -1) || `${itemCat}s` === targetCat;
    });
  };

  const handleSelect = (category, item) => {
    const itemId = item._id || item.id;

    setSelectedItems((prev) => {
      const currentSelectedId = prev[category]?._id || prev[category]?.id;
      return {
        ...prev,
        [category]: currentSelectedId === itemId ? null : item,
      };
    });
  };

  const handleSave = async () => {
    setError('');

    if (!outfitName || !outfitName.trim()) {
      setError('Please provide a name for the outfit.');
      return;
    }

    // Extract valid MongoDB ObjectIds (_id or id)
    const items = Object.values(selectedItems)
      .filter((item) => item !== null && item !== undefined)
      .map((item) => item._id || item.id)
      .filter(Boolean);

    if (items.length === 0) {
      setError('Please select at least one item for the outfit.');
      return;
    }

    setSaving(true);

    try {
      await api.post('/outfits', {
        name: outfitName.trim(),
        items,
        isFavorite: false,
      });
      navigate('/outfits');
    } catch (err) {
      console.error('Error saving outfit:', err);
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save outfit. Please try again.';
      setError(serverMsg);
    } finally {
      setSaving(false);
    }
  };

  const renderCategorySelection = (category) => {
    const categoryItems = getItemsByCategory(category);

    return (
      <div className="mb-4" key={category}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0 fw-semibold">{category}</h5>
          {selectedItems[category] && (
            <button
              className="btn btn-sm btn-link text-danger text-decoration-none p-0"
              onClick={() => setSelectedItems((prev) => ({ ...prev, [category]: null }))}
            >
              Clear
            </button>
          )}
        </div>
        {categoryItems.length === 0 ? (
          <p className="text-muted small">No {category.toLowerCase()} found in your wardrobe.</p>
        ) : (
          <div className="d-flex overflow-auto gap-3 pb-2" style={{ whiteSpace: 'nowrap' }}>
            {categoryItems.map((item) => {
              const itemId = item._id || item.id;
              const currentId = selectedItems[category]?._id || selectedItems[category]?.id;
              const isSelected = currentId === itemId;

              return (
                <div
                  key={itemId}
                  className={`card cursor-pointer position-relative ${isSelected ? 'border-primary border-2 shadow-sm' : 'border'
                    }`}
                  style={{ minWidth: '140px', maxWidth: '140px', cursor: 'pointer' }}
                  onClick={() => handleSelect(category, item)}
                >
                  {isSelected && (
                    <span className="position-absolute top-0 end-0 badge bg-primary m-1 shadow-sm">
                      <i className="bi bi-check"></i>
                    </span>
                  )}
                  <img
                    src={
                      item.imageUrl?.startsWith('http')
                        ? item.imageUrl
                        : `http://localhost:5000${item.imageUrl}`
                    }
                    className="card-img-top"
                    alt={item.name || category}
                    style={{ height: '140px', objectFit: 'cover' }}
                  />
                  <div className="card-body p-2 text-center text-truncate small">
                    {item.name || `${item.color || ''} ${item.category || ''}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-magic text-primary me-2"></i>Create Outfit
      </h2>

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between shadow-sm mb-4">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <button className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
        </div>
      )}

      <div className="row">
        {/* Selection Area */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              {categories.map((cat) => renderCategorySelection(cat))}
            </div>
          </div>
        </div>

        {/* Preview & Save Area */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-white border-bottom pt-4 pb-3">
              <h5 className="mb-0 fw-bold">Outfit Preview</h5>
            </div>
            <div
              className="card-body d-flex flex-column align-items-center bg-light p-4"
              style={{ maxHeight: '450px', overflowY: 'auto' }}
            >
              {Object.entries(selectedItems).map(([cat, item]) => {
                if (!item) return null;
                const itemId = item._id || item.id;
                return (
                  <div
                    key={cat}
                    className="position-relative mb-3 shadow-sm bg-white rounded"
                    style={{ width: '180px', height: '180px' }}
                  >
                    <img
                      src={
                        item.imageUrl?.startsWith('http')
                          ? item.imageUrl
                          : `http://localhost:5000${item.imageUrl}`
                      }
                      alt={cat}
                      className="rounded"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="position-absolute top-0 end-0 badge bg-dark m-2">{cat}</span>
                  </div>
                );
              })}

              {Object.values(selectedItems).every((item) => item === null) && (
                <div className="text-center text-muted my-5 py-5">
                  <i className="bi bi-person-fill display-1 opacity-25"></i>
                  <p className="mt-3">Select items to preview outfit</p>
                </div>
              )}
            </div>
            <div className="card-footer bg-white border-top p-4">
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Outfit Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Summer Casual"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Outfit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOutfit;