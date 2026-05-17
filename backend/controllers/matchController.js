const Candidate = require('../models/Candidate');
const axios = require('axios');

// Basic Matching Logic
exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is mandatory' });
    }

    const minExp = minExperience || 0;

    // Fetch all candidates
    const candidates = await Candidate.find();

    // Match logic
    const matchedCandidates = candidates.map(candidate => {
      // Experience check
      if (candidate.experience < minExp) {
        return { ...candidate.toObject(), matchScore: 0 };
      }

      // Skill overlap
      const matchedSkills = candidate.skills.filter(skill =>
        requiredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      
      const score = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) : 0;
      
      return {
        ...candidate.toObject(),
        matchScore: score * 100, // as percentage
        matchedSkills
      };
    }).filter(c => c.matchScore > 0) // only return those who matched something, or optionally return all
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to match candidates' });
  }
};

// AI-Based Shortlisting
exports.aiShortlist = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    // First, get top candidates using basic logic to send to AI to save tokens
    const candidates = await Candidate.find({ experience: { $gte: minExperience || 0 } });
    
    // We will send all eligible candidates to the AI. If there are too many, we could limit.
    const candidatesList = candidates.map((c, i) => 
      `${i + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - ${c.experience} years exp`
    ).join('\n');

    const prompt = `
      Job requires the following skills: ${requiredSkills.join(', ')} (Minimum ${minExperience || 0} years experience).
      
      Here are the candidates:
      ${candidatesList}
      
      Please rank the top 3 best-fit candidates and provide a brief explanation for why each is suitable.
      Also, suggest 1-2 interview questions for each shortlisted candidate based on their profile.
      
      Format the response in JSON array with the following structure:
      [
        {
          "name": "Candidate Name",
          "explanation": "Why they fit",
          "interviewQuestions": ["Q1", "Q2"]
        }
      ]
      Ensure the output is ONLY valid JSON.
    `;

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: "You are an expert technical recruiter AI. You only reply with strictly formatted JSON." },
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    let aiResult = response.data.choices[0].message.content;
    
    // Clean up if the AI wrapped the JSON in markdown blocks
    if (aiResult.startsWith('\`\`\`json')) {
      aiResult = aiResult.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    } else if (aiResult.startsWith('\`\`\`')) {
      aiResult = aiResult.replace(/\`\`\`/g, '').trim();
    }

    const parsedResult = JSON.parse(aiResult);

    res.json(parsedResult);
  } catch (error) {
    console.error("AI matching failed:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate AI shortlisting' });
  }
};
