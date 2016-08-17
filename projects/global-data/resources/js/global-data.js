var width = 1200,
    height = 600;

var svg = d3.select("#map-wrapper")
   .append("svg")
   .attr("width", width)
   .attr("height", height);

svg.append("rect")
   .attr("x", 0)
   .attr("y", 0)
   .attr("width", width)
   .attr("height", height)
   .style("fill", "#000");

var projection = d3.geo.equirectangular()
   .scale(190)
   .translate([width / 2, height / 2]);
var path = d3.geo.path().projection(projection);

d3.json("/global-data/json/world", function(error, mapData) {
   svg.append("path")
      .attr("class", "water")
      .datum(topojson.feature(mapData, mapData.objects.ocean))
      .attr("d", path);
      
   svg.append("path")
      .attr("class", "land")
      .datum(topojson.feature(mapData, mapData.objects.land))
      .attr("d", path);
   
   svg.append("path")
      .attr("class", "water")
      .datum(topojson.feature(mapData, mapData.objects.lakes))
      .attr("d", path);
   
   d3.json("/global-data/json/meteors", function(error, meteors) {
      var strikeData = meteors.features;
      strikeData.sort(function(a, b) {
         return parseInt(b.properties.mass) - parseInt(a.properties.mass);
      });
      
      svg.selectAll(".impact")
         .data(strikeData)
         .enter().append("circle")
         .attr("class", "impact")
         .attr("cx", function(d) {
            if (d.geometry)
               return projection(d.geometry.coordinates)[0];
         })
         .attr("cy", function(d) {
            if (d.geometry)
               return projection(d.geometry.coordinates)[1];
         })
         .attr("r", function(d) {
            if (d.properties.mass < 50000)
               return 2;
         
            if (d.properties.mass < 100000)
               return 4;
         
            if (d.properties.mass < 500000)
               return 7;

            if (d.properties.mass < 1000000)
               return 11;
         
            if (d.properties.mass < 5000000)
               return 15;
         
            if (d.properties.mass < 10000000)
               return 25;
         
            return 35;
         })
         .style("fill", function(d) {
            if (d.properties.mass < 50000)
               return "#ee8833";
         
            if (d.properties.mass < 100000)
               return "#33aaaa";
         
            if (d.properties.mass < 500000)
               return "#aa33aa";

            if (d.properties.mass < 1000000)
               return "#aaaa33";
         
            if (d.properties.mass < 5000000)
               return "#3333aa";
         
            if (d.properties.mass < 10000000)
               return "#33aa33";
         
            return "#aa3333";         
         })
         .on("mouseover", function(d) {
            var strikeDate = new Date(d.properties.year);
            var year = strikeDate.getFullYear();
         
            var lat = d.properties.reclat;
            var latDirection = (lat > 0 ? "N" : "S");
            lat = Math.abs(lat);
            var latDegree = Math.floor(lat);
            lat -= latDegree;
            lat *= 60;
            var latMinutes = Math.floor(lat);
            lat -= latMinutes;
            lat *= 60;
            var latSeconds = Math.floor(lat);
         
            var long = d.properties.reclong;
            var longDirection = (long > 0 ? "E" : "W");
            long = Math.abs(long);
            var longDegree = Math.floor(long);
            long -= longDegree;
            long *= 60;
            var longMinutes = Math.floor(long);
            long -= longMinutes;
            long *= 60;
            var longSeconds = Math.floor(long);
                  
            d3.select("#strikeName").text(d.properties.name);
            d3.select("#strikeYear").text(year);
            d3.select("#strikeClass").text(d.properties.recclass);
            d3.select("#strikeMass").text(d.properties.mass);
            d3.select("#strikeCoordinates").html(latDegree + "&deg; " + latMinutes + "' " + latSeconds + '" ' + latDirection + ", " + longDegree + "&deg; " + longMinutes + "' " + longSeconds + '" ' + longDirection);
            d3.select(".tooltip").style("opacity", 1);
         })
         .on("mouseout", function(d) {
            d3.select(".tooltip").style("opacity", 0);
         });
   });
});