import React, { useState } from 'react';
import { addCandidate } from '../api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Plus } from 'lucide-react';

const CandidateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: '',
    projects: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: Number(formData.experience)
      };
      await addCandidate(payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Plus size={24} color="var(--primary)" /> Add New Candidate
      </h2>
      
      {error && <div className="info-box" style={{ borderLeftColor: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleChange} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Skills (comma separated)</label>
          <input type="text" name="skills" className="form-control" placeholder="React, Node.js, MongoDB" required value={formData.skills} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Years of Experience</label>
          <input type="number" name="experience" className="form-control" min="0" step="0.5" required value={formData.experience} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Bio (Optional)</label>
          <textarea name="bio" className="form-control" rows="3" value={formData.bio} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Projects / Links (Optional)</label>
          <textarea name="projects" className="form-control" rows="2" value={formData.projects} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Adding...' : <><CheckCircle size={18} /> Save Candidate</>}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
