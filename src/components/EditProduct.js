import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams(); // Obtenemos el id del producto desde la URL
    const navigate = useNavigate(); // Para redirigir después de la edición
    const [product, setProduct] = useState({
        Nombre: '',
        Precio: '',
        Descripcion: '',
        Cantidad: '',
        Oferta: false,
        Categoria: '',
        Color: '',
        Tamaño: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener los detalles del producto cuando el componente se monte
        axios.get(`http://localhost:3001/product/${id}`)
            .then(res => {
                setProduct(res.data[0]); // Prellenar los campos con la información del producto
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al obtener el producto:', err);
                setLoading(false);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct({
            ...product,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Enviar los datos al backend para actualizar el producto
            await axios.put(`http://localhost:3001/editProduct/${id}`, product);
            alert('Producto actualizado correctamente');
            navigate(`/product/${id}`); // Redirigir de nuevo a la página del producto
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Hubo un error al actualizar el producto');
        }
    };

    if (loading) {
        return <p>Cargando producto...</p>;
    }

    return (
        <div className="edit-product">
            <h1>Editar Producto</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="Nombre"
                        value={product.Nombre}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Precio:
                    <input
                        type="number"
                        name="Precio"
                        value={product.Precio}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Descripción:
                    <textarea
                        name="Descripcion"
                        value={product.Descripcion}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Cantidad:
                    <input
                        type="number"
                        name="Cantidad"
                        value={product.Cantidad}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Oferta:
                    <input
                        type="number"
                        name="Oferta"
                        value={product.Oferta}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Categoría:
                    <input
                        type="text"
                        name="Categoria"
                        value={product.Categoria}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Color:
                    <input
                        type="text"
                        name="Color"
                        value={product.Color}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Tamaño:
                    <input
                        type="text"
                        name="Tamaño"
                        value={product.Tamaño}
                        onChange={handleInputChange}
                    />
                </label>

                <button type="submit">Guardar cambios</button>
                <button type="button" onClick={() => navigate(`/product/${id}`)}>Cancelar</button>
            </form>
        </div>
    );
};

export default EditProduct;
