"use client"
import React, { FC, useLayoutEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import axios from 'axios';
import {Feature, GeoJSON} from "geojson";

interface MainStageProps {}
interface NasaData {
    geolocation: {latitude: string, longitude: string };
    nametype: any;
    mass: number;
    year: any;
    name: string;
    recclass: string;
}
interface AmChartsGeoFeature {
    type: "Feature";
    properties: {
        name: string;
        [key: string]: any; // Add other properties as needed
    };
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
}

interface AmChartsGeoCollection {
    type: "FeatureCollection";
    features: AmChartsGeoFeature[];
}


const MainStage: FC<MainStageProps> = () => {
    const [geoCities, setGeoCities]: any = useState([]);
    const startGeoCities: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: "FeatureCollection",
        features: []
    };

    async function fetchNasaData() {

        // Specify the API URL
        const apiUrl = 'https://data.nasa.gov/resource/gh4g-9sfh.json';

        try {
            const response = await axios.get<NasaData[]>(apiUrl, {maxContentLength: Infinity,
                maxBodyLength: Infinity});
            const nasaData = response.data;
            return nasaData
        } catch (error) {
            // Handle errors
            console.error('Error:', error);
        }
    }

    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
        let chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "rotateX",
                panY: "none",
                projection: am5map.geoMercator(),
            })
        );

        let cont = chart.children.push(
            am5.Container.new(root, {
                layout: root.horizontalLayout,
                x: 20,
                y: 40
            })
        );

// Add labels and controls
        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Map"
            })
        );

        let switchButton = cont.children.push(
            am5.Button.new(root, {
                themeTags: ["switch"],
                centerY: am5.p50,
                icon: am5.Circle.new(root, {
                    themeTags: ["icon"]
                })
            })
        );

        switchButton.on("active", function () {
            if (!switchButton.get("active")) {
                chart.set("projection", am5map.geoMercator());
                chart.set("panY", "translateY");
                chart.set("rotationY", 0);

                backgroundSeries.mapPolygons.template.set("fillOpacity", 0);
            } else {
                chart.set("projection", am5map.geoOrthographic());
                chart.set("panY", "rotateY");
                backgroundSeries.mapPolygons.template.set("fillOpacity", 0.1);
            }
        });

        cont.children.push(
            am5.Label.new(root, {
                centerY: am5.p50,
                text: "Globe"
            })
        );

// Create series for background fill
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        let backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
        backgroundSeries.mapPolygons.template.setAll({
            fill: root.interfaceColors.get("alternativeBackground"),
            fillOpacity: 0,
            strokeOpacity: 0
        });

// Add background polygon
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
        backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
        let polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                fill: am5.color(0x22ff55),
            })
        );

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
        let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
        lineSeries.mapLines.template.setAll({
            stroke: root.interfaceColors.get("alternativeBackground"),
            strokeOpacity: 0.3
        });

// Create point series for markers
// https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/
        let pointSeries: am5map.MapPointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        pointSeries.bullets.push(function () {
            let circle = am5.Circle.new(root, {
                radius: 4,
                tooltipY: 0,
                fill: am5.color(0xffba00),
                stroke: root.interfaceColors.get("background"),
                strokeWidth: 2,
                tooltipText: "{title}"
            });

            return am5.Bullet.new(root, {
                sprite: circle
            });
        });


        fetchNasaData().then((data) => {

            console.log(data?.length);
            if (data) {
                for (var i = 0; i < data.length; i++) {

                    let city = data[i];
                    let date = new Date(city.year);
                    /* Date format you have */
                    let dateMDY = `${date.getFullYear()}`;
                    addCity(city.geolocation?.longitude, city.geolocation?.latitude, `City: ${city.name} \nMass: ${city.mass} \nYear: ${dateMDY} \nReclass: ${city.recclass} \nNameType: ${city.nametype}`);
                }

                // @ts-ignore
                function addCity(longitude: string, latitude: string, title: string) {
                    pointSeries.data.push({

                        geometry: {type: "Point", coordinates: [longitude, latitude]},
                        title: title
                    });
                }
            }
// Make stuff animate on load
            chart.appear(1000, 100);
        });



        return () => {
            root.dispose();
        };
    }, [])

    return (
        <header className="bgimg-1 w3-display-container w3-grayscale-min" id="home">
            <h1>Meteor Landings in History</h1>
            <h4>Note Mobile experience is not supported currently</h4>

            <div className="w3-display-center w3-text-white" style={{padding: "48px"}}>
                <div id="chartdiv" style={{width: "1000px", height: "1000px"}}></div>
            </div>
        </header>
    );
}

export default MainStage;
