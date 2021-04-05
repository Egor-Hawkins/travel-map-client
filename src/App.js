//import styles from "./App.css";
import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./components/Home.js";
import Error from "./components/Error.js";
import CountryClick from "./components/CountryClick.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import Ping from "./components/Ping.js";
import Logout from "./components/Logout.js";
import VisitedCountries from "./components/VisitedCountries.js";

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Switch>
                        <Route path="/" component={Home} exact/>
                        <Route path="/map" component={CountryClick} exact/>
                        <Route path="/registration" component={Register}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/ping" component={Ping}/>
                        <Route path="/visited_countries" component={VisitedCountries}/>
                        <Route path="/logout" component={Logout}/>
                        <Route component={Error}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}
