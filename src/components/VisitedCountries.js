import React from "react";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;

const SERVER_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_VISITED_COUNTRIES_URL;

export default class VisitedCountries extends React.Component {
    defaultFormState = {
        iso: ""
    };

    constructor(props) {
        super(props);
        this.state = this.defaultFormState;
    }

    getVisitedCountries = () => {
        axios.get(SERVER_VISITED_COUNTRIES_URL, {
            withCredentials: true
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            for (const country of result.data) {
                console.log(country.name);
            }
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    visit = () => {
        axios.put(SERVER_VISITED_COUNTRIES_URL, {
            iso: this.state.iso
        }, {
            withCredentials: true
        }).then(result => {
            console.log("Ok!");
            console.log(result);
            alert(this.state.iso + " visited!");
            this.setState({iso: ""});
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    handleChange = id => (event) => {
        const next = event.target.value;
        let newState = {};
        newState[id] = next;
        this.setState(newState);
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.visit();
        }
    };

    render() {
        return (
            <div className="VisitedCountries">
                <button onClick={this.getVisitedCountries}>Get countries</button>
                <br/>
                <input
                    type="text"
                    placeholder="Insert country iso"
                    value={this.state.iso}
                    onChange={this.handleChange("iso")}
                    onKeyDown={this.handleKeyDown}
                /><br/>
                <button onClick={this.visit}>Visit country</button>
                <br/><br/>
                <NavLink to="/">Home</NavLink><br/>
            </div>
        );
    }
}
