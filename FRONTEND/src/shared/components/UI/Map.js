import React from "react";
import { useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const { center, zoom } = props;
  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return <div id="map" className={`map ${props.className}`}></div>;
};
export default Map;
