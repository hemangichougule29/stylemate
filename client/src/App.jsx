import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wardrobe from './pages/Wardrobe';
import AddClothing from './pages/AddClothing';
import CreateOutfit from './pages/CreateOutfit';
import Outfits from './pages/Outfits';
import Planner from './pages/Planner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100 bg-light" style={{ backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/wardrobe" element={
                <ProtectedRoute>
                  <Wardrobe />
                </ProtectedRoute>
              } />
              <Route path="/add-clothing" element={
                <ProtectedRoute>
                  <AddClothing />
                </ProtectedRoute>
              } />
              
              <Route path="/create-outfit" element={
                <ProtectedRoute>
                  <CreateOutfit />
                </ProtectedRoute>
              } />
              <Route path="/outfits" element={
                <ProtectedRoute>
                  <Outfits />
                </ProtectedRoute>
              } />
              <Route path="/planner" element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer className="bg-white text-center py-4 mt-auto border-top">
            <div className="container">
              <p className="text-muted mb-0">&copy; {new Date().getFullYear()} Stylemate. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
