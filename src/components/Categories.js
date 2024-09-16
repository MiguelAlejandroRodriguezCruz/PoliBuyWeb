import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Categories = ({ userRole, userId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Obtén los valores de localStorage si existen, de lo contrario usa los props
    const [tipo, setUserTipo] = useState(localStorage.getItem('userRole') || userRole);
    const [id, setUserId] = useState(localStorage.getItem('userId') || userId);

    useEffect(() => {
        // Almacena userRole y userId en localStorage cada vez que cambien
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        }
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/products');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const sanitizeFileName = (fileName) => {
        return fileName ? fileName.replace(/\s+/g, '') : '';
    };

    const handleProductClick = (id) => {
        navigate(`/Product/${id}`);
    };

    return (
        <div id="blog">
            <Slider title="Categorias" size="slider-small" />
            <div className="center">
                <div id="content">
                    <div className="categories-grid">
                        <div className="categories-item">
                            <img src={imagen_sin} alt="Ropa" />
                            <h3>Ropa</h3>
                            <button>Ver</button>
                        </div>
                        <div className="categories-item">
                            <img src={imagen_sin} alt="Electronica" />
                            <h3>Electronica</h3>
                            <button>Ver</button>
                        </div>
                        <div className="categories-item">
                            <img src={imagen_sin} alt="Muebles" />
                            <h3>Muebles</h3>
                            <button>Ver</button>
                        </div>
                        <div className="categories-item">
                            <img src={imagen_sin} alt="Juguetes" />
                            <h3>Juguetes</h3>
                            <button>Ver</button>
                        </div>
                    </div>
                    <div className="filters-grid">
                        <button>Ordenar por</button>
                        <button>Recien llegados</button>
                        <button>Ventas</button>
                        <button>Color</button>
                        <button>Tamaño</button>
                    </div>
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : products.length === 0 ? (
                        <h1>No hay productos actualmente</h1>
                    ) : (
                        <div className="product-grid">
                            {products.map((product) => (
                                <div className="product-item" key={product.ID}>
                                    <img
                                        src={product.Imagen
                                            ? `http://localhost:3001/${sanitizeFileName(product.Imagen)}`
                                            : imagen_sin}
                                        alt={product.Nombre}
                                        onError={(e) => (e.target.src = imagen_sin)}
                                    />
                                    <h3>{product.Nombre}</h3>
                                    <p>${product.Precio}</p>
                                    <button onClick={() => handleProductClick(product.ID)}>Ver producto</button>
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

export default Categories;
