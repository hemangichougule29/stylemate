const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const ClothingItem = require('./models/ClothingItem');
const Outfit = require('./models/Outfit');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Database connected.');

    // Find or create test user
    const email = 'demo@gmail.com';
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = await User.create({
        name: 'Demo User',
        email,
        password: hashedPassword,
      });
      console.log('Created demo user: demo@gmail.com / password123');
    } else {
      console.log('Demo user already exists.');
    }

    // Insert Clothing Items
    const clothes = [
      {
        userId: user._id,
        name: 'White Linen Shirt',
        category: 'Tops',
        color: 'White',
        style: 'Casual',
        season: 'Summer',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        userId: user._id,
        name: 'Blue Denim Jeans',
        category: 'Bottoms',
        color: 'Blue',
        style: 'Casual',
        season: 'All Season',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-780c4050d56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        userId: user._id,
        name: 'Classic White Sneakers',
        category: 'Shoes',
        color: 'White',
        style: 'Casual',
        season: 'All Season',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      },
      {
        userId: user._id,
        name: 'Black Leather Watch',
        category: 'Accessories',
        color: 'Black',
        style: 'Casual',
        season: 'All Season',
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      }
    ];

    // Clear existing for this user if you want, but for seed we just insert
    // await ClothingItem.deleteMany({ userId: user._id });
    
    console.log('Inserting clothing items...');
    const insertedClothes = await ClothingItem.insertMany(clothes);
    console.log(`${insertedClothes.length} clothing items inserted.`);

    // Create Sample Outfit
    const outfit = {
      userId: user._id,
      name: 'Casual Weekend Look',
      items: insertedClothes.map(item => item._id),
      isFavorite: false,
    };

    console.log('Creating sample outfit...');
    const insertedOutfit = await Outfit.create(outfit);
    console.log(`Outfit '${insertedOutfit.name}' created.`);

    console.log('Data Seeding Completed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with seed data:', error);
    process.exit(1);
  }
};

seedData();
