import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imagen_sin from '../assets/images/imagen_sin.jpg';

const Product = ({ userId, userRole }) => {
    const [idUser, setUserId] = useState(localStorage.getItem('userId') || userId);
    const [tipo, setUserTipo] = useState(localStorage.getItem('userRole') || userRole);
    const { id } = useParams(); // 'id' es el ID del producto
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [liked, setLiked] = useState(false);
    const [inCart, setInCart] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/product/${id}`)
            .then(res => {
                setProduct(res.data[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener producto:', err);
                setLoading(false);
            });

        axios.post('http://localhost:3001/checkCart', { usuario: idUser, producto: id })
            .then(res => {
                setInCart(res.data.inCart);
            })
            .catch(err => console.error('Error al verificar carrito:', err));

        axios.post('http://localhost:3001/checkLike', { usuario: idUser, producto: id })
            .then(res => {
                setLiked(res.data.liked);
            })
            .catch(err => console.error('Error al verificar me gusta:', err));

    }, [id, idUser]);

    const handleEditProduct = () => {
        navigate(`/editProduct/${id}`);
    };

    const handleDeleteProduct = async () => {
        try {
            const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
            if (!confirmDelete) return;

            await axios.delete('http://localhost:3001/deleteProduct', {
                data: { producto: id }
            });
            alert('Producto eliminado correctamente');

            navigate('/Home');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Hubo un error al eliminar el producto');
        }
    };

    const handleAddToCart = async () => {
        try {
            if (inCart) {
                await axios.delete('http://localhost:3001/deleteShopCart', {
                    data: { usuario: idUser, producto: id }
                });
                alert('Producto eliminado del carrito');
            } else {
                await axios.post('http://localhost:3001/shopCart', {
                    usuario: idUser,
                    producto: id
                });
                alert('Producto agregado al carrito');
            }
            setInCart(!inCart);
        } catch (error) {
            console.error('Error al manejar el carrito:', error);
            alert('Hubo un error con el carrito');
        }
    };

    const handleLike = async () => {
        try {
            if (liked) {
                await axios.post('http://localhost:3001/deleteLike', {
                    usuario: idUser,
                    producto: id
                });
                alert('Producto eliminado de "me gusta"');
            } else {
                await axios.post('http://localhost:3001/like', {
                    usuario: idUser,
                    producto: id
                });
                alert('Producto marcado como "me gusta"');
            }
            setLiked(!liked);
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
            <div className="product-container">
                <div className="product-image">
                    <img
                        src={product.Imagen ? `http://localhost:3001/${product.Imagen.replace(/\s+/g, '')}` : imagen_sin}
                        alt={product.Nombre}
                        onError={(e) => e.target.src = imagen_sin}
                    />
                </div>
                <div className="product-info">
                    <h1>{product.Nombre}</h1>
                    <p><strong>Precio:</strong> ${product.Precio}</p>
                    <p><strong>Descripción:</strong> {product.Descripcion}</p>
                    <p><strong>Cantidad disponible:</strong> {product.Cantidad}</p>
                    <p><strong>Oferta:</strong> {product.Oferta}</p>
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
                            {liked ? '❤️' : '🤍'}
                        </button>

                        {tipo === 'Vendedor' && (
                            <div className="seller-actions">
                                <button className="edit-button" onClick={handleEditProduct}>
                                    Editar producto
                                </button>
                                <button className="delete-button" onClick={handleDeleteProduct}>
                                    Eliminar producto
                                </button>
                            </div>
                        )}
                    </div>
                </div>
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

