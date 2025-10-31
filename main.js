let characters = {}
let markers = []
let markersVisible = true
let places = {}
let otherPlacesVisible = false
let placeMarkers = []
let gilbPath = {}
let curvePath = []
let gilbPathVisible = true
let geoJson = {}

import { createdMap, addPanel, defaultCoordinates, defaultZoom } from "./map-creation.js"
import { pathOptions } from "./icons.js"
import { createPlaceMarker, createMarker, createCountryInfo } from "./markers.js"


const map = createdMap

map.on('zoomend', () => {
    geoJson.eachLayer(layer => {
        if (layer.feature) {
            showInfo(layer.feature)
        }
    });
});

const style = (feature) => {
    return { color: feature.properties.fill }
}

const showInfo = (feature) => {
    if (feature.properties) {
        createCountryInfo(feature, map)
    }
}

window.switchCharsLocations = () => {
    markersVisible = !markersVisible
    markers.forEach((marker) => {
        markersVisible ? marker.addTo(map) : map.removeLayer(marker)
    })
}

window.switchGilbertsPath = () => {
    gilbPathVisible = !gilbPathVisible
    gilbPathVisible ? gilbPath.addTo(map) : map.removeLayer(gilbPath)
}

window.switchOtherPlaces = () => {
    otherPlacesVisible = !otherPlacesVisible
    placeMarkers.forEach((marker) => {
        otherPlacesVisible ?  marker.addTo(map) : map.removeLayer(marker)
    })
}

window.backToDefaultView = function () {
    map.setView(defaultCoordinates, defaultZoom)
}

window.toggleMenu = function() {
    const header = document.getElementById('header')
    header.classList.toggle('menu-visible')
}


// Data loading
fetch("data/characters.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        characters = data.characters
        characters.sort((a, b) => a.order - b.order)
        curvePath.push("M", characters[0].coordinates)
        characters.forEach((character, index) => {
            createMarker(character, markers, map)
            if (index > 0) {
                curvePath.push("L", character.coordinates)
            }
        })
        gilbPath = L.curve(curvePath, pathOptions).addTo(map)
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
    })

fetch("data/map.geojson")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        geoJson = L.geoJSON(data, {
            style: style,
            onEachFeature: showInfo,
        }).addTo(map)
        addPanel(map)
    })

fetch("data/places.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        places = data.places
        places.forEach((place) => {
            createPlaceMarker(place, placeMarkers)
        })
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
    })