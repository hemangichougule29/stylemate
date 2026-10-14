const ClothingItem = require('../models/ClothingItem');

const addClothing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, category, color, style, season } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const itemName = (name && name.trim()) 
      ? name.trim() 
      : `${color || ''} ${category || 'Clothing'}`.trim();

    const clothing = new ClothingItem({
      userId: req.user._id,
      name: itemName,
      category: category || 'Tops',
      color: color || 'Unknown',
      style: style || 'Casual',
      season: season || 'All Season',
      imageUrl,
    });

    const createdClothing = await clothing.save();
    res.status(201).json(createdClothing);
  } catch (error) {
    console.error('Error adding clothing:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getClothes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { category, style } = req.query;
    let query = { userId: req.user._id };
    
    if (category && category.toLowerCase() !== 'all') {
      query.category = category;
    }
    if (style && style.toLowerCase() !== 'all') {
      query.style = style;
    }

    const clothes = await ClothingItem.find(query).sort({ createdAt: -1 });
    res.json(clothes);
  } catch (error) {
    console.error('Error fetching clothes:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteClothing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const clothing = await ClothingItem.findById(req.params.id);

    if (!clothing) {
      return res.status(404).json({ message: 'Clothing item not found' });
    }

    if (clothing.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    await clothing.deleteOne();
    res.json({ message: 'Clothing removed' });
  } catch (error) {
    console.error('Error deleting clothing:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addClothing,
  getClothes,
  deleteClothing,
};
