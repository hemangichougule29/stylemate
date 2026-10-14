const express = require('express');
const router = express.Router();
const { addClothing, getClothes, deleteClothing } = require('../controllers/clothingController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const uploadImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Image upload failed' });
    }
    next();
  });
};

router.route('/')
  .post(protect, uploadImage, addClothing)
  .get(protect, getClothes);

router.route('/:id')
  .delete(protect, deleteClothing);

module.exports = router;
