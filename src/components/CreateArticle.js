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

    state = {
        product: {},
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

    saveProduct = (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            axios.post('http://localhost:3001/createProduct', this.state.product)
                .then(res => {
                    if (res.status === 201) {
                        this.setState({ status: 'waiting' });
                        swal('Producto creado', 'El producto se ha creado correctamente', 'success');
                    } else {
                        this.setState({ status: 'failed' });
                    }
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

                        <input type='submit' value='Guardar' className='btn btn-success' />
                    </form>
                </section>
                <Sidebar />
            </div>
        );
    }
}

export default CreateArticle;
