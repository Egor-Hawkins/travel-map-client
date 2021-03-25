import React from "react";
import {NavLink} from "react-router-dom";

export default class Error extends React.Component {
    render() {
        return (
            <div className="Error">
                <p>Error: Page does not exist!</p>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
