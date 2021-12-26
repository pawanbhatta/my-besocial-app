import React, { useState, useEffect } from "react";

import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const mapStyles = {
  width: "100%",

  height: "100%",
};

function Demo1() {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    if (navigator.geolocation) {
      // navigator.geolocation.watchPosition(function (position) {
      //   console.log("Latitude is :", position.coords.latitude);

      //   console.log("Longitude is :", position.coords.longitude);
      // });

      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("Latitude is :", position.coords.latitude);

          console.log("Longitude is :", position.coords.longitude);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        function (error) {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    }
  }, []);

  return (
    <div>
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: latitude,

          lng: longitude,
        }}
      >
        <Marker onClick={this.onMarkerClick} name={"This is test name"} />
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "API_KEY",
})(Demo1);
