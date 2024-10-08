import React, { Component, createRef } from 'react';
import { Link, Navigate } from 'react-router-dom';

class Sidebar extends Component {


    searchRef = React.createRef();
    state = {
        search: "",
        redirect: false
    };



    redirectToSearch = (e) => {
        e.preventDefault();
        console.log(this.searchRef.current.value)
        this.setState({
            search: this.searchRef.current.value,
            redirect: true
        });
    }

    render() {

        if (this.state.redirect && this.state.search != '') {
            return (

                <Navigate replace to={"/redirect/" + this.state.search} />
            );
        }

        return (

            <aside id="sidebar">

                {this.props.userType === "Vendedor" &&
                    <div id="nav-blog" className="sidebar-item">
                        <h3>Puedes hacer esto</h3>
                        <Link to='/CreateProduct' className="btn btn-success">crear articulo</Link>
                    </div>
                }

                <div id="nav-blog" className="sidebar-item">
                    <h3>Buscador</h3>
                    <p>Encuentra el artículo que buscas</p>
                    <form onSubmit={this.redirectToSearch}>
                        <input type="text" name="search" ref={this.searchRef} />
                        <input type="submit" name="submit" value="Buscar" className="btn" />
                    </form>
                </div>
            </aside>
        );
    }
}
export default Sidebar;