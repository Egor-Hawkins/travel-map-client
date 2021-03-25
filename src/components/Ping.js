import React from "react";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;

export default class Ping extends React.Component {
    ping = () => {
        axios.get("http://localhost:8080/api/ping", {
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
            <div className="Ping">
                <button onClick={this.ping}>ping</button>
                <br/><br/>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
