const defaultCoordinates = [54.526, 15.2551]
const defaultZoom = 5

const createdMap = L.map("map").setView(defaultCoordinates, defaultZoom)

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//         attribution:
//             '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     }).addTo(createdMap)



L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.jpg', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(createdMap)

// L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
//     maxZoom: 20,
//     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(createdMap)



function addPanel(map) {
    L.control
    .sidepanel('panelID', {
      panelPosition: 'right',
      hasTabs: true,
      tabsPosition: 'left',
      pushControls: true,
      darkMode: false,
      defaultTab: 'tab-1',
    })
    .addTo(map);
    document.getElementById('panelID').classList.add('sidepanel-visible');
}

export { createdMap, addPanel, defaultCoordinates, defaultZoom }