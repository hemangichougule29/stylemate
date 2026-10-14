# 👗 Stylemate - AI-Powered Virtual Wardrobe & Outfit Planner

Stylemate is a full-stack MERN application that helps users digitize their wardrobe, organize clothes by category, create custom outfit combinations, and plan outfits for the upcoming week.

---

## ✨ Features

- **User Authentication**: Secure JWT-based signup and login.
- **Digital Wardrobe**: Upload and manage clothing items with category, color, season, and style tags.
- **Wardrobe Filtering**: Instant filtering by category (Tops, Bottoms, Dresses, Outerwear, Shoes, Accessories).
- **Outfit Creator**: Interactive visual mixer to assemble and save custom outfits from wardrobe items.
- **My Outfits**: Browse saved outfits, mark favorites, and delete outfits.
- **Weekly Planner**: Schedule outfits for specific days across the upcoming week.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Axios, Bootstrap / Bootstrap Icons
- **Backend**: Node.js, Express.js, Multer
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` (or copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/stylemate
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
In a new terminal:
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## 📂 Project Structure

```
Stylemate/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Navbar, ProtectedRoute
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Home, Wardrobe, AddClothing, CreateOutfit, Outfits, Planner, Login, Signup
│   │   └── services/    # Axios API client
│   └── package.json
├── server/              # Node/Express backend
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Auth, Clothing, Outfit controllers
│   ├── middleware/      # Auth & Multer upload middleware
│   ├── models/          # User, ClothingItem, Outfit schemas
│   ├── routes/          # Express route handlers
│   └── server.js        # Entry point
├── .gitignore           # Root gitignore (ignores node_modules, .env, uploads)
└── README.md
```

---

## 📝 License
ISC
