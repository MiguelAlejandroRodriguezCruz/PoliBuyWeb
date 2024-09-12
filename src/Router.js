import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Error from './components/Error';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Ofertas from './components/Ofertas';
import ShopCart from './components/Shopcart';
import Search from './components/Search';
import Article from './components/Article';
import CreateArticle from './components/CreateArticle';
import EditArticle from './components/EditArticle';

const Layout = ({ children }) => {
    const location = useLocation(); // Hook dentro de BrowserRouter

    // Condición para ocultar el Header en las rutas específicas
    const hideHeaderRoutes = ['/LoginForm', '/RegisterForm', '/'];

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname) && <Header />}
            {children}

        </>
    );
};

const Router = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (email) => {
        setIsLoggedIn(true);
    };

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/LoginForm" element={!isLoggedIn ? <LoginForm handleLogin={handleLogin} /> : <Navigate to={"/home"} />} />
                    <Route path="/RegisterForm" element={<RegisterForm />} />
                    <Route exact path='/home' element={<Home />} />
                    <Route exact path='/' element={!isLoggedIn ? <LoginForm handleLogin={handleLogin} /> : <Navigate to={"/home"} />} />
                    <Route exact path='/Ofertas' element={<Ofertas />} />
                    <Route exact path='/ShopCart' element={<ShopCart />} />
                    <Route exact path='/Ofertas/articulo/:id' element={<Article />} />
                    <Route exact path='/Ofertas/busqueda/:search' element={<Search />} />
                    <Route exact path='/Ofertas/crear' element={<CreateArticle />} />
                    <Route exact path='/Ofertas/editar/:id' element={<EditArticle />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </Layout>
            {/*<Footer />*/}
        </BrowserRouter>
    );
};

export default Router;
