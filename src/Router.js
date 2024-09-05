import React, { Component } from 'react';
//import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';

import Error from './components/Error';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Blog from './components/Blog';
import Search from './components/Search';
import Article from './components/Article';
import CreateArticle from './components/CreateArticle';
import EditArticle from './components/EditArticle';

class Router extends Component {

    render() {


        function Redi() {
            let { search } = useParams();
            return (
                <Navigate to={'/blog/busqueda/' + search} />
            );
        }

        return (
            <BrowserRouter>
                <Header />


                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/home' element={<Home />} />
                    <Route exact path='/blog' element={<Blog />} />
                    <Route exact path='/blog/articulo/:id' element={<Article />} />
                    <Route exact path='/blog/busqueda/:search' element={<Search />} />
                    <Route exact path='/redirect/:search' element={<Redi />} />
                    <Route exact path='/blog/crear' element={<CreateArticle />} />
                    <Route exact path='/blog/editar/:id' element={<EditArticle />} />

                    <Route path='*' element={<Error />} />
                </Routes>



                <div className='clearfix'></div>
                <Footer />


            </BrowserRouter >
        );
    }
}

export default Router;
