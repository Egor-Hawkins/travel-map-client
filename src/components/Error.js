import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";

export default class Error extends React.Component {
    render() {
        return (
            <div className="Error">
                <div id="bg"/>
                <p>Error: Page does not exist!</p>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
