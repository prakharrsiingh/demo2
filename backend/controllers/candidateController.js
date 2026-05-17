const Candidate = require('../models/Candidate');

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
};

// Toggle shortlist status
exports.toggleShortlist = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    
    candidate.isShortlisted = !candidate.isShortlisted;
    await candidate.save();
    
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

// Add a new candidate
exports.addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio, projects } = req.body;
    
    // Create candidate
    const newCandidate = new Candidate({
      name,
      email,
      skills,
      experience,
      bio,
      projects
    });

    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to add candidate' });
  }
};
