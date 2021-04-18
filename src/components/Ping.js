import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import formStyle from "../css/Form.module.css";

const axios = require("axios").default;
const SERVER_PING_URL = process.env.REACT_APP_SERVER_PING_URL;

export default class Ping extends React.Component {
    ping = () => {
        axios.get(SERVER_PING_URL, {
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
                <div id="bg"/>
                <div className={formStyle.homeIcon}>
                    <NavLink className={formStyle.link} to="/">
                        <i className="fa fa-home" aria-hidden="true"/>
                    </NavLink>
                </div>
                <div className={formStyle.form}>
                    <button className={formStyle.btn} onClick={this.ping}>
                        ping
                    </button>
                </div>
                <br/><br/>
            </div>
        );
    }
}
