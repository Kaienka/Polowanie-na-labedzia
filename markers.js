let labels = [];

const createMarkerDesc = (character) => {
  return `<div class='font-mono text-normal'>
            <h3 class='text-normal'><b>${character.pl}</b></h3>
            <span><strong>Mieszka w: </strong>${character.location}</span><br>
            <span><strong>Zawód: </strong>${character.occupation}</span><br>
            <span><strong>Wizytacja: </strong>${character.day}</span></div>`;
};

const createPlaceDesc = (place) => {
  return `<div class='font-mono'>
    <h3><strong>${place.name}</strong></h3>${place.desc}<br>
    </div>`;
};

const createPlaceMarker = (place, placeMarkers) => {
  const marker = L.marker(place.coordinates, {
    title: place.name,
    icon: L.divIcon({
      className: `
            w-6 h-6 
            rounded-full 
            bg-amber-200 
            shadow-lg 
            hover:bg-amber-300 
            transition-all duration-200
        `,
      html: `<div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    }),

    riseOnHover: true,
    riseOffset: 500,
  });
  marker.bindPopup(createPlaceDesc(place));
  placeMarkers.push(marker);
};

const createMarker = (character, markers, map, index) => {
  const marker = L.marker(character.coordinates, {
    title: character.pl,
    riseOnHover: true,
    riseOffset: 500,
    zIndexOffset: 100,
    icon: L.divIcon({
      className: `
            w-6 h-6 
            rounded-full 
            bg-sky-200 
            shadow-lg 
            hover:bg-sky-300 
            transition-all duration-200
            text-center
            relative
            text-sm font-bold font-mono
        `,
      html: `<span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold">${
        index + 1
      }</span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    }),
  }).addTo(map);

  marker.bindPopup(createMarkerDesc(character));
  markers.push(marker);
};


export {
  createMarkerDesc,
  createPlaceDesc,
  createPlaceMarker,
  createMarker,
};
