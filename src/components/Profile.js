import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Profile.module.scss";
import formStyle from "../css/Form.module.scss";

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

    updateStatsListVisibility = () => {
        let status = document.getElementById("statsList").hidden //ya russkiy mne poebat
        document.getElementById("statsList").hidden = !status
        document.getElementById("visibilityButton").setAttribute("value", !status ? "Show extended stats" : "Hide extended stats")
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
                        value="Show extended stats"
                        onClick={() => this.updateStatsListVisibility()}
                    />
                </div>
                <div id="statsList" className={styles.statsList} hidden={true}>
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
