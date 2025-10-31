let characters = {}
let markers = []
let places = {}
let placeMarkers = []
let gilbPath = {}
let gilbPathVisible = true
let charactersVisible = true
let otherPlacesVisible = false
let geoJsonLayers = []

import { createdMap, addPanel } from "./map-creation.js"
import { pathOptions } from "./icons.js"
import { createPlaceMarker, createMarker, createCountryInfo } from "./markers.js"



  const header = document.getElementById('header')
  const toggle = document.getElementById('header-toggle')

  toggle.addEventListener('click', () => {
    const icon = toggle.querySelector('i')
    header.classList.toggle('hidden')

    if (header.classList.contains('hidden')) {
      icon.classList.remove('fa-xmark')
      icon.classList.add('fa-bars')
    } else {
      icon.classList.remove('fa-bars')
      icon.classList.add('fa-xmark')
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) { 
    header.classList.add('hidden')
    const icon = toggle.querySelector('i')
    icon.classList.remove('fa-xmark')
    icon.classList.add('fa-bars')
  }
})

const map = createdMap

map.on('zoomend', () => {
    geoJsonLayers.forEach(layer => {
        if (layer.feature) {
            showInfo(layer.feature)
        }
    })
})


const style = (feature) => {
    return { 
        color: feature.properties.fill,
            weight: 2,
            opacity: 0.8,
            fillColor: feature.properties.fill,
            fillOpacity: 0.5 
     }
}

const showInfo = (feature) => {
    if (feature.properties) {
        createCountryInfo(feature, map)
    }
}


  const charactersCheckbox = document.getElementById('characters')
  const routeCheckbox = document.getElementById('route')
  const placesCheckbox = document.getElementById('places')

  window.addEventListener('DOMContentLoaded', () => {
    charactersCheckbox.checked = charactersVisible
    routeCheckbox.checked = gilbPathVisible
    placesCheckbox.checked = otherPlacesVisible
  })

  charactersCheckbox.addEventListener('change', () => {
    charactersVisible = charactersCheckbox.checked
    markers.forEach(marker => {
      charactersVisible ? marker.addTo(map) : map.removeLayer(marker)
    })
  })

  routeCheckbox.addEventListener('change', () => {
    gilbPathVisible = routeCheckbox.checked
    gilbPathVisible ? gilbPath.addTo(map) : map.removeLayer(gilbPath)
  })

  placesCheckbox.addEventListener('change', () => {
    otherPlacesVisible = placesCheckbox.checked
    placeMarkers.forEach(marker => {
      otherPlacesVisible ? marker.addTo(map) : map.removeLayer(marker)
    })
  })



function getBezierCurve(points) {
    if (points.length < 2) return []

    let path = ["M", points[0]]

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = i < points.length - 2 ? points[i + 2] : p2

        const cp1 = [
            p1[0] + (p2[0] - p0[0]) / 6,
            p1[1] + (p2[1] - p0[1]) / 6
        ]
        const cp2 = [
            p2[0] - (p3[0] - p1[0]) / 6,
            p2[1] - (p3[1] - p1[1]) / 6
        ]

        path.push("C", cp1, cp2, p2)
    }

    return path
}

fetch("data/characters.json")
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok")
        return response.json()
    })
    .then(data => {
        characters = data.characters
        characters.sort((a, b) => a.order - b.order)

        const coords = []

        characters.forEach((character, index) => {
            createMarker(character, markers, map, index)
            coords.push(character.coordinates)
        })

        const smoothPath = getBezierCurve(coords)
        gilbPath = L.curve(smoothPath, pathOptions).addTo(map)
    })
    .catch(error => console.error("There was a problem with the fetch operation:", error))



function getSmoothPolygonPoints(points, segments = 5) {
    if (points.length < 2) return points

    const result = []
    for (let i = 0; i < points.length; i++) {
        const p0 = points[i > 0 ? i - 1 : points.length - 1]
        const p1 = points[i]
        const p2 = points[(i + 1) % points.length]
        const p3 = points[(i + 2) % points.length]

        for (let t = 0; t <= 1; t += 1 / segments) {
            const t2 = t * t
            const t3 = t2 * t
            const x = 0.5 * ((2 * p1[0]) +
                (-p0[0] + p2[0]) * t +
                (2*p0[0] - 5*p1[0] + 4*p2[0] - p3[0]) * t2 +
                (-p0[0] + 3*p1[0] - 3*p2[0] + p3[0]) * t3)
            const y = 0.5 * ((2 * p1[1]) +
                (-p0[1] + p2[1]) * t +
                (2*p0[1] - 5*p1[1] + 4*p2[1] - p3[1]) * t2 +
                (-p0[1] + 3*p1[1] - 3*p2[1] + p3[1]) * t3)
            result.push([y, x])
        }
    }
    return result
}

fetch("data/map.geojson")
    .then(res => res.json())
    .then(data => {
        data.features.forEach(f => {
            if (f.geometry.type === "Polygon") {
                const coords = f.geometry.coordinates[0]
                const smoothCoords = getSmoothPolygonPoints(coords, 10)

                const layer = L.polygon(smoothCoords, style(f)).addTo(map)
                layer.feature = f 
                geoJsonLayers.push(layer)
                showInfo(f, layer)
            }
        })
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