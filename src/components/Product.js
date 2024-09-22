import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Product = ({ userId }) => {
    // Obtén los valores de localStorage si existen, de lo contrario usa los props
    const [idUser, setUserId] = useState(localStorage.getItem('userId') || userId);
    const { id } = useParams(); // 'id' es el ID del producto
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [liked, setLiked] = useState(false); // Estado para el botón de "me gusta"
    const [inCart, setInCart] = useState(false); // Estado para saber si el producto está en el carrito

    useEffect(() => {
        // Llamada al endpoint para obtener los detalles del producto
        axios.get(`http://localhost:3001/product/${id}`)
            .then(res => {
                setProduct(res.data[0]); // Asignamos el primer (y único) producto de la respuesta
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener producto:', err);
                setLoading(false);
            });

        // Verificar si el producto ya está en el carrito
        axios.post('http://localhost:3001/checkCart', { usuario: idUser, producto: id })
            .then(res => {
                setInCart(res.data.inCart); // Si ya está en el carrito, cambia el estado
            })
            .catch(err => console.error('Error al verificar carrito:', err));

        // Verificar si el producto ya tiene "me gusta"
        axios.post('http://localhost:3001/checkLike', { usuario: idUser, producto: id })
            .then(res => {
                setLiked(res.data.liked); // Si ya tiene "me gusta", cambia el estado
            })
            .catch(err => console.error('Error al verificar me gusta:', err));

    }, [id, idUser]);

    const handleAddToCart = async () => {
        try {
            if (inCart) {
                // Si ya está en el carrito, eliminarlo
                const response = await axios.post('http://localhost:3001/deleteShopCart', {
                    usuario: idUser,   // ID del usuario
                    producto: id       // ID del producto
                });
                alert('Producto eliminado del carrito');
            } else {
                // Si no está en el carrito, agregarlo
                const response = await axios.post('http://localhost:3001/shopCart', {
                    usuario: idUser,   // ID del usuario
                    producto: id       // ID del producto
                });
                alert('Producto agregado al carrito');
            }
            setInCart(!inCart); // Cambiar el estado del carrito
        } catch (error) {
            console.error('Error al manejar el carrito:', error);
            alert('Hubo un error con el carrito');
        }
    };

    const handleLike = async () => {
        try {
            if (liked) {
                // Si ya está en "me gusta", eliminarlo
                const response = await axios.post('http://localhost:3001/deleteLike', {
                    usuario: idUser,   // ID del usuario
                    producto: id       // ID del producto
                });
                alert('Producto eliminado de "me gusta"');
            } else {
                // Si no está en "me gusta", agregarlo
                const response = await axios.post('http://localhost:3001/like', {
                    usuario: idUser,   // ID del usuario
                    producto: id       // ID del producto
                });
                alert('Producto marcado como "me gusta"');
            }
            setLiked(!liked); // Cambiar el estado de "me gusta"
        } catch (error) {
            console.error('Error al manejar "me gusta":', error);
            alert('Hubo un error con "me gusta"');
        }
    };

    if (loading) {
        return <p>Cargando producto...</p>;
    }

    if (!product) {
        return <p>No se encontró el producto.</p>;
    }

    return (
        <div className="product-detail">
            <h1>{product.Nombre}</h1>
            <img
                src={product.Imagen ? `http://localhost:3001/${product.Imagen.replace(/\s+/g, '')}` : imagen_sin}
                alt={product.Nombre}
                onError={(e) => e.target.src = imagen_sin}
            />
            <p><strong>Precio:</strong> ${product.Precio}</p>
            <p><strong>Descripción:</strong> {product.Descripcion}</p>
            <p><strong>Cantidad disponible:</strong> {product.Cantidad}</p>
            <p><strong>Oferta:</strong> {product.Oferta ? 'Sí' : 'No'}</p>
            <p><strong>Categoría:</strong> {product.Categoria}</p>
            <p><strong>Fecha de lanzamiento:</strong> {new Date(product.Fecha).toLocaleDateString()}</p>
            <p><strong>Ventas:</strong> {product.Ventas}</p>
            <p><strong>Color:</strong> {product.Color}</p>
            <p><strong>Tamaño:</strong> {product.Tamaño}</p>
            <p><strong>Calificación:</strong> {product.Estrellas} estrellas</p>

            <div className="product-actions">
                <button onClick={handleAddToCart}>
                    {inCart ? 'Quitar del carrito' : 'Agregar al carrito'}
                </button>
                <button className="like-button" onClick={handleLike}>
                    {liked ? '❤️' : '🤍'} {/* Cambia el icono del corazón según si le gusta o no */}
                </button>
            </div>

            <div className="comment-section">
                <h2>Deja tu comentario</h2>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Escribe tu comentario aquí"
                ></textarea>
                <label>
                    Calificación (0 a 5 estrellas):
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <button>Enviar comentario</button>
            </div>
        </div>
    );
};

export default Product;
