import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetailPage from './pages/PropertyDetailPage';
import News from './pages/News';
import NewsDetailPage from './pages/NewsDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import { AuthProvider } from "./context/AuthContext";
import MyRequests from "./pages/MyRequests";
import ImageAnalyzer from "./components/ImageAnalyzer";
import AdminRequests from "./pages/AdminRequests";
import DealManager from "./components/DealManager";
import AdminDeals from "./pages/AdminDeals";
import TourPage from "./pages/TourPage";
import './App.css';



const App = () => {

    
    return (
        <AuthProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/analyze" element={<ImageAnalyzer />} />
                <Route path="/admin/requests" element={<AdminRequests />} />
                <Route path="/admin/deals" element={<DealManager />} />
                <Route path="/admin/deals" element={<AdminDeals />} />
                <Route path="/tour/:propertyId" element={<TourPage />} />
            </Routes>
        </Router>
        </AuthProvider>
    );
};

export default App;