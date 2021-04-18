import React from "react";
import YandexMap from "./YandexMap";

const axios = require("axios").default;
const SERVER_VISITED_COUNTRIES_URL = process.env.REACT_APP_SERVER_VISITED_COUNTRIES_URL;

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
    fillOpacity: 0.0
};

const SELECT_OPTIONS = {
    type: "SELECT",
    fillColor: "#fb6c3f",
    fillOpacity: 0.8
};

const HIGHLIGHT_OPTIONS = {
    type: "HIGHLIGHT",
    fillColor: "#f5ab94",
    fillOpacity: 0.6
};

export default class CountryClick extends React.Component {
    constructor(props) {
        super(props);

        this.visitedISO = [];
    }

    enterCountry = event => {
        const target = event.get("target");
        if (target.options.get("type") !== "SELECT") {
            target.options.set(HIGHLIGHT_OPTIONS);
        }
    };

    leaveCountry = event => {
        const target = event.get("target");
        if (target.options.get("type") !== "SELECT") {
            target.options.set(DEFAULT_OPTIONS);
        }
    };

    askToLogin = () => {
        alert("Login blin!");
    };

    visit = iso => {
        axios.put(SERVER_VISITED_COUNTRIES_URL, {
            iso: iso
        }, {
            withCredentials: true
        }).then(() => {
            alert(iso + " visited!");
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
            if (error.response.status === 404) {
                this.askToLogin();
            }
        });
    };

    unvisit = iso => {
        axios.delete(SERVER_VISITED_COUNTRIES_URL, {
            data: {
                iso: iso
            },
            withCredentials: true
        }).then(() => {
            alert(iso + " unvisited!");
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
            if (error.response.status === 404) {
                this.askToLogin();
            }
        });
    };

    async getVisitedCountries() {
        let visitedCountries = [];
        await axios.get(SERVER_VISITED_COUNTRIES_URL, {
            withCredentials: true
        }).then(result => {
            visitedCountries = result.data;
        }).catch((error) => {
            console.log("Error occurred!");
            console.log(error);
            if (error.response.status === 404) {
                this.askToLogin();
            }
        });
        return visitedCountries;
    };

    clickOnCountry = event => {
        const target = event.get("target");
        const iso = target.properties._data.iso3166;
        if (target.options.get("type") === "SELECT") {
            this.unvisit(iso);
            target.options.set(DEFAULT_OPTIONS);
        } else {
            this.visit(iso);
            target.options.set(SELECT_OPTIONS);
        }
    };

    async componentWillMount() {
        this.getVisitedCountries().then(visitedCountries => {
            for (const country of visitedCountries) {
                this.visitedISO.push(country.iso);
            }
        });
    }

    render() {
        return (
            <div className="Map">
                <YandexMap
                    enterCountry={this.enterCountry}
                    leaveCountry={this.leaveCountry}
                    clickOnCountry={this.clickOnCountry}
                    visitedISO={this.visitedISO}
                    defaultOptions={DEFAULT_OPTIONS}
                    selectOptions={SELECT_OPTIONS}
                    mapState={mapState}
                    mapStyle={mapStyle}
                />
            </div>
        );
    }
}
