import React from "react";
import Sidebar from "./Sidebar.js";
import {Redirect} from "react-router";
import styles from "../css/Friends.module.scss";
import {getFriendsList} from "./Profile.js";
import {Button, Modal} from "react-bootstrap";
import FriendProfile from "./FriendProfile.js";

const axios = require("axios").default;
const FRIENDS_PATH = "api/user/friends";
const FRIENDS_REQUEST_PATH = FRIENDS_PATH + "/request";
const FRIENDS_REQUEST_SEND_PATH = FRIENDS_REQUEST_PATH + "/send";
const SERVER_FRIENDS_REQUEST_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_PATH;
const SERVER_FRIENDS_REQUEST_SEND_URL = process.env.REACT_APP_SERVER_URL + FRIENDS_REQUEST_SEND_PATH;

export default class Friends extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            waitForServer: true,
            loggedIn: false,
            friendsList: null,
            myFriendRequests: null,
            friendRequestsToMe: null,
            searchText: "",
            showModal: false,
            selectedFriend: null
        };
    }

    sendFriendRequest = async username => {
        let response = null;
        await axios.post(SERVER_FRIENDS_REQUEST_SEND_URL, {
            friendName: username
        }, {
            withCredentials: true
        }).then(result => {
            response = result;
        }).catch(error => {
            response = error.response;
        });
        return response;
    };

    getFriendRequests = async myRequests => {
        let requestsList = null;
        await axios.post(SERVER_FRIENDS_REQUEST_URL, {
            myRequests: myRequests
        }, {
            withCredentials: true
        }).then(result => {
            requestsList = result.data;
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return requestsList;
    };

    getMyFriendRequests = async () => {
        return this.getFriendRequests(true);
    };

    getFriendRequestsToMe = async () => {
        return this.getFriendRequests(false);
    };

    handleSearchbarChange = event => {
        const nextSearchText = event.target.value;

        this.setState({
            searchText: nextSearchText
        });
    };

    updateLists = () => {
        getFriendsList().then(friendsList => {
            this.getMyFriendRequests().then(myFriendRequests => {
                this.getFriendRequestsToMe().then(friendRequestsToMe => {
                    this.setState({
                        friends: friendsList,
                        myFriendRequests: myFriendRequests,
                        friendRequestsToMe: friendRequestsToMe
                    });
                });
            });
        });
    };


    addFriend = username => {
        if (username === "") {
            alert("Please enter friend username");
            return;
        }

        this.sendFriendRequest(username).then(result => {
            if (result && result.data) {
                const status = result.status;
                alert(result.data);
                // if (status === 404) {
                //     alert("No user with name " + username + " exists");
                // } else if (status === 400) {
                //     alert("Friend request to " + username + " already sent");
                // } else if (status === 200) {
                //     alert("Friend request to " + username + " sent");
                // }
            }
            this.updateLists();
        });
        this.setState({
            searchText: ""
        });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.addFriend(this.state.searchText);
        }
    };

    handleModalClose = () => this.setState({
        showModal: false
    });

    openModal = friendName => {
        this.setState({
            showModal: true,
            selectedFriend: friendName
        });
    };

    componentDidMount() {
        getFriendsList().then(friendsList => {
            this.getMyFriendRequests().then(myFriendRequests => {
                this.getFriendRequestsToMe().then(friendRequestsToMe => {
                    this.setState({
                        waitForServer: false,
                        loggedIn: true,
                        friends: friendsList,
                        myFriendRequests: myFriendRequests,
                        friendRequestsToMe: friendRequestsToMe
                    });
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
            <div className="Friends">
                <Sidebar/>
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.selectedFriend}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FriendProfile
                            friendName={this.state.selectedFriend}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className={styles.friends}>
                    <div className={styles.col}>
                        Friends:
                        <ul className={styles.friendList}>
                            {this.state.friends.length === 0 ? "No friends yet" : this.state.friends.map((friend, index) =>
                                <li key={index}>
                                <span style={{cursor: "pointer"}} onClick={() => this.openModal(friend)}>
                                    {friend}
                                </span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={styles.col}>
                        Add friend:
                        <input
                            className={styles.searchBar}
                            type="text"
                            placeholder="Search by username"
                            value={this.state.searchText}
                            onChange={this.handleSearchbarChange}
                            onKeyDown={this.handleKeyDown}
                        />
                        <button
                            className={styles.addFriendBtn}
                            onClick={() => this.addFriend(this.state.searchText)}
                        >
                            Add friend
                        </button>
                    </div>
                    <div className={styles.col}>
                        My Requests:
                        <ul className={styles.friendList}>
                            {this.state.myFriendRequests.length === 0 ? "No requests yet" : this.state.myFriendRequests.map((friend, index) =>
                                <li key={index}>
                                    {friend}
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={styles.col}>
                        Requests to me:
                        <ul className={styles.friendList}>
                            {this.state.friendRequestsToMe.length === 0 ? "No requests yet" : this.state.friendRequestsToMe.map((friend, index) =>
                                <li key={index}>
                                    {friend}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
