import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Profile.module.scss";

const axios = require("axios").default;
const STATS_PATH = "api/user/stats";
const SERVER_STATS_URL = process.env.REACT_APP_SERVER_URL + STATS_PATH;

export default class Profile extends React.Component {
    buttonState = {
        SHOW: "Show extended stats",
        HIDE: "Hide extended stats"
    };

    constructor(props) {
        super(props);

        this.stats = {
            username: "",
            countriesNumber: "",
            totalCitiesNumber: "",
            citiesStats: [],
        };
        this.state = {
            waitForServer: true,
            loggedIn: false,
            extendedStatsState: this.buttonState.SHOW
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

    updateStatsListVisibility = () => {
        this.setState({
            extendedStatsState: (this.state.extendedStatsState === this.buttonState.SHOW) ? this.buttonState.HIDE : this.buttonState.SHOW
        });
    }

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
                        id="visibilityButton"
                        className={styles.btn}
                        type="submit"
                        value={this.state.extendedStatsState}
                        onClick={() => this.updateStatsListVisibility()}
                    />
                </div>
                <div id="statsList" className={styles.statsList}
                     style={{
                         display: (this.state.extendedStatsState === this.buttonState.SHOW) ? "none" : "inline-block"
                     }}
                >
                    <div className={styles.statsListHeader}>
                        Visited cities stats:
                    </div>
                    {this.stats.citiesStats.map((country) =>
                        <div className={styles.statsBox}>
                            {country.name + ": " + country.citiesNumber}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
