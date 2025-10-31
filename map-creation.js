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
        imageurl: './open-book.png',
        imagealt: 'icon for links',
        tooltip: 'Made by KaiShouri',
        width: '30px',
        height: '30px',
        position: 'topleft',
        expandcontent: `<div class='bg-blue-200 p-2 rounded-md font-mono'><strong>Czytaj tutaj:</strong><br>
        <a href="https://www.wattpad.com/story/197754386-aph-polowanie-na-%C5%82ab%C4%99dzia" target="_blank">Wattpad</a><br>
        <a href="https://archiveofourown.org/works/20355778/chapters/48268933" target="_blank">AO3</a><br>
        <a href="https://www.fanfiction.net/s/13370205/1/Polowanie-na-%C5%82ab%C4%99dzia" target="_blank">Fanfiction.net</a><br>
        <a href="https://www.kaishouri.pl/read/polowanienalabedzia" target="_blank">KaiShouri.pl</a></div>`

    }).addTo(map)
}

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

export { createdMap, addCredits, addPanel, defaultCoordinates, defaultZoom }