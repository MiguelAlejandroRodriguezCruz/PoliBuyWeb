import React, { Component } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import imagen_sin from '../assets/images/imagen_sin.jpg';

class Ofertas extends Component {
    state = {
        offers: [],
        loading: true // Para manejar el estado de carga
    };

    componentDidMount() {
        this.fetchOffers();
    }

    fetchOffers = async () => {
        try {
            const response = await fetch('http://localhost:3001/productsOffers');
            const data = await response.json();
            this.setState({ offers: data, loading: false });
        } catch (error) {
            console.error('Error fetching offers:', error);
            this.setState({ offers: [], loading: false });
        }
    };

    render() {
        const { offers, loading } = this.state;

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
    }
}

export default Ofertas;
