import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Planner = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedOutfitId, setSelectedOutfitId] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handlePlanOutfit = async (e) => {
    e.preventDefault();
    if (!selectedOutfitId) return;

    setSaving(true);
    try {
      await api.put(`/outfits/${selectedOutfitId}/plan`, { plannedDate: selectedDate });
      await fetchOutfits(); // refresh to get populated items correctly
      setSelectedOutfitId('');
    } catch (error) {
      console.error('Error planning outfit:', error);
    } finally {
      setSaving(false);
    }
  };

  const removePlan = async (outfitId) => {
    try {
      await api.put(`/outfits/${outfitId}/plan`, { plannedDate: null });
      await fetchOutfits();
    } catch (error) {
      console.error('Error removing plan:', error);
    }
  };

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const next7Days = getNext7Days();

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4"><i className="bi bi-calendar3 text-primary me-2"></i>Outfit Planner</h2>

      <div className="row mb-5">
        <div className="col-lg-6 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white pt-4 pb-3">
              <h5 className="mb-0 fw-bold">Plan an Outfit</h5>
            </div>
            <div className="card-body p-4 bg-light">
              <form onSubmit={handlePlanOutfit}>
                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold">Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold">Outfit</label>
                  <select 
                    className="form-select"
                    value={selectedOutfitId}
                    onChange={(e) => setSelectedOutfitId(e.target.value)}
                    required
                  >
                    <option value="">-- Select an Outfit --</option>
                    {outfits.map(o => (
                      <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 shadow-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Plan Outfit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <h4 className="fw-bold mb-4">Upcoming Week</h4>
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
        {next7Days.map(dateStr => {
          // Find outfits planned for this date
          const plannedForDate = outfits.filter(o => o.plannedDate && o.plannedDate.startsWith(dateStr));
          const dateObj = new Date(dateStr);
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const dayName = isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div className="col" key={dateStr}>
              <div className={`card h-100 shadow-sm border-0 ${isToday ? 'border-primary border-2' : ''}`}>
                <div className={`card-header text-center py-3 ${isToday ? 'bg-primary text-white' : 'bg-white'}`}>
                  <div className="fw-bold fs-5">{dayName}</div>
                  <div className="small">{displayDate}</div>
                </div>
                <div className="card-body p-3 bg-light d-flex flex-column align-items-center justify-content-center">
                  {plannedForDate.length > 0 ? (
                    plannedForDate.map(outfit => (
                      <div key={outfit._id} className="w-100 text-center mb-3 border-bottom pb-3 last-border-none">
                        <div className="fw-semibold text-truncate mb-2">{outfit.name}</div>
                        <div className="d-flex flex-wrap justify-content-center gap-1 mb-2">
                           {outfit.items?.filter(Boolean).slice(0, 4).map(item => (
                             <img 
                               key={item._id}
                               src={item.imageUrl?.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`}
                               alt={item.category || 'Clothing item'}
                               className="rounded shadow-sm"
                               style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                               title={item.name || item.category}
                             />
                           ))}
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removePlan(outfit._id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted small text-center py-4">
                      No outfit planned
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Planner;
