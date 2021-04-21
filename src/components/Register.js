import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import formStyle from "../css/Form.module.css";

const axios = require("axios").default;
const SERVER_REGISTRATION_URL = process.env.REACT_APP_SERVER_REGISTRATION_URL;

export default class Register extends React.Component {
    defaultFormState = {
        email: "",
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

    register = () => {
        for (const field in this.state) {
            if (this.state.hasOwnProperty(field)) {
                if (this.state[field] === "") {
                    alert("Please enter your " + field);
                    return;
                }
            }
        }

        axios.post(SERVER_REGISTRATION_URL, {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            if (result.data.indexOf("Email not valid") >= 0) {
                alert("Email not valid");
            } else {
                alert(result.data);
                this.setState(this.defaultFormState);
            }
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.register();
        }
    };

    render() {
        return (
            <div className="Register">
                <div id="bg"/>
                <div className={formStyle.homeIcon}>
                    <NavLink className={formStyle.link} to="/">
                        <i className="fa fa-home" aria-hidden="true"/>
                    </NavLink>
                </div>
                <div className={formStyle.form}>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={this.state.email}
                        onChange={this.handleChange("email")}
                        onKeyDown={this.handleKeyDown}
                    />
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
                        value="Register"
                        onClick={this.register}
                    />
                </div>
            </div>
        );
    }
}
