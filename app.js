// let center = [28.651, 77.1562]
// let map = L.map("map", {
//   center,
//   layers: MQ.mapLayer(),
//   zoom: 10,
// });

// function runDirection(start, end) {
//   // recreating new map layer after removal
//   map = L.map("map", {
//     layers: MQ.mapLayer(),
//     center,
//     zoom: 10,
//   });
//   var dir = MQ.routing.directions();
//   dir.route({
//     locations: [start, end],
//   });
//   CustomRouteLayer = MQ.Routing.RouteLayer.extend({
//     createStartMarker: (location) => {
//       var marker;
//       marker = L.marker(location.latLng).addTo(map);
//       return marker;
//     },
//     createEndMarker: (location) => {
//       var marker;
//       marker = L.marker(location.latLng).addTo(map);
//       return marker;
//     },
//   });
//   map.addLayer(
//     new CustomRouteLayer({
//       directions: dir,
//       fitBounds: true,
//     })
//   );
// }

// function submitForm(event) {
//   event.preventDefault();
//   map.remove();
//   start = document.getElementById("start").value;
//   end = document.getElementById("destination").value;
//   runDirection(start, end);
//   document.getElementById("form").reset();
// }

// const form = document.getElementById("form");
// form.addEventListener("submit", submitForm);

function showDataOnMap(stations) {
  let arrofpromis = stations.map((station) => {
    let one = fetch(
      `http://jtaqi.herokuapp.com/data?lat=${station.lat}&lon=${station.lng}`
    )
      .then((r) => r.json())
      .then((x) => {
        console.log(station.name)
        // let b = color(x);
        console.log(x)
        let b = color(x.list[0].components.pm10);
        station.color = b;
        return station;
      })
      .catch((e) => undefined);
    if (one) return one;
  });
  return Promise.all(arrofpromis);
}
//==============================roads=====================================
fetch("./roads.geojson")
  .then((res) => res.json())
  .then((x) => L.geoJSON(x).addTo(map))
showDataOnMap(stations).then((stations) => {
  fetch("./roads.geojson")
    .then((res) => res.json())
    .then((x) => {
      x.features.forEach((element) => {
        let station = checknear(element.geometry.coordinates[0]);
        L.geoJSON(element, { style: { color: station.color } })
          .bindPopup(JSON.stringify(station))
          .addTo(map);
      });
    });
});
function checknear([lng, lat]) {
  let neareststation = {};
  let nearest = Infinity;
  for (let i = 0; i < stations.length; i++) {
    if (stations[i]) {
      const [Mlat, Mlng] = [stations[i].lat, stations[i].lng];
      let distance =
        (lat - Mlat) * (lat - Mlat) + (lng - Mlng) * (lng - Mlng);
      if (distance < nearest) {
        nearest = distance;
        neareststation = stations[i];
      }
    }
  }
  return neareststation;
}
function color(c) {
  if (c < 175) {
    return "green";
  }
  if (c < 200) {
    return "#70b900";
  }
  if (c < 250) {
    return "yellow";
  }
  if (c < 400) {
    return "orange";
  }
  if (c > 400) {
    return "red";
  }
}
