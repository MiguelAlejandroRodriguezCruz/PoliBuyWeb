import React, { Component } from 'react';
import Slider from './Slider';
import axios from 'axios';

class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [], // Estado para almacenar los productos
      productosEnCarrito: [] // Estado para almacenar los productos que están en el carrito
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId'); // Supongo que el userId está almacenado en localStorage

    // Llamada a la API para obtener los productos que le gustan al usuario
    axios.get(`http://localhost:3001/viewLike/${userId}`)
      .then((response) => {
        const productos = response.data;
        this.setState({ productos });

        // Verificar si cada producto está en el carrito
        productos.forEach(producto => {
          this.checkProductInCart(userId, producto.ID);
        });
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
      });
  }

  checkProductInCart = (userId, productoId) => {
    // Llamada a la API para verificar si el producto está en el carrito
    axios.post('http://localhost:3001/checkCart', { usuario: userId, producto: productoId })
      .then((response) => {
        if (response.data.inCart) {
          this.setState((prevState) => ({
            productosEnCarrito: [...prevState.productosEnCarrito, productoId]
          }));
        }
      })
      .catch((error) => {
        console.error('Error al verificar el carrito:', error);
      });
  };

  handleAddOrRemoveFromCart = (productoId) => {
    const userId = localStorage.getItem('userId');
    const { productosEnCarrito } = this.state;

    if (productosEnCarrito.includes(productoId)) {
      // Si el producto está en el carrito, se quita
      axios.delete('http://localhost:3001/deleteShopCart', {
        data: { usuario: userId, producto: productoId }
      })
        .then(() => {
          alert('Producto eliminado del carrito');
          this.setState((prevState) => ({
            productosEnCarrito: prevState.productosEnCarrito.filter(id => id !== productoId)
          }));
        })
        .catch((error) => {
          console.error('Error al eliminar el producto del carrito:', error);
          alert('Hubo un error al eliminar el producto del carrito');
        });
    } else {
      // Si el producto no está en el carrito, se agrega
      axios.post('http://localhost:3001/shopCart', { usuario: userId, producto: productoId })
        .then(() => {
          alert('Producto agregado al carrito');
          this.setState((prevState) => ({
            productosEnCarrito: [...prevState.productosEnCarrito, productoId]
          }));
        })
        .catch((error) => {
          console.error('Error al agregar el producto al carrito:', error);
          alert('Hubo un error al agregar el producto al carrito');
        });
    }
  };

  handleRemoveFromLike = (productoId) => {
    const userId = localStorage.getItem('userId');

    axios.post('http://localhost:3001/deleteLike', { usuario: userId, producto: productoId })
      .then((response) => {
        console.log(response.data.message);

        // Eliminar el producto de "me gusta" en el frontend
        this.setState((prevState) => ({
          productos: prevState.productos.filter((producto) => producto.ID !== productoId)
        }));
      })
      .catch((error) => {
        console.error('Error al eliminar el producto de "me gusta":', error);
      });
  };

  render() {
    const { productos, productosEnCarrito } = this.state;

    return (
      <div id="Shopcart">
        <Slider />
        <div className="shopcart-container">
          <h2 className="shopcart-title">Artículos que me gustan</h2>
          <div className="shopcart-content">
            {/* Sección de productos */}
            <div className="shopcart-items">

              {/* Mapea los productos del estado para generar cada bloque */}
              {productos.map((producto, index) => (
                <div key={index} className="shopcart-item">
                  <div className="item-details">
                    <img
                      src={`http://localhost:3001/${producto.Imagen}`}
                      alt={producto.Nombre}
                      className="item-image"
                    />
                    <div className="item-info">
                      <p>{producto.Nombre}</p>
                      <p>Precio: ${producto.Precio}</p>
                      <p>Cantidad disponible: {producto.Cantidad}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <p className="item-price">${producto.Precio}</p>
                    <button
                      className="remove-item"
                      onClick={() => this.handleRemoveFromLike(producto.ID)}
                    >
                      🗑️
                    </button>
                    <div className="seller-actions">
                      <button
                        className="cart-item"
                        onClick={() => this.handleAddOrRemoveFromCart(producto.ID)}
                      >
                        {productosEnCarrito.includes(producto.ID) ? 'Quitar del carrito' : 'Agregar al carrito'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Like;
