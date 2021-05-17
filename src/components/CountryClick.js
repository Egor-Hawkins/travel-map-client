import React from "react";
import YandexMap from "./YandexMap.js";
import Cities from "./Cities.js";
import {Redirect} from "react-router";
import {Modal, Button} from "react-bootstrap";
import Sidebar from "./Sidebar.js";
import styles from "../css/CountryClick.module.scss";

const axios = require("axios").default;
const VISITED_COUNTRIES_PATH = "api/user/visited_countries";
const SERVER_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_COUNTRIES_PATH;

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
        this.targetCountry = null;
        this.state = {
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

    targetIso = target => {
        return target ? target.properties._data.iso3166 : "";
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

    visitServer = iso => {
        axios.put(SERVER_VISITED_COUNTRIES_URL, {
            iso: iso
        }, {
            withCredentials: true
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    unvisitServer = iso => {
        axios.delete(SERVER_VISITED_COUNTRIES_URL, {
            data: {
                iso: iso
            },
            withCredentials: true
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
        });
    };

    visitTargetCountry = target => {
        const iso = this.targetIso(target);

        if (this.targetVisited(target)) {
            this.unvisitServer(iso);
            target.options.set(DEFAULT_OPTIONS);
        } else {
            this.visitServer(iso);
            target.options.set(VISITED_OPTIONS);
        }

        this.setState(prevState => ({
            targetCountryVisited: !prevState.targetCountryVisited
        }));
    };

    clickOnCountry = event => {
        this.targetCountry = event.get("target");
        this.setState({
            showModal: true,
            targetCountryName: this.targetName(this.targetCountry),
            targetCountryVisited: this.targetVisited(this.targetCountry)
        });
    };

    async getVisitedCountries() {
        let visitedCountries = null;
        await axios.get(SERVER_VISITED_COUNTRIES_URL, {
            withCredentials: true
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
            for (const country of visitedCountries) {
                this.visitedISO.push(country.iso);
            }
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
                        <button
                            className={styles.visitBtn}
                            onClick={() => this.visitTargetCountry(this.targetCountry)}
                        >
                            {this.state.targetCountryVisited ? "Unvisit" : "Visit"}
                        </button>
                        {this.state.targetCountryVisited ? <Cities target={this.targetCountry}/> : null}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <YandexMap
                    enterCountry={this.enterCountry}
                    leaveCountry={this.leaveCountry}
                    clickOnCountry={this.clickOnCountry}
                    visitedISO={this.visitedISO}
                    defaultOptions={DEFAULT_OPTIONS}
                    visitedOptions={VISITED_OPTIONS}
                    mapState={mapState}
                    mapStyle={mapStyle}
                />
            </div>
        );
    }
}
