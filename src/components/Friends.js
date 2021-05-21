import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Friends.module.scss";
import {getFriendsList} from "./Profile.js";

const axios = require("axios").default;
const API_PATH = "api/user";
const STATS_PATH = API_PATH + "/stats";
const FRIENDS_PATH = API_PATH + "/friends";
const FRIENDS_REQUEST_PATH = FRIENDS_PATH + "/request";
const FRIENDS_REQUEST_SEND_PATH = FRIENDS_REQUEST_PATH + "send";
const SERVER_STATS_URL = process.env.REACT_APP_SERVER_URL + STATS_PATH;
const SERVER_FRIENDS_LIST_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_PATH;

export default class Friends extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            waitForServer: true,
            loggedIn: false,
            friendsList: null,
            searchText: ""
        };
    }


    componentDidMount() {
        getFriendsList().then(friendsList => {
            this.setState({
                waitForServer: false,
                loggedIn: true,
                friends: friendsList
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
            <div className="Friends">
                <Sidebar/>
                <div className={styles.friends}>
                    Friends:
                    {this.state.friends.map((friend, index) =>
                        <li key={index}>
                            {friend}
                        </li>
                    )}
                </div>
            </div>
        );
    }
}
