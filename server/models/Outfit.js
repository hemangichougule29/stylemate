const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema(
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
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClothingItem',
      }
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    plannedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Outfit = mongoose.model('Outfit', outfitSchema);
module.exports = Outfit;
