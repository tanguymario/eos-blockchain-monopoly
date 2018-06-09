var lonlat2coord = function(lon, lat) {
  return {
    x: (lon + 180.0) / 360.0, 
    y: 1.0 / 180.0 * (90.0 - lat)
  };
}

var getNormalizedCoordsFromLatLon = function(lat, lon) {
  return {
    x: (lat + 180) / 360,
    y: (lon + 85 ) / 170
  }
}

module.exports.lonlat2coord = lonlat2coord;
module.exports.getNormalizedCoordsFromLatLon = getNormalizedCoordsFromLatLon;