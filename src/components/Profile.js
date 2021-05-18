import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Profile.module.scss";

const axios = require("axios").default;
const STATS_PATH = "api/user/stats";
const SERVER_STATS_URL = process.env.REACT_APP_SERVER_URL + STATS_PATH;

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.stats = {
            username: "",
            countriesNumber: "",
            totalCitiesNumber: "",
            citiesStats: []
        };
        this.state = {
            waitForServer: true,
            loggedIn: false
        };
    }

    getStats = async () => {
        let stats = null;
        await axios.get(SERVER_STATS_URL, {
            withCredentials: true
        }).then(result => {
            stats = result.data;
        });
        return stats;
    };

    componentDidMount() {
        this.getStats().then(stats => {
            this.stats = stats;
            console.log(stats.citiesStats);
            this.setState({
                waitForServer: false,
                loggedIn: true
            });
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                this.setState({
                    waitForServer: false,
                    loggedIn: false
                });
            } else {
                console.log("Error occurred!");
                console.log(error);
            }
        });
    }

    render() {
        if (this.state.waitForServer) return <span>Loading profile...</span>;
        if (!this.state.loggedIn) return <Redirect to="/login"/>;

        return (
            <div className="Profile">
                <Sidebar/>

                <div className={styles.profile}>
                    Username: {this.stats.username}
                    <br/>
                    Number of visited countries: {this.stats.countriesNumber}
                    <br/>
                    Number of visited cities: {this.stats.totalCitiesNumber}
                    <br/>
                    {this.stats.citiesStats.map((country, index) =>
                        <li key={index}>
                            {country.iso + " " + country.citiesNumber}
                        </li>
                    )}
                </div>
            </div>
        );
    }
}
