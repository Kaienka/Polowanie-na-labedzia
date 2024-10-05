
// map creation
const defaultCoordinates = [54.526, 15.2551]
const defaultZoom = 5

var map = L.map("map").setView(defaultCoordinates, defaultZoom);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)


let characters = {}
let markers = []
let markersVisible = true

//let geoMap = []

let places = {} // todo
let otherPlacesVisible = false
let placeMarkers = []

let gilbPath = {}
let curvePath = []
let gilbPathVisible = true



var chMarkerIcon = L.AwesomeMarkers.icon({
    icon: 'home',
    markerColor: 'red',
    prefix: 'fa'
})

var placesIcon = L.AwesomeMarkers.icon({
    icon: 'star',
    markerColor: 'orange',
    prefix: 'fa'
})

// var markersOptions = {
//     riseOnHover: true,
//     riseOffset: 500,
//     icon: chMarkerIcon
// }



var pathOptions = {
    color: "#2856a1",
    fill: false,
    weight: 3,
    opacity: 0.7,
}

fetch("characters.json")
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
            createMarker(character)
            if (index > 0) {
                curvePath.push("L", character.coordinates)
            }
        })
        gilbPath = L.curve(curvePath, pathOptions).addTo(map)
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
    })


const style = (feature) => {
        return {color: feature.properties.fill}
}

const showInfo = ((feature, layer) => {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup('<strong>' + feature.properties.name + '</strong><br>' + feature.properties.desc)
    }
})

var mapStyle = {
    // color: "red",
    // weight: 3,
    // opacity: 0.45,
}

fetch("gotowe.geojson")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        L.geoJSON(data, { 
            style: style,
            onEachFeature: showInfo
         }).addTo(map)
    })


fetch("places.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        places = data.places
        places.forEach((place) => {
            createPlaceMarker(place)
        })
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error)
    })


const createMarkerDesc = (character) => {
    return `<h3><b>${character.pl}</b></h3><strong>Mieszka w: </strong>${character.location}<br>
            <strong>Zawód: </strong>${character.occupation}<br>
            <strong>Wizytacja: </strong>${character.day} jako ${character.order} w kolejce`
}

const createPlaceDesc = (place) => {
    return `<h3>${place.name}</h3>${place.desc}<br>`
}

window.switchCharsLocations = () => {
    markers.forEach((marker) => {
        markersVisible ? map.removeLayer(marker) : marker.addTo(map)
    })
    markersVisible = !markersVisible
}

window.switchGilbertsPath = () => {
    gilbPathVisible ? map.removeLayer(gilbPath) : gilbPath.addTo(map)
    gilbPathVisible = !gilbPathVisible
}

window.switchOtherPlaces = () => {
    placeMarkers.forEach((marker) => {
        otherPlacesVisible? map.removeLayer(marker) : marker.addTo(map)
    })
    otherPlacesVisible = !otherPlacesVisible
}

const createMarker = (character) => {
    const marker = L.marker(character.coordinates, {
        title: character.pl,
        riseOnHover: true,
        riseOffset: 500,
        icon: chMarkerIcon
    }).addTo(map)

    marker.bindPopup(createMarkerDesc(character))
    markers.push(marker)
}



const createPlaceMarker = (place) => {
    const marker = L.marker(place.coordinates, {
        title: place.name, 
        icon: placesIcon,
        riseOnHover: true,
        riseOffset: 500,
    }
    )
    marker.bindPopup(createPlaceDesc(place))
    placeMarkers.push(marker)
}

window.backToDefaultView = function () {
    map.setView(defaultCoordinates, defaultZoom)
}
