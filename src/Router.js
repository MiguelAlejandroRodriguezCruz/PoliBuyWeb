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
import Product from './components/Product';
import CreateProduct from './components/CreateProduct';
import EditArticle from './components/EditArticle';
import Categories from './components/Categories';

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
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);

    const handleLogin = (role, id) => {
        setIsLoggedIn(true);
        setUserRole(role);
        setUserId(id);
        localStorage.setItem('userId', id);  // Guarda el userId en el localStorage
    };

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route
                        path="/LoginForm"
                        element={!isLoggedIn ? <LoginForm handleLogin={handleLogin} /> : <Navigate to="/Home" />}
                    />
                    <Route
                        exact
                        path="/"
                        element={!isLoggedIn ? <LoginForm handleLogin={handleLogin} /> : <Navigate to="/Home" />}
                    />
                    <Route path="/RegisterForm" element={<RegisterForm />} />
                    <Route exact path='/Home' element={<Home userId={userId} userRole={userRole} />} />
                    <Route exact path='/Ofertas' element={<Ofertas userId={userId} userRole={userRole} />} />
                    <Route exact path='/Categories' element={<Categories userId={userId} userRole={userRole} />} />
                    <Route exact path='/ShopCart' element={<ShopCart />} />
                    <Route exact path='/Product/:id' element={<Product userId={userId} />} />
                    <Route exact path='/Ofertas/busqueda/:search' element={<Search />} />
                    <Route exact path='/CreateProduct' element={<CreateProduct />} />
                    <Route exact path='/Ofertas/editar/:id' element={<EditArticle />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </Layout>
            {/*<Footer />*/}
        </BrowserRouter>
    );
};

export default Router;
