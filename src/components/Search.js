import React, { Component } from 'react';
import Slider from './Slider';
import Sidebar from './Sidebar';
import Articles from './Articles';
import { useParams } from "react-router-dom";

function Search() {



    var params = useParams();
    console.log(params.search);

    return (
        <div id='blog'>
            <Slider
                title={"Busqueda: " + params.search}
                size="slider-small"
            />
            <div className="center">
                <div id='content'>
                    {/**Listado de articulos del API */}
                    <Articles
                        search={params.search}
                    />
                </div>
                <Sidebar
                    blog="true"
                />
            </div>

        </div>

    );

}
export default Search;