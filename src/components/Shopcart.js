import React, { Component } from 'react';
import Slider from './Slider';


class Shopcart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [], // Estado para almacenar los productos
    };
  }

  componentDidMount() {
    // Simulación de una llamada a una API para obtener los productos
    const productosSimulados = [
      {
        id: 1,
        nombre: 'Producto 1',
        descripcion: 'Descripción breve del producto 1',
        envio: '2-5 días hábiles',
        precio: 70,
        cantidad: 1,
      },
      {
        id: 2,
        nombre: 'Producto 2',
        descripcion: 'Descripción breve del producto 2',
        envio: '5-7 días hábiles',
        precio: 54,
        cantidad: 2,
      },
    ];

    // Actualiza el estado con los productos traídos de la "base de datos"
    this.setState({ productos: productosSimulados });
  }

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
              {productos.map((producto) => (
                <div key={producto.id} className="shopcart-item">
                  <div className="item-details">
                    <img
                      src="product-image-url"
                      alt={producto.nombre}
                      className="item-image"
                    />
                    <div className="item-info">
                      <p>{producto.nombre}</p>
                      <p>{producto.descripcion}</p>
                      <p>Envío: {producto.envio}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <select
                      className="item-quantity"
                      value={producto.cantidad}
                      onChange={(e) =>
                        this.setState({
                          productos: productos.map((p) =>
                            p.id === producto.id
                              ? { ...p, cantidad: e.target.value }
                              : p
                          ),
                        })
                      }
                    >
                      {[...Array(10).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                    <p className="item-price">${producto.precio}</p>
                    <button
                      className="remove-item"
                      onClick={() =>
                        this.setState({
                          productos: productos.filter((p) => p.id !== producto.id),
                        })
                      }
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
                  (acc, producto) => acc + producto.precio * producto.cantidad,
                  0
                ).toFixed(2)}
              </p>
              <p>Descuentos aplicados: -$25.00</p>
              <hr />
              <h2>
                Total: $
                {(
                  productos.reduce(
                    (acc, producto) => acc + producto.precio * producto.cantidad,
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
