import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from './Slider';
import Sidebar from './Sidebar';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Ofertas = ({ userRole, userId }) => {
    const [offers, setOffers] = useState([]);
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
        // Elimina espacios y otros caracteres no deseados
        return fileName ? fileName.replace(/\s+/g, '') : '';
    };

    const handleViewProduct = (id) => {
        // Navega a la página del producto con la ID correspondiente
        navigate(`/Product/${id}`);
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
                            {offers.map((product) => (
                                <div className="product-item" key={product.ID}>
                                    {/* Sanitiza el nombre del archivo de imagen */}
                                    <img
                                        src={product.Imagen
                                            ? `http://localhost:3001/${sanitizeFileName(product.Imagen)}`
                                            : imagen_sin}
                                        alt={product.Nombre}
                                        onError={(e) => e.target.src = imagen_sin} // Si falla la carga, muestra imagen por defecto
                                    />
                                    <h3>{product.Nombre}</h3>
                                    <p>${product.Precio}</p>
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

export default Ofertas;
