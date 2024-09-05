import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import Sidebar from './Sidebar';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import imagen from '../assets/images/imagen_sin.jpg';

// Recoger id del articulo a editar de la URL
// Crear un metodo para sacar ese objeto del backend
// Repoblar/Rellenar el formulario con esos datos
// Actualizar el objeto haciendo una peticion al backend
function EditArticle() {
    const { id } = useParams();
    const url = Global.url;
    const [article, setArticle] = useState({});
    const [status, setStatus] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const titleref = useRef(null);
    const contentref = useRef(null);
    const validator = useRef(new SimpleReactValidator({
        messages: {
            required: 'Este campo es obligatorio.'
        }
    }));



    const getArticle = () => {
        axios.get(url + 'article/' + id)
            .then(res => {
                if (res.data.article) {
                    setArticle(res.data.article);
                    setStatus('find');
                } else {
                    setStatus('error');
                }
            });
    }



    useEffect(() => {
        getArticle(id)
        validator.current = new SimpleReactValidator({
            messages: {
                required: 'Este campo es obligatorio.'
            }
        });
    }, []);

    const changeState = () => {
        setArticle({
            title: titleref.current.value,
            content: contentref.current.value,
            image: article.image
        });
    }

    const saveArticle = (e) => {
        e.preventDefault();
        changeState();
        if (validator.current.allValid()) {
            axios.put(url + 'article/'+ id, article)
                .then(res => {
                    if (res.data.article) {
                        setArticle(res.data.article);
                        setStatus('waiting');
                        swal(
                            'Articulo Editado',
                            'El Articulo se edito correctamente',
                            'success'
                        );
                        if (selectedFile !== null) {
                            var articleID = res.data.article._id;
                            const formData = new FormData();
                            formData.append('file0', selectedFile, selectedFile.name);
                            axios.post(url + 'upload-image/' + articleID, formData)
                                .then(res => {
                                    if (res.data.article) {
                                        setArticle(res.data.article);
                                        setStatus('success');
                                    } else {
                                        setStatus('failed');
                                    }
                                });
                        } else {
                            setStatus('success');
                        }
                    } else {
                        setStatus('failed');
                    }
                });
        } else {
            setStatus('failed');
            validator.current.showMessages();
        }
    }

    const fileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    console.log(article.title)

    if (status === 'success') {
        return <Navigate to="/blog" />
    }

    return (

        <div className="center">

            <section id='content'>
                <h1 className='subheader'>Editar Articulo</h1>
                {article.title &&
                    <form className="mid-form" onSubmit={saveArticle}>
                        <div className='form-group'>
                            <label htmlFor='title'>Titulo</label>
                            <input type='text' name='title' defaultValue={article.title} ref={titleref} onChange={changeState} />
                            {validator.current.message('title', article.title, 'required|alpha_num_space')}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='content'>Contenido</label>
                            <textarea name='content' defaultValue={article.content} ref={contentref} onChange={changeState}></textarea>
                            {validator.current.message('content', article.content, 'required')}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='file0'>Imagen</label>
                            <input type='file' name='file0' onChange={fileChange} />

                            <div className="image-wrap">
                                {article.image !== null ?
                                    (<img src={url + 'get-image/' + article.image} alt={article.title} className='thumb'/>) :
                                    (<img src={imagen} alt={article.title} className='thumb'/>)
                                }
                            </div>
                        </div>
                        <div className='clearfix'></div>
                        <input type='submit' value='guardar' className='btn btn-success' />
                    </form>
                }
                {!article.title &&
                    <h1 className='subheader'>Cargando....</h1>
                }
            </section>
            <Sidebar />
        </div>
    );
}

export default EditArticle;
