import React from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div id='home'>
            <Slider size="slider-big" />
            <div className="center" style={styles.center}>
                <p style={styles.welcomeText}>
                    Encuentra tus productos favoritos en nuestra aplicación.
                </p>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => handleNavigation("/ofertas")}>
                        OFERTAS DE TIENDA
                    </button>
                    <button style={styles.button} onClick={() => handleNavigation("/productos")}>
                        TODOS LOS PRODUCTOS
                    </button>
                </div>
            </div>
            <div className="center">
                <div id='content'></div>
                <Sidebar />
            </div>
        </div>
    );
};

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
