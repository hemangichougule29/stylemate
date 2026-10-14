const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'],
    },
    color: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      required: true,
      enum: ['Casual', 'Party', 'Formal', 'Sports', 'Ethnic'],
    },
    season: {
      type: String,
      required: true,
      enum: ['Summer', 'Winter', 'Monsoon', 'All Season', 'Spring', 'Fall', 'Autumn'],
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClothingItem = mongoose.model('ClothingItem', clothingItemSchema);
module.exports = ClothingItem;
