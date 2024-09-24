import React, { useState, useEffect } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import imagen_sin from '../assets/images/imagen_sin.jpg';
import Ropa_muestra from '../assets/images/Ropa_muestra.jpg';
import Electronica_muestra from '../assets/images/Electronica_muestra.jpg';
import Muebles_muestra from '../assets/images/Muebles_muestra.jpg';
import Juguetes_muestra from '../assets/images/Juguetes_muestra.jpg';

const Categories = ({ userRole, userId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(''); // Estado para tamaño
    const [selectedColor, setSelectedColor] = useState(''); // Estado para color
    const [selectedCategory, setSelectedCategory] = useState(''); // Estado para categoría
    const [sortOrder, setSortOrder] = useState(''); // Estado para ordenar
    const [showColorPalette, setShowColorPalette] = useState(false);
    const navigate = useNavigate();
    const [tipo, setUserTipo] = useState(localStorage.getItem('userRole') || userRole);
    const [id, setUserId] = useState(localStorage.getItem('userId') || userId);

    // Función para limpiar el nombre de archivo
    const sanitizeFileName = (fileName) => {
        return fileName ? fileName.replace(/\s+/g, '') : '';
    };

    useEffect(() => {
        fetchFilteredProducts();
    }, [selectedCategory, selectedSize, selectedColor, sortOrder]);

    const fetchFilteredProducts = async () => {
        try {
            let queryParams = new URLSearchParams();
            if (selectedCategory) queryParams.append('category', selectedCategory);
            if (selectedSize) queryParams.append('size', selectedSize);
            if (selectedColor) queryParams.append('color', selectedColor);
            if (sortOrder) queryParams.append('sortOrder', sortOrder);

            const response = await fetch(`http://localhost:3001/productsFilter?${queryParams.toString()}`);
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
            setLoading(false);
        }
    };

    const handleProductClick = (id) => {
        navigate(`/Product/${id}`);
    };

    const handleSizeChange = (event) => {
        setSelectedSize(event.target.value);
    };

    const handleColorClick = (color) => {
        setSelectedColor(color);
        setShowColorPalette(false); // Ocultar paleta después de seleccionar color
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    return (
        <div id="blog">
            <Slider title="Categorías" size="slider-small" />
            <div className="center">
                <div id="content">
                    <div className="categories-grid">
                        <div className="categories-item">
                            <img src={Ropa_muestra} alt="Ropa" />
                            <h3>Ropa</h3>
                            <button onClick={() => handleCategoryClick('Ropa')}>Ver</button>
                        </div>
                        <div className="categories-item">
                            <img src={Electronica_muestra} alt="Electronica" />
                            <h3>Electrónica</h3>
                            <button onClick={() => handleCategoryClick('Electronica')}>Ver</button>
                        </div>
                        <div className="categories-item">
                            <img src={Muebles_muestra} alt="Muebles" />
                            <h3>Muebles</h3>
                            <button onClick={() => handleCategoryClick('Muebles')}>Ver</button>
                        </div>
                        <div className="categories-item">
                            <img src={Juguetes_muestra} alt="Juguetes" />
                            <h3>Juguetes</h3>
                            <button onClick={() => handleCategoryClick('Juguetes')}>Ver</button>
                        </div>
                    </div>
                    <div className="filters-grid">
                        Filtros:
                        <button onClick={() => handleSortOrderChange('recien')}>Recién llegados</button>
                        <button onClick={() => handleSortOrderChange('ventas')}>Ventas</button>

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
                            style={{ backgroundColor: selectedColor || '#E7A8B1', color: 'white' }}
                        >
                            {selectedColor ? `Color: ${selectedColor}` : 'Color'}
                        </button>

                        {/* Paleta de colores */}
                        {showColorPalette && (
                            <div className="color-palette">
                                <button
                                    className="color-option"
                                    style={{ backgroundColor: 'red' }}
                                    onClick={() => handleColorClick('Rojo')}
                                ></button>
                                <button
                                    className="color-option"
                                    style={{ backgroundColor: 'blue' }}
                                    onClick={() => handleColorClick('Azul')}
                                ></button>
                                <button
                                    className="color-option"
                                    style={{ backgroundColor: 'green' }}
                                    onClick={() => handleColorClick('Verde')}
                                ></button>
                                <button
                                    className="color-option"
                                    style={{ backgroundColor: 'yellow' }}
                                    onClick={() => handleColorClick('Amarillo')}
                                ></button>
                                <button
                                    className="color-option"
                                    style={{ backgroundColor: 'black' }}
                                    onClick={() => handleColorClick('Negro')}
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
