import React, { Component } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import imagen_sin from '../assets/images/imagen_sin.jpg';

class Categories extends Component {
    state = {
        products: [],
        loading: true // Para manejar el estado de carga
    };

    componentDidMount() {
        this.fetchproducts();
    }

    fetchproducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/products');
            const data = await response.json();
            this.setState({ products: data, loading: false });
        } catch (error) {
            console.error('Error fetching products:', error);
            this.setState({ products: [], loading: false });
        }
    };

    sanitizeFileName = (fileName) => {
        // Elimina espacios u otros caracteres no deseados
        return fileName ? fileName.replace(/\s+/g, '') : '';
    };

    render() {
        const { products, loading } = this.state;

        return (
            <div id="blog">
                <Slider title="Categorias" size="slider-small" />
                <div className="center">
                    <div id="content">
                        <div className="categories-grid">

                            <div className="categories-item" >
                                {/*<img src={`path/to/images/${product.Imagen}`} alt={product.Nombre} />*/}
                                <img src={imagen_sin} alt="img" />
                                <h3>Ropa</h3>
                                <button>Ver</button>
                            </div>
                            <div className="categories-item" >
                                {/*<img src={`path/to/images/${product.Imagen}`} alt={product.Nombre} />*/}
                                <img src={imagen_sin} alt="img" />
                                <h3>Electronica</h3>
                                <button>Ver</button>
                            </div>
                            <div className="categories-item" >
                                {/*<img src={`path/to/images/${product.Imagen}`} alt={product.Nombre} />*/}
                                <img src={imagen_sin} alt="img" />
                                <h3>Muebles</h3>
                                <button>Ver</button>
                            </div>

                            <div className="categories-item" >
                                {/*<img src={`path/to/images/${product.Imagen}`} alt={product.Nombre} />*/}
                                <img src={imagen_sin} alt="img" />
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
                            <p>Cargando ofertas...</p>
                        ) : products.length === 0 ? (
                            <h1>No hay ofertas actualmente</h1>
                        ) : (
                            <div className="product-grid">
                                {products.map((product) => (
                                    <div className="product-item" key={product.ID}>
                                        {/* Sanitiza el nombre del archivo de imagen */}
                                        <img
                                            src={product.Imagen
                                                ? `http://localhost:3001/${this.sanitizeFileName(product.Imagen)}`
                                                : imagen_sin}
                                            alt={product.Nombre}
                                            onError={(e) => e.target.src = imagen_sin} // Si falla la carga, muestra imagen por defecto
                                        />
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
    }
}

export default Categories;
