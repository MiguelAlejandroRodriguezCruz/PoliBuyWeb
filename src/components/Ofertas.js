import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from './Slider';
import Sidebar from './Sidebar';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Ofertas = ({ userRole, userId }) => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [tipo, setUserTipo] = useState(localStorage.getItem('userRole') || userRole);
    const [id, setUserId] = useState(localStorage.getItem('userId') || userId);

    useEffect(() => {
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        }
        if (userId) {
            localStorage.setItem('userId', userId);
        }

        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const response = await fetch('http://localhost:3001/productsOffers');
            const data = await response.json();
            setOffers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching offers:', error);
            setOffers([]);
            setLoading(false);
        }
    };

    const sanitizeFileName = (fileName) => {
        return fileName ? fileName.replace(/\s+/g, '') : '';
    };

    const handleViewProduct = (id) => {
        navigate(`/Product/${id}`);
    };

    const isValidNumber = (value) => {
        // Verifica si el valor es un número válido
        return !isNaN(value) && value !== null && value !== undefined;
    };

    return (
        <div id="blog">
            <Slider title="Ofertas" size="slider-small" />
            <div className="center">
                <div id="content">
                    {loading ? (
                        <p>Cargando ofertas...</p>
                    ) : offers.length === 0 ? (
                        <h1>No hay ofertas actualmente</h1>
                    ) : (
                        <div className="product-grid">
                            {offers.map((product) => {
                                const precio = parseFloat(product.Precio);
                                const descuento = parseFloat(product.Oferta);

                                // Validar si precio y descuento son números válidos antes de hacer el cálculo
                                const precioConDescuento = isValidNumber(precio) && isValidNumber(descuento)
                                    ? (precio - (precio * (descuento / 100))).toFixed(2)
                                    : precio.toFixed(2); // Si no hay descuento válido, se muestra el precio original

                                return (
                                    <div className="product-item" key={product.ID}>
                                        <img
                                            src={product.Imagen
                                                ? `http://localhost:3001/${sanitizeFileName(product.Imagen)}`
                                                : imagen_sin}
                                            alt={product.Nombre}
                                            onError={(e) => (e.target.src = imagen_sin)}
                                        />
                                        <h3>{product.Nombre}</h3>
                                        <p>
                                            {/* Precio original tachado */}
                                            <span style={{ textDecoration: 'line-through', color: 'red' }}>
                                                ${precio.toFixed(2)}
                                            </span>{' '}
                                            {/* Precio con descuento */}
                                            <span style={{ fontWeight: 'bold', color: 'green' }}>
                                                ${precioConDescuento}
                                            </span>
                                        </p>
                                        <button onClick={() => handleViewProduct(product.ID)}>Ver producto</button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <Sidebar userType={tipo} />
            </div>
        </div>
    );
};

export default Ofertas;

