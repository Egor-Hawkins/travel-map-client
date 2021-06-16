import React from "react";
import styles from "../css/Cities.module.scss";

const axios = require("axios").default;
const VISITED_CITIES_PATH = "api/user/friends/cities";
const SERVER_VISITED_CITIES_URL = process.env.REACT_APP_SERVER_URL + VISITED_CITIES_PATH;
const SortedSet = require("collections/sorted-set");

export default class Cities extends React.Component {

    constructor(props) {
        super(props);

        this.allCities = null;
        this.visitedCities = null;
        this.selectedCity = null;
        this.iso = null;
        this.friendName = null;
        this.state = {
            waitForServer: true,
            currentCities: [],
            currentVisitedCities: [],
            searchText: "",
        };
    }

    getVisitedCities = async (iso, friendName) => {
        let visitedCities = [];
        console.log(friendName)
        console.log(iso)
        await axios.post(SERVER_VISITED_CITIES_URL, {
            friendName: friendName,
            iso: iso
        }, {
            withCredentials: true
        }).then(result => {
            console.log(result)
            console.log(result.data)
            for (let city of result.data) {
                visitedCities.push(city.name);
            }
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return visitedCities;
    };

    filterCityList = (cityList, prefix) => {
        let result = [];
        for (const city of cityList) {
            const name = city.toLowerCase();
            if (name.startsWith(prefix)) {
                result.push(city);
                if (name === prefix) {
                    this.selectedCity = city;
                }
            }
        }
        return result;
    };

    filterCurrentCitiesByPrefix = prefix => {
        prefix = prefix.toLowerCase();

        let nextCurrentCities = prefix === "" ? [] : this.filterCityList(this.allCities, prefix);
        nextCurrentCities = nextCurrentCities.filter(city => !this.visitedCities.has(city));
        let nextCurrentVisitedCities = this.filterCityList(this.visitedCities.slice(), prefix);

        this.setState({
            currentCities: nextCurrentCities,
            currentVisitedCities: nextCurrentVisitedCities
        });
    };


    componentDidMount() {
        this.iso = this.props.target.properties._data.iso3166;
        this.friendName = this.props.friendName

        this.getVisitedCities(this.iso, this.friendName).then(visitedCities => {
            console.log(visitedCities)
            this.visitedCities = SortedSet(visitedCities);
            this.filterCurrentCitiesByPrefix("");
            this.setState({
                waitForServer: false
            });
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    }

    render() {
        if (this.state.waitForServer) return <div className="Cities">Loading...</div>;

        return (
            <div className="Cities">
                {this.state.currentVisitedCities.length ? "Visited\n" : "No cities visited"}
                {this.state.currentVisitedCities.map((city, index) =>
                    <li key={index}>
                        <span style={{cursor: "pointer"}} onClick={() => this.selectCityName(city)}>
                            {city}
                        </span>
                    </li>
                )}
            </div>
        );
    }
}
