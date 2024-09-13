import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Llamada al endpoint para obtener los últimos 5 productos
        axios.get('http://localhost:3001/productsDashboard')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener productos:', err);
                setLoading(false);
            });
    }, []);

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
                    <button style={styles.button} onClick={() => handleNavigation("/Ofertas")}>
                        OFERTAS DE TIENDA
                    </button>
                    <button style={styles.button} onClick={() => handleNavigation("/Categories")}>
                        TODOS LOS PRODUCTOS
                    </button>
                </div>
            </div>

            <div className="center">
                <div id='content'>
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : products.length === 0 ? (
                        <p>No hay productos disponibles actualmente.</p>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <div className="product-item" key={product.ID}>
                                    {/*<img src={`path/to/images/${product.Imagen}`} alt={product.Nombre} />*/}
                                    <img src={imagen_sin} alt="img" />
                                    <h3>{product.Nombre}</h3>
                                    <p>${product.Precio}</p>
                                    <button>Ver producto</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Sidebar blog="true" />
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
    },
    productGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    productCard: {
        width: '30%',
        backgroundColor: '#f9f9f9',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    productImage: {
        width: '100%',
        height: 'auto',
    }
};

export default Home;
