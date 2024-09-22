import React, { Component } from 'react';
import Slider from './Slider';
import axios from 'axios';

class Shopcart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [], // Estado para almacenar los productos
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId'); // Supongo que el userId está almacenado en localStorage

    // Llamada a la API para obtener los productos en el carrito del usuario
    axios.get(`http://localhost:3001/viewCart/${userId}`)
      .then((response) => {
        // Actualiza el estado con los productos obtenidos
        this.setState({ productos: response.data });
      })
      .catch((error) => {
        console.error('Error al obtener el carrito:', error);
      });
  }

  handleQuantityChange = (index, newQuantity) => {
    this.setState((prevState) => {
      const updatedProductos = [...prevState.productos];
      updatedProductos[index].selectedCantidad = newQuantity;
      return { productos: updatedProductos };
    });
  };

  handleRemoveFromCart = (productoId) => {
    const userId = localStorage.getItem('userId');

    axios.delete('http://localhost:3001/deleteShopCart', {
      data: { usuario: userId, producto: productoId }
    })
      .then((response) => {
        console.log(response.data.message);

        // Eliminar el producto del carrito en el frontend
        this.setState((prevState) => ({
          productos: prevState.productos.filter((producto) => producto.ID !== productoId)
        }));
      })
      .catch((error) => {
        console.error('Error al eliminar el producto del carrito:', error);
      });
  };

  render() {
    const { productos } = this.state;

    return (
      <div id="Shopcart">
        <Slider />
        <div className="shopcart-container">
          <h2 className="shopcart-title">Carrito de compras</h2>
          <div className="shopcart-content">
            {/* Sección de productos en el carrito */}
            <div className="shopcart-items">
              <h3 className="shopcart-subheader">Tu pedido</h3>

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
                    {/* Desplegable con la cantidad basada en el valor de la base de datos, limitado a 10 */}
                    <select
                      className="item-quantity"
                      value={producto.selectedCantidad || 1}  // Valor inicial si no se ha seleccionado cantidad
                      onChange={(e) =>
                        this.handleQuantityChange(index, parseInt(e.target.value))
                      }
                    >
                      {producto.Cantidad > 0 &&
                        [...Array(Math.min(producto.Cantidad, 10)).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))
                      }
                    </select>
                    <p className="item-price">${producto.Precio}</p>
                    <button
                      className="remove-item"
                      onClick={() => this.handleRemoveFromCart(producto.ID)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sección de resumen del pedido */}
            <div className="shopcart-summary">
              <h3>Resumen</h3>
              <p>
                Artículos en carrito: $
                {productos.reduce(
                  (acc, producto) => acc + producto.Precio * (producto.selectedCantidad || 1),
                  0
                ).toFixed(2)}
              </p>
              <p>Descuentos aplicados: -$25.00</p>
              <hr />
              <h2>
                Total: $
                {(
                  productos.reduce(
                    (acc, producto) => acc + producto.Precio * (producto.selectedCantidad || 1),
                    0
                  ) - 25
                ).toFixed(2)}
              </h2>
              <button className="checkout-button">PROCEDER AL PAGO</button>
              <button className="discount-code">
                CÓDIGO DE DESCUENTO / TARJETA DE REGALO
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Shopcart;
