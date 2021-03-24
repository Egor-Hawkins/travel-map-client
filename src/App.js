//import styles from './App.css';
import React from 'react';
import YandexMap from './YandexMap.js';
import {enterCountry, leaveCountry, clickOnCountry, DEFAULT_OPTIONS, mapState, mapStyle} from './CountryClick.js';


export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <YandexMap
                    enterCountry={enterCountry}
                    leaveCountry={leaveCountry}
                    clickOnCountry={clickOnCountry}
                    defaultOptions={DEFAULT_OPTIONS}
                    mapState={mapState}
                    mapStyle={mapStyle}
                />
            </div>
        );
    }
}
