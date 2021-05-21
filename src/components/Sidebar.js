import React from "react";
import {slide as Menu} from "react-burger-menu";
import "../css/Sidebar.scss";
import {NavLink} from "react-router-dom";

export default class Sidebar extends React.Component {
    render() {
        return (
            <Menu width={"280px"} disableAutoFocus>
                <NavLink className="menu-item" to="/">Home</NavLink>
                <NavLink className="menu-item" to="/registration">Register</NavLink>
                <NavLink className="menu-item" to="/login">Login</NavLink>
                <NavLink className="menu-item" to="/ping">Ping</NavLink>
                <NavLink className="menu-item" to="/profile">Profile</NavLink>
                <NavLink className="menu-item" to="/friends">Friends</NavLink>
                <NavLink className="menu-item" to="/map">Map</NavLink>
                <NavLink className="menu-item" to="/logout">Logout</NavLink>
            </Menu>
        );
    }
}
