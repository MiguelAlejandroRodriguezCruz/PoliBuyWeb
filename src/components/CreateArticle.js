import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class CreateArticle extends Component {

    url = Global.url;
    titleref = React.createRef();
    contentref = React.createRef();

    state = {
        article: {},
        status: null,
        selectedFile: null
    };

    componentWillMount() {
        this.validator = new SimpleReactValidator({
            messages:{
                required: 'Este campo es obligatorio.'
            }
        });
    }

    changeState = () => {
        this.setState({
            article: {
                title: this.titleref.current.value,
                content: this.contentref.current.value
            }
        });
    }

    saveArticle = (e) => {
        e.preventDefault();
        //Rellenar state con formulario
        this.changeState();
        if (this.validator.allValid()) {
            //Hacer una peticion http por POST para guardar el articulo
            axios.post(this.url + 'save', this.state.article)
                .then(res => {
                    if (res.data.article) {
                        //console.log(res.data.article._id)
                        this.setState({
                            article: res.data.article,
                            status: 'waiting'
                        });
                        swal(
                            'Articulo creado',
                            'El Articulo se creo correctamente',
                            'success'
                        );
                        // Subir archivo imagen
                        if (this.state.selectedFile !== null) {
                            //Sacar el id del articulo guardado
                            var articleID = res.data.article._id;
                            // Crear Form data y añadir ficheros
                            const formData = new FormData();
                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );
                            // Peticion ajax
                            axios.post(this.url + 'upload-image/' + articleID, formData)
                                .then(res => {
                                    if (res.data.article) {
                                        this.setState({
                                            article: res.data.article,
                                            status: 'success'
                                        });
                                    } else {
                                        this.setState({
                                            article: res.data.article,
                                            status: 'failed'
                                        });
                                    }
                                });
                        } else {
                            this.setState({
                                status: 'success'
                            });
                        }
                    } else {
                        this.setState({
                            status: 'failed'
                        });
                    }
                });
        } else {
            this.setState({
                status: 'failed'
            });
            this.validator.showMessages();
            this.forceUpdate();
            
        }

    }

    fileChange = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    render() {
        if (this.state.status === 'success') {
            return <Navigate to="/blog" />
        }
        return (
            <div className="center">
                <section id='content'>
                    <h1 className='subheader'>Crear Articulo</h1>
                    <form className="mid-form" onSubmit={this.saveArticle}>
                        <div className='form-group'>
                            <label htmlFor='title'>Titulo</label>
                            <input type='text' name='title' ref={this.titleref} onChange={this.changeState} />
                            {this.validator.message('title', this.state.article.title, 'required|alpha_num_space')}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='content'>Contenido</label>
                            <textarea name='content' ref={this.contentref} onChange={this.changeState}></textarea>
                            {this.validator.message('content', this.state.article.content, 'required')}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='file0'>Imagen</label>
                            <input type='file' name='file0' onChange={this.fileChange} />
                        </div>
                        <input type='submit' value='guardar' className='btn btn-success' />
                    </form>
                </section>
                <Sidebar />
            </div>
        );
    }
}
export default CreateArticle;