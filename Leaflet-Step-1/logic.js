// Create a map object
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });
      var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 4,
        layers: [streetmap]
      });
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features, myMap);
  });
function createFeatures(earthquakeData, myMap) {
    function colorchooser(depth) {
        var color="";
        if(depth < -10){
            color = "lime";
        }
        else if (depth < 10)
        {
            color = "green";
        }
        else if (depth < 30)
        {
            color = "yellow";
        }
        else if (depth < 50)
        {
            color = "orange";
        }
        else 
        {
            color = "red";
        }
        return color;
    }
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature) {
        console.log(feature);
      L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        weight: 1,
        fillColor: colorchooser(feature.geometry.coordinates[2]),
        // Adjust radius
        radius: feature.properties.mag * 20000
      }).bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>").addTo(myMap);
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
}
  
  