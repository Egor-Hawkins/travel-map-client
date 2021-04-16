import React from "react";
import {NavLink} from "react-router-dom";
import "../css/Background.css";
import styles from "../css/Register.module.css";
import "../css/Form.css";

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
                <NavLink to="/">Logo?</NavLink><br/>
                <div className={styles.form}>
                    <input
                        type="text"
                        placeholder="Insert your email"
                        value={this.state.email}
                        onChange={this.handleChange("email")}
                        onKeyDown={this.handleKeyDown}
                    /><br/>
                    <input
                        type="text"
                        placeholder="Insert your username"
                        value={this.state.username}
                        onChange={this.handleChange("username")}
                        onKeyDown={this.handleKeyDown}
                    /><br/>
                    <input
                        type="password"
                        placeholder="Insert your password"
                        value={this.state.password}
                        onChange={this.handleChange("password")}
                        onKeyDown={this.handleKeyDown}
                    /><br/><br/>
                    <input
                        className="btn"
                        type="submit"
                        value="Register"
                        onClick={this.register}
                    />
                </div>
            </div>
        );
    }
}
