import React from "react";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;

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

        axios.post("http://localhost:8080/registration", {
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
                /><br/>
                <button type="submit" id="submit" onClick={this.register}>Register</button>
                <br/><br/>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
