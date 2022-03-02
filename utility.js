function getOnScreenStations() {
  var currentBounds = map.getBounds(); // get bounds of the map object's viewport
  let st = stations.filter((station) =>
    currentBounds.contains(L.latLng(station.lat, station.lng))
  );
  return st;
}
function checknear([lat, lng],station) {
    let neareststation = {};
    let nearest = Infinity;
    for (let i = 0; i < station.length; i++) {
      if (station[i]) {
        const [Mlat, Mlng] = [station[i].lat, station[i].lng];
        let distance =
          (lat - Mlat) * (lat - Mlat) + (lng - Mlng) * (lng - Mlng);
        if (distance < nearest) {
          nearest = distance;
          neareststation = station[i];
        }
      }
    }
    // console.log(neareststation)
    return neareststation;
  }