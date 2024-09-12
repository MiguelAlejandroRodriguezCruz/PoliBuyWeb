import React, { Component } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';

class Home extends Component {

    render() {
        return (
            <div id='home'>
                <Slider
                    title="Bienvenido a PoliBuy"
                    size="slider-big"
                />
                <div className="center" style={styles.center}>
                    <p style={styles.welcomeText}>
                        Encuentra tus productos favoritos en nuestra aplicación.
                    </p>
                    <div style={styles.buttonContainer}>
                        <button style={styles.button}>OFERTAS DE TIENDA</button>
                        <button style={styles.button}>TODOS LOS PRODUCTOS</button>
                    </div>
                </div>
                <div className="center">
                    <div id='content'>
                    </div>
                    <Sidebar />
                </div>
            </div>
        );
    }
}

const styles = {
    center: {
        textAlign: 'center',
        margin: '20px 0',
    },
    welcomeText: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#fff',
        border: '2px solid #d66',
        color: '#333',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
    }
};

export default Home;
