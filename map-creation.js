const defaultCoordinates = [54.526, 15.2551];
const defaultZoom = 5;

const createdMap = L.map("map").setView(defaultCoordinates, defaultZoom);

const attribution =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const baseLayers = {
  "Domyślna - jasna": L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.jpg",
    {
      maxZoom: 20,
      attribution,
    }
  ),

  Ciemna: L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.jpg",
    {
      maxZoom: 20,
      attribution,
    }
  ),

  Watercolor: L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    {
      maxZoom: 19,
      attribution,
    }
  ),

  "Współczesne granice - ciemna": L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.jpg",
    {
      maxZoom: 20,
      attribution,
    }
  ),
  "Współczesne granice - jasna": L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.jpg",
    {
      maxZoom: 20,
      attribution,
    }
  ),
};

baseLayers["Domyślna - jasna"].addTo(createdMap);

L.control
  .layers(baseLayers, null, {
    position: "bottomleft",
  })
  .addTo(createdMap);

function addPanel(map) {
  L.control
    .sidepanel("panelID", {
      panelPosition: "right",
      hasTabs: true,
      tabsPosition: "left",
      pushControls: true,
      darkMode: false,
      defaultTab: "tab-1",
    })
    .addTo(map);
  document.getElementById("panelID").classList.add("sidepanel-visible");
}

export { createdMap, addPanel, defaultCoordinates, defaultZoom };
