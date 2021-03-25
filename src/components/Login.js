import React from "react";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;
const querystring = require("querystring");

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

        const SERVER_LOGIN_URL = process.env.REACT_APP_SERVER_LOGIN_URL;
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
                /><br/>
                <button type="submit" id="submit" onClick={this.login}>Login</button>
                <br/><br/>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
