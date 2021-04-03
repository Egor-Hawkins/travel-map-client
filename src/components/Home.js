import React from "react";
import {NavLink} from "react-router-dom";

export default class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <NavLink to="/">Home</NavLink><br/>
                <NavLink to="/map">Map</NavLink><br/>
                <NavLink to="/registration">Register</NavLink><br/>
                <NavLink to="/login">Login</NavLink><br/>
                <NavLink to="/ping">Ping</NavLink><br/>
                <NavLink to="/visited_countries">Visited Countries</NavLink><br/>
                <NavLink to="/logout">Logout</NavLink><br/>
            </div>
        );
    }
}
