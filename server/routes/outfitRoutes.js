const express = require('express');
const router = express.Router();
const { saveOutfit, getOutfits, toggleFavorite, planOutfit, deleteOutfit } = require('../controllers/outfitController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, saveOutfit)
  .get(protect, getOutfits);

router.put('/:id/favorite', protect, toggleFavorite);
router.put('/:id/plan', protect, planOutfit);
router.delete('/:id', protect, deleteOutfit);

module.exports = router;
