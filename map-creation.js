const defaultCoordinates = [54.526, 15.2551]
const defaultZoom = 5

const createdMap = L.map("map").setView(defaultCoordinates, defaultZoom)

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(createdMap)
    

function addCredits(map) {
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
}

function addPanel(map) {
    const panelRight = L.control
    .sidepanel('panelID', {
      panelPosition: 'right',
      hasTabs: true,
      tabsPosition: 'left',
      pushControls: true,
      darkMode: false,
      defaultTab: 'tab-1',
    })
    .addTo(map);
}

export { createdMap, addCredits, addPanel, defaultCoordinates, defaultZoom }