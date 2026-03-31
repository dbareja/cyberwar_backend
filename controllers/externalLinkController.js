const ExternalLink = require('../models/ExternalLink');

const getExternalLinks = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    
    if (category) query.category = category;
    
    const links = await ExternalLink.find(query).sort({ priority: -1, createdAt: -1 }).lean();
    res.json({ success: true, links });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAdminExternalLinks = async (req, res) => {
  try {
    const links = await ExternalLink.find().sort({ priority: -1, createdAt: -1 }).lean();
    res.json({ success: true, links });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createExternalLink = async (req, res) => {
  try {
    const { title, description, url, category, icon, priority } = req.body;
    const link = await ExternalLink.create({ title, description, url, category, icon, priority });
    res.status(201).json({ success: true, link });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateExternalLink = async (req, res) => {
  try {
    const { title, description, url, category, icon, priority, isActive } = req.body;
    const updateData = { title, description, url, category, icon, priority, isActive };
    
    const link = await ExternalLink.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!link) return res.status(404).json({ success: false, message: 'External link not found' });
    res.json({ success: true, link });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteExternalLink = async (req, res) => {
  try {
    const link = await ExternalLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ success: false, message: 'External link not found' });
    res.json({ success: true, message: 'External link deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const trackClick = async (req, res) => {
  try {
    await ExternalLink.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getExternalLinks, getAdminExternalLinks, createExternalLink, updateExternalLink, deleteExternalLink, trackClick };
