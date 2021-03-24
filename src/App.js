//import styles from './App.css';
import React from 'react';
import YandexMap from './YandexMap.js';
import {enterCountry, leaveCountry, clickOnCountry, DEFAULT_OPTIONS, mapState, mapStyle} from './CountryClick.js';

const axios = require('axios').default;
const querystring = require('querystring');

export default class App extends React.Component {

    showResult = result => {
        console.log("Ok!");
        console.log(result);
    };

    showError = error => {
        console.log("Error occurred!");
        console.log(error);
    };

    registration = () => {
        axios.post('http://localhost:8080/registration', {
            email: 'example@gmail.com',
            username: 'username',
            password: 'password'
        }).then(result => {
            this.showResult(result);
        }).catch((error) => {
            this.showError(error);
        });
    };

    login = () => {
        axios.post('http://localhost:8080/login', querystring.stringify({
            username: 'username',
            password: 'password'
        }), {
            withCredentials: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            this.showResult(result);
        }).catch((error) => {
            this.showError(error);
        });
    };

    ping = () => {
        axios.get('http://localhost:8080/api/ping', {
            withCredentials: true
        }).then(result => {
            this.showResult(result);
        }).catch((error) => {
            this.showError(error);
        });
    };

    logout = () => {
        axios.get('http://localhost:8080/logout', {
            withCredentials: true
        }).then(result => {
            this.showResult(result);
        }).catch((error) => {
            this.showError(error);
        });
    };

    render() {
        return (
            <div className="App">
                <YandexMap
                    enterCountry={enterCountry}
                    leaveCountry={leaveCountry}
                    clickOnCountry={clickOnCountry}
                    defaultOptions={DEFAULT_OPTIONS}
                    mapState={mapState}
                    mapStyle={mapStyle}
                />
                <button onClick={this.registration}>register</button>
                <button onClick={this.login}>login</button>
                <button onClick={this.ping}>ping</button>
                <button onClick={this.logout}>logout</button>
                <button onClick={this.ping}>Try ping again</button>
            </div>
        );
    }
}
