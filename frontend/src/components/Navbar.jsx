import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Users, UserPlus, Filter } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Sparkles size={24} color="#ec4899" />
        <span>HireAI</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={18} style={{ display: 'inline', marginRight: '4px' }} /> Candidates
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <UserPlus size={18} style={{ display: 'inline', marginRight: '4px' }} /> Add Candidate
        </NavLink>
        <NavLink to="/shortlist" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Filter size={18} style={{ display: 'inline', marginRight: '4px' }} /> Shortlist
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
