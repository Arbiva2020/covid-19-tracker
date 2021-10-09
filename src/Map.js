import React from "react";
import {
  MapContainer as LeafletMap,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";

//what we have on app.js - so we pass them as props (destructuring of props):
function Map({ countries, center, zoom, casesType }) {
  return (
    <div className="map">
      <MapContainer
        className="markercluster-map"
        center={[51.0, 19.0]}
        zoom={4}
        maxZoom={12}
      >
        <LeafletMap center={center} zoom={zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {showDataOnMap(countries, casesType)}
        </LeafletMap>
      </MapContainer>
    </div>
  );
}

export default Map;
