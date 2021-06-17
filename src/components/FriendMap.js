import React from "react";
import YandexMap from "./YandexMap.js";
import Cities from "./FriendCities.js";
import {Redirect} from "react-router";
import {Button, Modal} from "react-bootstrap";
import Sidebar from "./Sidebar.js";
import styles from "../css/FriendMap.module.css";

const axios = require("axios").default;
const VISITED_COUNTRIES_PATH = "api/user/friends/countries";
const COMMON_VISITED_COUNTRIES_PATH = "api/user/friends/countries/common";
const SERVER_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_COUNTRIES_PATH;
const SERVER_COMMON_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + COMMON_VISITED_COUNTRIES_PATH;

const mapState = {
    center: [0, 0],
    zoom: 3,
    controls: ["zoomControl"],
    type: "yandex#map"
};

const mapStyle = {
    position: "absolute",
    width: "100%",
    height: "100%"
};

const DEFAULT_OPTIONS = {
    type: "DEFAULT",
    fillColor: "#ffffff",
    fillOpacity: 0.0,
    visited: false
};

const VISITED_OPTIONS = {
    type: "VISITED",
    fillColor: "#fb6c3f",
    fillOpacity: 0.8,
    visited: true
};

const COMMON_VISITED_OPTIONS = {
    type: "COMMON",
    fillColor: "#b65def",
    fillOpacity: 0.8,
    visited: true
};

const HIGHLIGHT_OPTIONS = {
    type: "HIGHLIGHT",
    fillColor: "#f5ab94",
    fillOpacity: 0.6,
    visited: false
};

export default class CountryClick extends React.Component {
    constructor(props) {
        super(props);

        this.visitedISO = [];
        this.commonVisitedISO = [];
        this.targetCountry = null;
        this.state = {
            friendName: new URL(window.location.href).searchParams.get("friendName"),
            waitForServer: true,
            loggedIn: false,
            showModal: false,
            targetCountryName: "",
            targetCountryVisited: false
        };
    }

    targetVisited = target => {
        return target ? target.options.get("visited") : false;
    };

    targetName = target => {
        return target ? target.properties._data.name : "";
    };

    enterCountry = event => {
        const target = event.get("target");
        if (!this.targetVisited(target)) {
            target.options.set(HIGHLIGHT_OPTIONS);
        }
    };

    leaveCountry = event => {
        const target = event.get("target");
        if (!this.targetVisited(target)) {
            target.options.set(DEFAULT_OPTIONS);
        }
    };

    clickOnCountry = event => {
        this.targetCountry = event.get("target");
        if (this.targetVisited(this.targetCountry)) {
            this.setState({
                showModal: true,
                targetCountryName: this.targetName(this.targetCountry),
                targetCountryVisited: this.targetVisited(this.targetCountry)
            });
        }
    };

    async getVisitedCountries() {
        let visitedCountries = null;
        await axios.post(SERVER_VISITED_COUNTRIES_URL, {
            friendName: this.state.friendName
        }, {
            withCredentials: true
        }).catch(() => {
            window.open("/friends", "_self");
        }).then(result => {
            visitedCountries = result.data;
        });
        return visitedCountries;
    };

    async getCommonVisitedCountries() {
        let visitedCountries = null;
        await axios.post(SERVER_COMMON_VISITED_COUNTRIES_URL, {
            friendName: this.state.friendName
        }, {
            withCredentials: true
        }).catch(() => {
            window.open("/friends", "_self");
        }).then(result => {
            visitedCountries = result.data;
        });
        return visitedCountries;
    };

    handleModalClose = () => this.setState({
        showModal: false
    });

    componentDidMount() {
        this.getVisitedCountries().then(visitedCountries => {
            this.getCommonVisitedCountries().then(commonVisitedCountries => {
                for (const country of visitedCountries) {
                    this.visitedISO.push(country.iso);
                }
                for (const country of commonVisitedCountries) {
                    this.commonVisitedISO.push(country.iso);
                }
                this.setState({
                    waitForServer: false,
                    loggedIn: true
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
        if (this.state.waitForServer) return <span>Loading map...</span>;
        if (!this.state.loggedIn) return <Redirect to="/login"/>;

        return (
            <div className="Map">
                <Sidebar/>
                <Modal show={this.state.showModal} onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.targetCountryName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.targetCountryVisited ? <Cities
                            target={this.targetCountry}
                            friendName={this.state.friendName}/> : null}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className={styles.legend}>
                    Common countries: <div className={styles.boxCommon}/>
                    Other: <div className={styles.boxOther}/>
                </div>
                <YandexMap
                    enterCountry={this.enterCountry}
                    leaveCountry={this.leaveCountry}
                    clickOnCountry={this.clickOnCountry}
                    visitedISO={this.visitedISO}
                    commonVisitedISO={this.commonVisitedISO}
                    defaultOptions={DEFAULT_OPTIONS}
                    visitedOptions={VISITED_OPTIONS}
                    commonVisitedOptions={COMMON_VISITED_OPTIONS}
                    mapState={mapState}
                    mapStyle={mapStyle}
                />
            </div>
        );
    }
}