const Category = require('../models/Category');
const slugify = require('slugify');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name').lean();
    
    // Add article count for each category
    const Blog = require('../models/Blog');
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Blog.countDocuments({ category: cat._id, status: 'published' });
        return { ...cat, articlesCount: count };
      })
    );
    
    res.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name').lean();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await Category.create({ name, slug, description, color, icon });
    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Category already exists' });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, color, icon, isActive } = req.body;
    const updateData = { name, description, color, icon, isActive };
    if (name) updateData.slug = slugify(name, { lower: true, strict: true });
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getCategories, getAdminCategories, createCategory, updateCategory, deleteCategory };
