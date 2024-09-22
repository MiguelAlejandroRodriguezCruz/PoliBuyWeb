import React, { Component } from 'react';
import logo from '../assets/images/Logo.jpeg';
import { NavLink } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <header style={styles.header}>
                <div style={styles.topBar}>
                    <NavLink to="/Home" style={styles.logoContainer}>
                        <img src={logo} style={styles.logo} alt="Logotipo" />
                        <span style={styles.brand}><strong>PoliBuy</strong></span>
                    </NavLink>
                    <div>
                        <h2>Bienvenido a PoliBuy</h2>
                    </div>
                    <div style={styles.rightMenu}>
                        <NavLink to="/Like" style={styles.iconLink}>
                            <span role="img" aria-label="favoritos">❤️</span>
                            <span style={styles.counter}>12</span>
                        </NavLink>
                        <NavLink to="/login" style={styles.iconLink}>
                            <span role="img" aria-label="login">👤</span>
                        </NavLink>
                        <NavLink to="/ShopCart" style={styles.iconLink}>
                            <span role="img" aria-label="carrito">🛒</span>
                            <span style={styles.counter}>2</span>
                        </NavLink>
                    </div>
                </div>
            </header>
        );
    }
}

const styles = {
    header: {
        width: '100%',
        backgroundColor: '#fff',
        borderBottom: '3px solid #f1c1d1',
        padding: '10px 0',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
    },
    logo: {
        width: '40px',
        marginRight: '10px',
    },
    brand: {
        fontSize: '24px',
        color: '#d66',
    },
    rightMenu: {
        display: 'flex',
        alignItems: 'center',
    },
    iconLink: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '15px',
        textDecoration: 'none',
        color: '#333',
        fontSize: '18px',
    },
    counter: {
        backgroundColor: '#ffc107',
        borderRadius: '50%',
        padding: '2px 8px',
        marginLeft: '5px',
        fontSize: '12px',
    },
};

export default Header;
