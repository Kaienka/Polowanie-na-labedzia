import { placesIcon, charIcon } from "./icons.js"

let labels = []

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

const createCountryInfo = (feature, map) => {
    const area = turf.area(feature) / 1000000

    let baseFontSize

    if (area > 2000000) {
        baseFontSize = 2
    } else if (area > 100000) {
        baseFontSize = 1.2
    } else {
        baseFontSize = 0.8
    }

    const zoom = map.getZoom()
    const adjustedFontSize = baseFontSize * (zoom / feature.properties.minZoom) + 'rem'

    if (zoom >= feature.properties.minZoom && zoom <= feature.properties.maxZoom) {
        let existingLabel = labels.find(label => label.options.name === feature.properties.name)

        if (!existingLabel) {
            const label = L.marker({ lat: feature.properties.label_point[0], lng: feature.properties.label_point[1] }, {
                icon: L.divIcon({
                    className: 'polygon-label',
                    html: `<span style="color: ${feature.properties.fill}; font-size: ${adjustedFontSize}">${feature.properties.name}</span>`,
                    iconSize: [100, 40]
                }),
                name: feature.properties.name
            }).bindPopup(
                "<strong>" +
                feature.properties.name +
                "</strong><br>" +
                feature.properties.desc
            ).addTo(map)

            labels.push(label)
        } else {
            existingLabel.setIcon(L.divIcon({
                className: 'polygon-label',
                html: `<span style="color: ${feature.properties.fill}; font-size: ${adjustedFontSize}">${feature.properties.name}</span>`,
                iconSize: [100, 40]
            }))
        }
    } else {
        let existingLabel = labels.find(label => label.options.name === feature.properties.name)
        if (existingLabel) {
            map.removeLayer(existingLabel)
            labels = labels.filter(label => label.options.name !== feature.properties.name)
        }
    }
}


export { createMarkerDesc, createPlaceDesc, createPlaceMarker, createMarker, createCountryInfo }