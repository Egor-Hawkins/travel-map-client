import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Profile.module.scss";
import {NavLink} from "react-router-dom";

const axios = require("axios").default;
const API_PATH = "api/user";
const STATS_PATH = API_PATH + "/stats";
const FRIENDS_PATH = API_PATH + "/friends";
const FRIENDS_REQUEST_PATH = FRIENDS_PATH + "/request";
const FRIENDS_REQUEST_SEND_PATH = FRIENDS_REQUEST_PATH + "send";
const SERVER_STATS_URL = process.env.REACT_APP_SERVER_URL + STATS_PATH;
const SERVER_FRIENDS_LIST_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_PATH;

export async function getFriendsList() {
    let friends = null;
    await axios.get(SERVER_FRIENDS_LIST_URL, {
        withCredentials: true
    }).then(result => {
        friends = result.data;
    });
    return friends;
}

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            waitForServer: true,
            loggedIn: false,
            showExtendedStats: false,
            stats: null,
            friends: null,
            searchText: ""
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

    updateStatsListVisibility = () => {
        this.setState({
            showExtendedStats: !this.state.showExtendedStats
        });
    };

    handleSearchbarChange = event => {
        const nextSearchText = event.target.value;

        this.setState({
            searchText: nextSearchText
        });
    };

    addFriend = () => {

    };

    componentDidMount() {
        this.getStats().then(stats => {
            getFriendsList().then(friends => {
                this.setState({
                    waitForServer: false,
                    loggedIn: true,
                    stats: stats,
                    friends: friends
                });
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
                <span className={styles.line}/>
                <div className={styles.name}>
                    {this.state.stats.username}
                </div>
                <div className={styles.statsHeader}>
                    User stats:
                </div>
                <div className={styles.friends}>
                    Friends:
                    <br/>
                    <div className={styles.friendList}>
                        {this.state.friends.length === 0 ? "No friends yet" : this.state.friends.map((friend, index) =>
                            <li key={index}>
                                {friend}
                            </li>
                        )}
                    </div>
                </div>
                <NavLink className={styles.link} to="/friends">
                    <button className={styles.manageFriendList}>
                        Manage friend list
                    </button>
                </NavLink>
                <div className={styles.mainStats}>
                    <div className={styles.box}>
                        Countries visited: {this.state.stats.countriesNumber}
                    </div>
                    <div className={styles.box}>
                        Cities visited: {this.state.stats.totalCitiesNumber}
                    </div>
                    <br/>
                </div>
                <div className={styles.visibilityButton}>
                    <input
                        className={styles.statsBtn}
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
                    {this.state.stats.citiesStats.map(country =>
                        <div className={styles.statsBox}>
                            {country.name + ": " + country.citiesNumber}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
