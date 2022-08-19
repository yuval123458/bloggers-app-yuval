const API_KEY = "AIzaSyBZ_WgLN7fj - kDOsyqGnfPsETRBgu_cJFM";

const axios = require("axios");
const httpError = require("../models/http-error");

const getCoordinates = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new httpError("Could not find location for the address", 404);
    throw error;
  }

  const coordiantes = data.results[0].geometry.location;

  return coordiantes;
};
module.exports = getCoordinates;
