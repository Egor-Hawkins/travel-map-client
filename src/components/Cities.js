import React from "react";

const axios = require("axios").default;
const CITIES_BY_COUNTRY_PATH = "api/cities";
const SERVER_CITIES_BY_COUNTRY = process.env.REACT_APP_SERVER_URL + CITIES_BY_COUNTRY_PATH;

export default class Cities extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cities: []
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


    componentDidMount() {
        const iso = this.props.target.properties._data.iso3166;
        this.citiesByCountry(iso).then(cities => {
            this.setState({
                cities: cities
            });
        }).catch(error => {
            console.log("Error occurred!");
            console.log(error);
        });
    }

    render() {
        return (
            <div className="Map">
                {this.state.cities.map((item, index) =>
                    (<li key={index}>{item.name}</li>)
                )}
            </div>
        );
    }
}
