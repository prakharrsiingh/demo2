import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CandidateList from './components/CandidateList';
import CandidateForm from './components/CandidateForm';
import ShortlistDashboard from './components/ShortlistDashboard';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CandidateList />} />
            <Route path="/add" element={<CandidateForm />} />
            <Route path="/shortlist" element={<ShortlistDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
