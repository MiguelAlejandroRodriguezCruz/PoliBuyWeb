import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [liked, setLiked] = useState(false); // Estado para el botón de "me gusta"

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
    }, [id]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleAddToCart = () => {
        // Lógica para agregar al carrito
        alert('Producto agregado al carrito');
    };

    const handleLike = () => {
        // Cambia el estado de "me gusta"
        setLiked(!liked);
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
                <button onClick={handleAddToCart}>Agregar al carrito</button>
                <button className="like-button" onClick={handleLike}>
                    {liked ? '❤️' : '🤍'} {/* Cambia el icono del corazón según si le gusta o no */}
                </button>
            </div>

            <div className="comment-section">
                <h2>Deja tu comentario</h2>
                <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Escribe tu comentario aquí"
                ></textarea>
                <label>
                    Calificación (0 a 5 estrellas):
                    <select value={rating} onChange={handleRatingChange}>
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
