import React from "react";
import {Map, YMaps} from "react-yandex-maps";

export default class YandexMap extends React.Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.ymaps = React.createRef();
    }

    addGeoObjects() {
        this.ymaps.borders.load("001", {
            lang: "en",
            quality: 1
        }).then(result => {
            result.features.forEach(feature => {
                let geoObject = new this.ymaps.GeoObject(feature);
                if (this.props.visitedISO.indexOf(feature.properties.iso3166) >= 0) {
                    if (this.props.commonVisitedOptions != null) {
                        if (this.props.commonVisitedISO.indexOf(feature.properties.iso3166) >= 0) {
                            geoObject.options.set(this.props.commonVisitedOptions);
                        } else {
                            geoObject.options.set(this.props.visitedOptions);
                        }
                    } else {
                        geoObject.options.set(this.props.visitedOptions);
                    }
                } else {
                    geoObject.options.set(this.props.defaultOptions);
                }

                geoObject.events.add("mouseenter", this.props.enterCountry);
                geoObject.events.add("mouseleave", this.props.leaveCountry);
                geoObject.events.add("click", this.props.clickOnCountry);

                this.map.current.geoObjects.add(geoObject);
            });
        });
    }

    initMap = ymaps => {
        if (!ymaps || !this.map || !this.map.current) return;
        this.ymaps = ymaps;

        this.addGeoObjects();
    };

    render() {
        return (
            <div className="YandexMap">
                <YMaps
                    query={{
                        ns: "use-load-option",
                        load: "Map,control.ZoomControl,borders,GeoObject"
                    }}
                >
                    <Map
                        instanceRef={this.map}
                        onLoad={ymaps => this.initMap(ymaps)}
                        state={this.props.mapState}
                        style={this.props.mapStyle}
                    />
                </YMaps>
            </div>
        );
    }
}
