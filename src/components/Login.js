import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import formStyle from "../css/Form.module.css";
import "font-awesome/css/font-awesome.min.css";

const axios = require("axios").default;
const querystring = require("querystring");
const LOGIN_PATH = "login";
const SERVER_LOGIN_URL = process.env.REACT_APP_SERVER_URL + LOGIN_PATH;

export default class Login extends React.Component {
    defaultFormState = {
        username: "",
        password: ""
    };

    constructor(props) {
        super(props);
        this.state = this.defaultFormState;
    }

    handleChange = id => (event) => {
        const next = event.target.value;
        let newState = {};
        newState[id] = next;
        this.setState(newState);
    };

    login = () => {
        for (const field in this.state) {
            if (this.state.hasOwnProperty(field)) {
                if (this.state[field] === "") {
                    alert("Please enter your " + field);
                    return;
                }
            }
        }

        axios.post(SERVER_LOGIN_URL, querystring.stringify({
            username: this.state.username,
            password: this.state.password
        }), {
            withCredentials: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            alert(result.data);
            window.open("/map", "_self");
            this.setState(this.defaultFormState);
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
            if (error.response.status === 401) {
                alert("Username or password is incorrect!");
            }
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.login();
        }
    };

    render() {
        return (
            <div className="Login">
                <div id="bg"/>
                <div className={formStyle.homeIcon}>
                    <NavLink className={formStyle.link} to="/">
                        <i className="fa fa-home" aria-hidden="true"/>
                    </NavLink>
                </div>
                <div className={formStyle.form}>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={this.state.username}
                        onChange={this.handleChange("username")}
                        onKeyDown={this.handleKeyDown}
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={this.state.password}
                        onChange={this.handleChange("password")}
                        onKeyDown={this.handleKeyDown}
                    />
                    <input
                        className={formStyle.btn}
                        type="submit"
                        value="Login"
                        onClick={this.login}
                    />
                </div>
            </div>
        );
    }
}
