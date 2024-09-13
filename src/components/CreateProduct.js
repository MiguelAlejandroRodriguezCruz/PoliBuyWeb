import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class CreateArticle extends Component {
    titleref = React.createRef();
    priceref = React.createRef();
    descriptionref = React.createRef();
    quantityref = React.createRef();
    categoryref = React.createRef();
    dateref = React.createRef();
    imageref = React.createRef();  // Referencia para el campo de imagen

    state = {
        product: {},
        selectedFile: null,  // Para manejar el archivo
        status: null,
    };

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Este campo es obligatorio.'
            }
        });
    }

    changeState = () => {
        this.setState({
            product: {
                Nombre: this.titleref.current.value,
                Precio: this.priceref.current.value,
                Descripcion: this.descriptionref.current.value,
                Cantidad: this.quantityref.current.value,
                Categoria: this.categoryref.current.value,
                Fecha: this.dateref.current.value
            }
        });
    }

    fileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    saveProduct = (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            // Crear un objeto FormData para enviar los datos
            const formData = new FormData();
            formData.append('Nombre', this.state.product.Nombre);
            formData.append('Precio', this.state.product.Precio);
            formData.append('Descripcion', this.state.product.Descripcion);
            formData.append('Cantidad', this.state.product.Cantidad);
            formData.append('Categoria', this.state.product.Categoria);
            formData.append('Fecha', this.state.product.Fecha);
            if (this.state.selectedFile) {
                formData.append('file', this.state.selectedFile);  // Agregar archivo al formData
            }

            // Enviar los datos con axios usando el formato multipart/form-data
            axios.post('http://localhost:3001/createProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    if (res.status === 201) {
                        this.setState({ status: 'success' });
                        swal('Producto creado', 'El producto se ha creado correctamente', 'success');
                    } else {
                        this.setState({ status: 'failed' });
                    }
                })
                .catch(err => {
                    console.error('Error al crear producto:', err);
                    this.setState({ status: 'failed' });
                });
        } else {
            this.setState({ status: 'failed' });
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        if (this.state.status === 'success') {
            return <Navigate to="/productos" />
        }

        return (
            <div className="center">
                <section id='content'>
                    <h1 className='subheader'>Crear Producto</h1>
                    <form className="mid-form" onSubmit={this.saveProduct}>
                        <div className='form-group'>
                            <label htmlFor='title'>Nombre del Producto</label>
                            <input type='text' name='title' ref={this.titleref} onChange={this.changeState} />
                            {this.validator.message('title', this.state.product.Nombre, 'required')}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='price'>Precio</label>
                            <input type='number' name='price' ref={this.priceref} onChange={this.changeState} />
                            {this.validator.message('price', this.state.product.Precio, 'required|numeric')}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='description'>Descripción</label>
                            <textarea name='description' ref={this.descriptionref} onChange={this.changeState}></textarea>
                            {this.validator.message('description', this.state.product.Descripcion, 'required')}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='quantity'>Cantidad</label>
                            <input type='number' name='quantity' ref={this.quantityref} onChange={this.changeState} />
                            {this.validator.message('quantity', this.state.product.Cantidad, 'required|numeric')}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='category'>Categoría</label>
                            <input type='text' name='category' ref={this.categoryref} onChange={this.changeState} />
                            {this.validator.message('category', this.state.product.Categoria, 'required')}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='date'>Fecha</label>
                            <input type='date' name='date' ref={this.dateref} onChange={this.changeState} />
                            {this.validator.message('date', this.state.product.Fecha, 'required')}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='file'>Imagen</label>
                            <input type="file" ref={this.imageref} onChange={this.fileChange} />
                        </div>

                        <input type='submit' value='Guardar' className='btn btn-success' />
                    </form>
                </section>
                <Sidebar />
            </div>
        );
    }
}

export default CreateArticle;
