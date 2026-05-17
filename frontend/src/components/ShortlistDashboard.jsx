import React, { useState } from 'react';
import { matchCandidates, aiShortlist } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

const ShortlistDashboard = () => {
  const [reqData, setReqData] = useState({ requiredSkills: '', minExperience: 0 });
  const [matches, setMatches] = useState([]);
  const [aiResults, setAiResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        requiredSkills: reqData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        minExperience: Number(reqData.minExperience)
      };
      const data = await matchCandidates(payload);
      setMatches(data);
      setAiResults(null); // Reset AI results when new match is done
    } catch (error) {
      console.error('Match error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiShortlist = async () => {
    setAiLoading(true);
    try {
      const payload = {
        requiredSkills: reqData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
        minExperience: Number(reqData.minExperience)
      };
      const data = await aiShortlist(payload);
      setAiResults(data);
    } catch (error) {
      console.error('AI Shortlist error:', error);
      alert('AI Shortlisting failed. Please check backend logs or API Key.');
    } finally {
      setAiLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'match-high';
    if (score >= 50) return 'match-med';
    return 'match-low';
  };

  return (
    <div>
      <div className="glass-container" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={24} color="var(--primary)" /> Job Requirements
        </h2>
        <form onSubmit={handleMatch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginTop: '1rem' }}>
          <div className="form-group" style={{ margin: 0, flex: '1 1 300px' }}>
            <label className="form-label">Required Skills (comma separated)</label>
            <input type="text" className="form-control" required 
                   value={reqData.requiredSkills} 
                   onChange={(e) => setReqData({ ...reqData, requiredSkills: e.target.value })} 
                   placeholder="e.g. React, Node.js, AWS" />
          </div>
          <div className="form-group" style={{ margin: 0, flex: '0 1 150px' }}>
            <label className="form-label">Min. Experience</label>
            <input type="number" className="form-control" required min="0" step="0.5"
                   value={reqData.minExperience} 
                   onChange={(e) => setReqData({ ...reqData, minExperience: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Find Matches'}
          </button>
        </form>
      </div>

      {matches.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Candidates List */}
          <div className="glass-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2>Top Matches</h2>
              <button onClick={handleAiShortlist} className="btn" style={{ background: 'linear-gradient(135deg, var(--secondary), #f43f5e)', color: 'white' }} disabled={aiLoading}>
                {aiLoading ? 'Thinking...' : <><BrainCircuit size={18} /> Ask AI to Rank</>}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matches.map(candidate => (
                <div key={candidate._id} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{candidate.name}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                      Exp: {candidate.experience} yrs | Matched: {candidate.matchedSkills.join(', ')}
                    </div>
                  </div>
                  <div className={`match-score ${getScoreClass(candidate.matchScore)}`}>
                    {Math.round(candidate.matchScore)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Results & Graph Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Graph */}
            <div className="glass-container" style={{ height: '300px' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Match Scores Overview</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matches.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                  <YAxis dataKey="name" type="category" stroke="var(--text-muted)" width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '8px' }} />
                  <Bar dataKey="matchScore" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Results */}
            {aiResults && (
              <div className="glass-container" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)' }}>
                  <BrainCircuit size={24} /> AI Recommendation
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {aiResults.map((result, idx) => (
                    <div key={idx} className="ai-reasoning" style={{ margin: 0 }}>
                      <h4><CheckCircle2 size={18} /> {result.name}</h4>
                      <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{result.explanation}</p>
                      
                      {result.interviewQuestions && (
                        <div style={{ marginTop: '1rem' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Suggested Questions:</strong>
                          <ul className="questions-list">
                            {result.interviewQuestions.map((q, qidx) => (
                              <li key={qidx} style={{ marginBottom: '4px' }}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortlistDashboard;
