const mongoose = require('mongoose');
const Outfit = require('../models/Outfit');

const saveOutfit = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    const { name, items, isFavorite, plannedDate } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Outfit name is required' });
    }

    // Ensure items is an array of valid ObjectIds (handles both string IDs and { _id } objects)
    const rawItems = Array.isArray(items) ? items : [];
    const itemIds = rawItems
      .map(item => (typeof item === 'object' && item !== null && item._id ? item._id : item))
      .filter(id => id && mongoose.Types.ObjectId.isValid(id));

    if (itemIds.length === 0) {
      return res.status(400).json({ message: 'Please select at least one clothing item for the outfit' });
    }

    const outfitData = {
      userId: req.user._id,
      name: name.trim(),
      items: itemIds,
      isFavorite: Boolean(isFavorite),
    };

    if (plannedDate) {
      outfitData.plannedDate = plannedDate;
    }

    const outfit = new Outfit(outfitData);
    const createdOutfit = await outfit.save();
    await createdOutfit.populate('items');

    res.status(201).json(createdOutfit);
  } catch (error) {
    console.error('Error saving outfit:', error);
    res.status(500).json({ message: 'Failed to save outfit', error: error.message });
  }
};

const getOutfits = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const outfits = await Outfit.find({ userId: req.user._id })
      .populate('items')
      .sort({ createdAt: -1 });

    res.json(outfits);
  } catch (error) {
    console.error('Error getting outfits:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const outfit = await Outfit.findById(req.params.id);

    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    if (outfit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    outfit.isFavorite = !outfit.isFavorite;
    const updatedOutfit = await outfit.save();
    await updatedOutfit.populate('items');

    res.json(updatedOutfit);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const planOutfit = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { plannedDate } = req.body;
    const outfit = await Outfit.findById(req.params.id);

    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    if (outfit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    outfit.plannedDate = plannedDate || null;
    const updatedOutfit = await outfit.save();
    await updatedOutfit.populate('items');

    res.json(updatedOutfit);
  } catch (error) {
    console.error('Error planning outfit:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteOutfit = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const outfit = await Outfit.findById(req.params.id);

    if (!outfit) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    if (outfit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await outfit.deleteOne();
    res.json({ message: 'Outfit removed' });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  saveOutfit,
  getOutfits,
  toggleFavorite,
  planOutfit,
  deleteOutfit,
};
