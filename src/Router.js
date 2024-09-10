import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';

import Error from './components/Error';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Blog from './components/Blog';
import Search from './components/Search';
import Article from './components/Article';
import CreateArticle from './components/CreateArticle';
import EditArticle from './components/EditArticle';

const Router = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (email) => {
        setIsLoggedIn(true);
    };

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/LoginForm" element={!isLoggedIn ? <LoginForm handleLogin={handleLogin} /> : <Navigate to={"/home"} />} />
                <Route path="/RegisterForm" element={<RegisterForm />} />
                <Route exact path='/home' element={<Home />} />
                <Route exact path='/' element={<LoginForm />} />
                <Route exact path='/blog' element={<Blog />} />
                <Route exact path='/blog/articulo/:id' element={<Article />} />
                <Route exact path='/blog/busqueda/:search' element={<Search />} />
                <Route exact path='/blog/crear' element={<CreateArticle />} />
                <Route exact path='/blog/editar/:id' element={<EditArticle />} />
                <Route path='*' element={<Error />} />
            </Routes>
            <div className='clearfix'></div>
            <Footer />
        </BrowserRouter>
    );
};

export default Router;

