import { placesIcon, charIcon } from "./icons.js"


const createMarkerDesc = (character) => {
    return `<h3><b>${character.pl}</b></h3><strong>Mieszka w: </strong>${character.location}<br>
            <strong>Zawód: </strong>${character.occupation}<br>
            <strong>Wizytacja: </strong>${character.day} jako ${character.order} w kolejce`
}

const createPlaceDesc = (place) => {
    return `<h3>${place.name}</h3>${place.desc}<br>`
}

const createPlaceMarker = (place, placeMarkers) => {
    const marker = L.marker(place.coordinates, {
        title: place.name,
        icon: placesIcon,
        riseOnHover: true,
        riseOffset: 500,
    })
    marker.bindPopup(createPlaceDesc(place))
    placeMarkers.push(marker)
}

const createMarker = (character, markers, map) => {
    const marker = L.marker(character.coordinates, {
        title: character.pl,
        riseOnHover: true,
        riseOffset: 500,
        icon: charIcon,
    }).addTo(map)

    marker.bindPopup(createMarkerDesc(character))
    markers.push(marker)
}

const createCountryInfo = (properties, map) => {
    L.marker({ lat: properties.label_point[1],
        lng: properties.label_point[0] }, {
        icon: L.divIcon({
            className: 'polygon-label',
            html: `<span style="color: ${properties.fill};">${properties.name}</span>`,
            iconSize: [100, 40]
        })
    }).bindPopup(
        "<strong>" +
        properties.name +
        "</strong><br>" +
        properties.desc)
    .addTo(map)
}

export { createMarkerDesc, createPlaceDesc, createPlaceMarker, createMarker, createCountryInfo }