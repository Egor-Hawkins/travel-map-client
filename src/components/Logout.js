import React from "react";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;

export default class Logout extends React.Component {
    logout = () => {
        axios.get("http://localhost:8080/logout", {
            withCredentials: true
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            alert(result.data);
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    render() {
        return (
            <div className="Logout">
                <button onClick={this.logout}>logout</button>
                <br/><br/>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
