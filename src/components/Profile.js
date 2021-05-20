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
            loggedIn: false,
            showExtendedStats: false
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

    updateStatsListVisibility = () => {
        this.setState({
            showExtendedStats: !this.state.showExtendedStats
        });
    };

    render() {
        if (this.state.waitForServer) return <span>Loading profile...</span>;
        if (!this.state.loggedIn) return <Redirect to="/login"/>;

        return (
            <div className="Profile">
                <Sidebar/>
                <span className={styles.line}/>
                <div className={styles.name}>
                    {this.stats.username}
                </div>
                <div className={styles.statsHeader}>
                    User stats:
                </div>
                <div className={styles.mainStats}>
                    <div className={styles.box}>
                        Countries visited: {this.stats.countriesNumber}
                    </div>
                    <div className={styles.box}>
                        Cities visited: {this.stats.totalCitiesNumber}
                    </div>
                    <br/>
                </div>
                <div className={styles.visibilityButton}>
                    <input
                        className={styles.btn}
                        type="submit"
                        value={(this.state.showExtendedStats ? "Hide" : "Show") + " extended stats"}
                        onClick={this.updateStatsListVisibility}
                    />
                </div>
                <div
                    className={styles.statsList}
                    style={{
                        display: this.state.showExtendedStats ? "inline-block" : "none"
                    }}
                >
                    <div className={styles.statsListHeader}>
                        Visited cities stats:
                    </div>
                    {this.stats.citiesStats.map(country =>
                        <div className={styles.statsBox}>
                            {country.name + ": " + country.citiesNumber}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
