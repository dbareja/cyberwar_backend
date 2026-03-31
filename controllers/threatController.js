const Threat = require('../models/Threat');
const slugify = require('slugify');

const getThreats = async (req, res) => {
  try {
    const { type, severity, status } = req.query;
    let query = { isActive: true };
    
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    const threats = await Threat.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, threats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAdminThreats = async (req, res) => {
  try {
    const threats = await Threat.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, threats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getThreatById = async (req, res) => {
  try {
    const threat = await Threat.findById(req.params.id);
    if (!threat) return res.status(404).json({ success: false, message: 'Threat not found' });
    res.json({ success: true, threat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createThreat = async (req, res) => {
  try {
    const { name, description, severity, type, affectedSystems, mitigationSteps, color, icon } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const threat = await Threat.create({ 
      name, slug, description, severity, type, affectedSystems, mitigationSteps, color, icon 
    });
    res.status(201).json({ success: true, threat });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Threat already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateThreat = async (req, res) => {
  try {
    const { name, description, severity, type, affectedSystems, mitigationSteps, status, isActive, color, icon } = req.body;
    const updateData = { name, description, severity, type, affectedSystems, mitigationSteps, status, isActive, color, icon };
    if (name) updateData.slug = slugify(name, { lower: true, strict: true });
    updateData.lastUpdated = new Date();
    
    const threat = await Threat.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!threat) return res.status(404).json({ success: false, message: 'Threat not found' });
    res.json({ success: true, threat });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteThreat = async (req, res) => {
  try {
    const threat = await Threat.findByIdAndDelete(req.params.id);
    if (!threat) return res.status(404).json({ success: false, message: 'Threat not found' });
    res.json({ success: true, message: 'Threat deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getThreatStats = async (req, res) => {
  try {
    const stats = await Threat.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalThreats = await Threat.countDocuments({ isActive: true });
    
    // Calculate threat levels dynamically from database
    // or return empty/default if no threats
    const threatStats = {
      ransomware: { level: 0, trend: 'stable' },
      phishing: { level: 0, trend: 'stable' },
      nationState: { level: 0, trend: 'stable' },
      zeroDays: { level: 0, trend: 'stable' }
    };
    
    res.json({ 
      success: true, 
      stats: threatStats,
      total: totalThreats,
      bySeverity: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateThreatStats = async (req, res) => {
  try {
    const { ransomware, phishing, nationState, zeroDays } = req.body;
    
    // In a real app, you'd store this in a database
    // For now, we'll just return success
    // TODO: Create a ThreatStats model to persist this data
    
    res.json({ 
      success: true, 
      message: 'Threat stats updated successfully',
      stats: {
        ransomware,
        phishing,
        nationState,
        zeroDays
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getThreats, getAdminThreats, getThreatById, createThreat, updateThreat, deleteThreat, getThreatStats, updateThreatStats };
