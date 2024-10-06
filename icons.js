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

export { charIcon, placesIcon, pathOptions }