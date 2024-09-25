import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Home = ({ userRole, userId }) => {
    const navigate = useNavigate();

    // Obtén los valores de localStorage si existen, de lo contrario usa los props
    const [tipo, setUserTipo] = useState(localStorage.getItem('userRole') || userRole);
    const [id, setUserId] = useState(localStorage.getItem('userId') || userId);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Almacena userRole y userId en localStorage cada vez que cambien
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        }
        if (userId) {
            localStorage.setItem('userId', userId);
        }

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
    }, [userRole, userId]);

    const handleViewProduct = (id) => {
        // Navega a la página del producto con la ID correspondiente
        navigate(`/Product/${id}`);
    };

    const sanitizeFileName = (fileName) => {
        // Elimina espacios y otros caracteres no deseados
        return fileName ? fileName.replace(/\s+/g, '') : '';
    };

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
                        <div className="product-grid" style={styles.productGrid}>
                            {products.map((product) => (
                                <div className="product-item" key={product.ID} style={styles.productCard}>
                                    {/* Sanitiza el nombre del archivo de imagen */}
                                    <img
                                        src={product.Imagen
                                            ? `http://localhost:3001/${sanitizeFileName(product.Imagen)}`
                                            : imagen_sin}
                                        alt={product.Nombre}
                                        style={styles.productImage}
                                        onError={(e) => e.target.src = imagen_sin} // Si falla la carga de imagen, muestra la imagen por defecto
                                    />
                                    <h3>{product.Nombre}</h3>
                                    <p>
                                        {product.Oferta > 0 ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: 'red' }}>
                                                    ${product.Precio}
                                                </span>{' '}
                                                <span>
                                                    ${product.Precio - (product.Precio * product.Oferta / 100).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span>${product.Precio}</span>
                                        )}
                                    </p>
                                    <button onClick={() => handleViewProduct(product.ID)}>Ver producto</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Sidebar userType={tipo} />
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

