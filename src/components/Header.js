import React, { Component } from 'react';
import logo from '../assets/images/logo.svg'
import { NavLink } from 'react-router-dom';

class Header extends Component {

    render() {
        return (
            <header id="header">
                <div className="center">
                    <div id="logo">
                        <img src={logo} className="app-logo" alt="Logotipo" />
                        <span id="brand">
                            <strong>Curso</strong> React
                        </span>
                    </div>
                    <nav id="menu">
                        <ul>
                            <li>
                                <NavLink to="/home" activeclassname="active">Inicio</NavLink>
                            </li>
                            <li>
                                <NavLink to="/blog" activeclassname="active">Blog</NavLink>
                            </li>
                            <li>
                                <NavLink to="/formulario" activeclassname="active">Formulario</NavLink>
                            </li>

                        </ul>
                    </nav>
                </div>
            </header>

        );
    }
}
export default Header;