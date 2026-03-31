const Tag = require('../models/Tag');
const slugify = require('slugify');

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort('-blogCount').lean();
    res.json({ success: true, tags });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createTag = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const tag = await Tag.create({ name: name.toLowerCase(), slug, description, color });
    res.status(201).json({ success: true, tag });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Tag already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateTag = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const updateData = { name: name?.toLowerCase(), description, color };
    if (name) updateData.slug = slugify(name, { lower: true, strict: true });
    const tag = await Tag.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!tag) return res.status(404).json({ success: false, message: 'Tag not found' });
    res.json({ success: true, tag });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ success: false, message: 'Tag not found' });
    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getTags, createTag, updateTag, deleteTag };
