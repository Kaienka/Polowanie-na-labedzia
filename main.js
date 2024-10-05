const defaultCoordinates = [54.526, 15.2551]
const defaultZoom = 5

const map = L.map("map").setView(defaultCoordinates, defaultZoom)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)


L.controlCredits({
    imageurl: './icon.png',
    imagealt: 'icon for links',
    tooltip: 'Made by KaiShouri',
    width: '30px',
    height: '30px',
    position: 'bottomright',
    expandcontent: `<strong>Polowanie na łabędzia</strong><br>
    <a href="https://www.wattpad.com/story/197754386-aph-polowanie-na-%C5%82ab%C4%99dzia" target="_blank">Wattpad</a>
    <a href="https://archiveofourown.org/works/20355778/chapters/48268933" target="_blank">AO3</a>
    <a href="https://www.fanfiction.net/s/13370205/1/Polowanie-na-%C5%82ab%C4%99dzia" target="_blank">Fanfiction.net</a>`
}).addTo(map)


let characters = {}
let markers = []
let markersVisible = true

let places = {}
let otherPlacesVisible = false
let placeMarkers = []

let gilbPath = {}
let curvePath = []
let gilbPathVisible = true

const charIcon = L.AwesomeMarkers.icon({
    icon: "home",
    markerColor: "red",
    prefix: "fa",
})

const placesIcon = L.AwesomeMarkers.icon({
    icon: "star",
    markerColor: "orange",
    prefix: "fa",
})

const pathOptions = {
    color: "#2856a1",
    fill: false,
    weight: 3,
    opacity: 0.7,
}

const style = (feature) => {
    return { color: feature.properties.fill }
}

const showInfo = (feature, layer) => {
    if (feature.properties) {
    var textColor = feature.properties.fill
    L.marker({ lat: feature.properties.label_point[1],
        lng: feature.properties.label_point[0] }, {
        icon: L.divIcon({
            className: 'polygon-label',
            html: `<span style="color: ${textColor};">${feature.properties.name}</span>`,
            iconSize: [100, 40]
        })
    }).bindPopup(
        "<strong>" +
        feature.properties.name +
        "</strong><br>" +
        feature.properties.desc)
    .addTo(map)
    }
}

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

fetch("data/map.geojson")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        return response.json()
    })
    .then((data) => {
        L.geoJSON(data, {
            style: style,
            onEachFeature: showInfo,
        }).addTo(map)
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
    document.getElementById('houses').style.color = !markersVisible? 'gold' : 'black'
    markersVisible = !markersVisible
}

window.switchGilbertsPath = () => {
    gilbPathVisible ? map.removeLayer(gilbPath) : gilbPath.addTo(map)
    document.getElementById('route').style.color = !gilbPathVisible? 'gold' : 'black'
    gilbPathVisible = !gilbPathVisible
}

window.switchOtherPlaces = () => {
    placeMarkers.forEach((marker) => {
        otherPlacesVisible ? map.removeLayer(marker) : marker.addTo(map)
    })
    document.getElementById('places').style.color = !otherPlacesVisible ? 'gold' : 'black'
    otherPlacesVisible = !otherPlacesVisible
}

const createMarker = (character) => {
    const marker = L.marker(character.coordinates, {
        title: character.pl,
        riseOnHover: true,
        riseOffset: 500,
        icon: charIcon,
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
    })
    marker.bindPopup(createPlaceDesc(place))
    placeMarkers.push(marker)
}

window.backToDefaultView = function () {
    map.setView(defaultCoordinates, defaultZoom)
}

window.toggleMenu = function() {
    const header = document.getElementById('header')
    header.classList.toggle('menu-visible')
}
