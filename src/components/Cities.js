import React from "react";

const axios = require("axios").default;
const CITIES_BY_COUNTRY_PATH = "api/cities";
const SERVER_CITIES_BY_COUNTRY = process.env.REACT_APP_SERVER_URL + CITIES_BY_COUNTRY_PATH;

export default class Cities extends React.Component {
    constructor(props) {
        super(props);

        this.allCities = [];
        this.visitedCities = new Set([{name: "anapa"}, {name: "anapa2"}]);
        this.state = {
            currentCities: [],
            currentVisitedCities: [],
            searchText: ""
        };
    }

    citiesByCountry = async iso => {
        let cities = [];
        await axios.post(SERVER_CITIES_BY_COUNTRY, {
            iso: iso
        }).then(result => {
            cities = result.data;
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        return cities;
    };

    filterCurrentCitiesByPrefix = prefix => {
        let nextCurrentCities = [];
        let nextCurrentVisitedCities;
        const filterBySearch = city => city.name.toLowerCase().startsWith(prefix.toLowerCase());

        if (prefix !== "") {
            nextCurrentCities = this.allCities.filter(filterBySearch);
        }
        nextCurrentVisitedCities = Array.from(this.visitedCities).filter(filterBySearch);

        this.setState({
            currentCities: nextCurrentCities,
            currentVisitedCities: nextCurrentVisitedCities
        });
    };

    handleSearchbarChange = event => {
        const nextSearchText = event.target.value;

        this.setState({
            searchText: nextSearchText
        });
        this.filterCurrentCitiesByPrefix(nextSearchText);
    };

    componentDidMount() {
        const iso = this.props.target.properties._data.iso3166;
        this.citiesByCountry(iso).then(cities => {
            this.allCities = cities;
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
        this.filterCurrentCitiesByPrefix("");
    }

    render() {
        return (
            <div className="Map">
                <input
                    type="text"
                    placeholder="Search by city"
                    value={this.state.searchText}
                    onChange={this.handleSearchbarChange}
                />
                <br/>
                {this.state.currentVisitedCities.length ? "Visited\n" : ""}
                {this.state.currentVisitedCities.map((item, index) =>
                    (<li key={index}>{item.name}</li>)
                )}
                {this.state.currentCities.length ? "Unvisited\n" : ""}
                {this.state.currentCities.map((item, index) =>
                    (<li key={index}>{item.name}</li>)
                )}
            </div>
        );
    }
}
