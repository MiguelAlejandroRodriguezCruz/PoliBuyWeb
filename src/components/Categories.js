import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Categories = ({ userRole, userId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(''); // Estado para almacenar la opción seleccionada
    const [showColorPalette, setShowColorPalette] = useState(false); // Estado para manejar la visibilidad de la paleta de colores
    const [selectedColor, setSelectedColor] = useState(''); // Estado para almacenar el color seleccionado
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

    const handleSizeChange = (event) => {
        const selectedOption = event.target.value;
        setSelectedSize(selectedOption);
        console.log("Tamaño seleccionado:", selectedOption);
    };

    const handleColorClick = (color) => {
        setSelectedColor(color); // Guardar el color seleccionado
        console.log("Color seleccionado:", color);
        setShowColorPalette(false); // Ocultar la paleta de colores después de seleccionar uno
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
                        Filtros:
                        <button>Recien llegados</button>
                        <button>Ventas</button>
                        {/* Lista desplegable de tamaño */}
                        <select value={selectedSize} onChange={handleSizeChange} className='size-select'>
                            <option value="" disabled>Tamaño</option>
                            <option value="chico">Chico</option>
                            <option value="mediano">Mediano</option>
                            <option value="grande">Grande</option>
                        </select>
                        <button 
                        onClick={() => setShowColorPalette(!showColorPalette)} 
                        className="color-button" 
                        style={{ backgroundColor: selectedColor || '#007BFF', color: 'white' }} // Cambia el color según la selección
                        >
                        {selectedColor ? `Color: ${selectedColor}` : 'Color'} {/* Texto del botón cambia con la selección */}
                        </button>

                        {/* Paleta de colores */}
                        {showColorPalette && (
                        <div className="color-palette">
                            <button 
                            className="color-option" 
                            style={{ backgroundColor: 'red' }} 
                            onClick={() => handleColorClick('red')}
                            ></button>
                            <button 
                            className="color-option" 
                            style={{ backgroundColor: 'blue' }} 
                            onClick={() => handleColorClick('blue')}
                            ></button>
                            <button 
                            className="color-option" 
                            style={{ backgroundColor: 'green' }} 
                            onClick={() => handleColorClick('green')}
                            ></button>
                            <button 
                            className="color-option" 
                            style={{ backgroundColor: 'yellow' }} 
                            onClick={() => handleColorClick('yellow')}
                            ></button>
                            <button 
                            className="color-option" 
                            style={{ backgroundColor: 'black' }} 
                            onClick={() => handleColorClick('black')}
                            ></button>
                        </div>
                        )}
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
