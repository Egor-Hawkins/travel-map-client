//import styles from './App.css';
import React from 'react';
import {YMaps, Map} from 'react-yandex-maps';

const mapState = {
    center: [0, 0],
    zoom: 3,
    controls: ['zoomControl'],
    type: 'yandex#hybrid',
}

const mapStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
}

export default class App extends React.Component {
    map = React.createRef();

    initMap = ymaps => {
        let mapRef = this.map
        if (!mapRef || !mapRef.current) return;

        const SELECT_OPTIONS = {
            type: 'SELECT',
            fillColor: '#fb6c3f',
            fillOpacity: 0.8
        }

        const HIGHLIGHT_OPTIONS = {
            type: 'HIGHLIGHT',
            fillColor: '#f5ab94',
            fillOpacity: 0.6
        }

        const DEFAULT_OPTIONS = {
            type: 'DEFAULT',
            fillColor: '#ffffff',
            fillOpacity: 0.0
        }

        ymaps.borders
            .load("001", {
                lang: "ru",
                quality: 1
            })
            .then(function (result) {
                result.features.forEach(feature => {
                    let geoObject = new ymaps.GeoObject(feature)
                    geoObject.options.set(DEFAULT_OPTIONS);

                    geoObject.events.add('mouseenter', function (event) {
                        const target = event.get('target');
                        if (target.options.get("type") !== 'SELECT') {
                            target.options.set(HIGHLIGHT_OPTIONS);
                        }
                    });

                    geoObject.events.add('mouseleave', function (event) {
                        const target = event.get('target');
                        if (target.options.get("type") !== 'SELECT') {
                            target.options.set(DEFAULT_OPTIONS);
                        }
                    });

                    geoObject.events.add('click', function (event) {
                        const target = event.get('target');
                        if (target.options.get("type") === 'SELECT') {
                            target.options.set(DEFAULT_OPTIONS);
                        } else {
                            target.options.set(SELECT_OPTIONS);
                        }
                    });

                    mapRef.current.geoObjects.add(geoObject);
                });
            });
    };

    render() {
        return (
            <div className="App">
                <YMaps
                    query={{
                        ns: 'use-load-option',
                        load: 'Map,control.ZoomControl,borders,GeoObject',
                    }}
                >
                    <Map
                        instanceRef={this.map}
                        onLoad={ymaps => this.initMap(ymaps)}
                        state={mapState}
                        style={mapStyle}
                    >
                    </Map>
                </YMaps>
            </div>
        );
    }
}
