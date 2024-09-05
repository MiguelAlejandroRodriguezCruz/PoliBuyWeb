import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import Sidebar from './Sidebar';
import imagen from '../assets/images/imagen_sin.jpg';
import Moment from 'react-moment';
import 'moment/locale/es';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Article() {
    const { id } = useParams();
    const [article, setArticle] = useState({});
    const [status, setStatus] = useState(null);
    const [articleDeleted, setArticleDeleted] = useState(false);

    const url = Global.url;

    useEffect(() => {
        const getArticle = () => {
            axios.get(url + 'article/' + id)
                .then(res => {
                    if (res.data.article) {
                        setArticle(res.data.article);
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                });
        };

        if (!articleDeleted) {
            getArticle();
        }
    }, [articleDeleted, id]); // Ejecutar el efecto solo cuando articleDeleted o id cambie

    const deleteArticle = (id) => {

        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Estás seguro de eliminar el artículo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(url + 'article/' + id)
                    .then(res => {
                        setArticleDeleted(true); // Indicar que se ha eliminado un artículo
                        setStatus('deleted');
                        Swal.fire(
                            'Artículo Eliminado',
                            'El artículo se eliminó correctamente',
                            'success'
                        );
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al eliminar el artículo',
                            'error'
                        );
                    });
            } else {
                Swal.fire(
                    'Acción Cancelada',
                    'La eliminación del artículo ha sido cancelada',
                    'info'
                );
            }
        });
        
    }

    if (status === 'deleted') {
        return <Navigate to="/blog" />;
    }

    return (
        <div className="center">
            <section id="content">
                {article.title !== undefined &&
                    <article className="article-item article-detail" id="article-template">
                        <div className="image-wrap">
                            {article.image !== null ?
                                (<img src={url + 'get-image/' + article.image} alt={article.title} />) :
                                (<img src={imagen} alt={article.title} />)
                            }
                        </div>
                        <h1 className="subheader">{article.title}</h1>
                        <span className="date">
                            <Moment locale='es' fromNow>{article.date}</Moment>
                        </span>
                        <p>
                            {article.content}
                        </p>
                        <button onClick={() => deleteArticle(article._id)} className='btn btn-danger'>Eliminar</button>
                        <Link to={"/blog/editar/"+article._id} className='btn btn-warning'>Editar</Link>
                        <div className="clearfix"></div>
                    </article>
                }
                {article.title === undefined &&
                    <div id='article'>
                        <h2 className='subheader'>El artículo no existe</h2>
                        <p>Inténtalo de nuevo más tarde</p>
                    </div>
                }
            </section>
            <Sidebar />
        </div>
    );
};

export default Article;
