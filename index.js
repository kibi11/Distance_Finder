const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const url = require("url");
const { response, request } = require("express");
const express = require("express");
const app = express();
app.use(cors());
dotenv.config();

app.get("/", (request, response) => {
  response.json({ status: "all good" });
});

app.get("/cities", async (request, response) => {
  const queryObject = url.parse(request.url, true).query;
  console.log(queryObject.city1);
  console.log(queryObject.city2);
  const city1 = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${queryObject.city1}.json?access_token=${process.env.SECRET_TOKEN}`
  );
  const city2 = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${queryObject.city2}.json?access_token=${process.env.SECRET_TOKEN}`
  );

  const location1 = city1.data.features[0].place_name;
  const location1_details = city1.data.features[0].center;

  const location2 = city2.data.features[0].place_name;
  const location2_details = city2.data.features[0].center;

  console.log(location1, location1_details);
  console.log(location2, location2_details);

  const cityDistance = await axios(
    `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${location1_details[0]},${location1_details[1]};${location2_details[0]},${location2_details[1]}?sources=1&annotations=distance,duration&access_token=${process.env.SECRET_TOKEN}`
  );
  console.log(cityDistance.data);

  response.send({
    city1: location1,
    city2: location2,
    Distance_KM: cityDistance.data.distances[0][0] / 1000,
  });
});

app.listen(3000, () => {
  console.log("Port listening at PORT 3000");
});
