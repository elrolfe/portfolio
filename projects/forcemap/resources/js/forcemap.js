var width = 1000,
    height = 800;

var svg = d3.select(".graph-wrapper").append("svg")
   .attr("height", height)
   .attr("width", width);

svg.append("defs")
   .append("clipPath")
   .attr("id", "flag-clip")
   .append("rect")
   .attr("width", 25)
   .attr("height", 15);

d3.json("/forcemap/json", function(data) {
   var nodes = data.nodes;
   var links = data.links;

   var force = d3.layout.force()
      .size([width, height])
      .nodes(nodes)
      .links(links)
      .linkDistance(50)
      .gravity(0.15)
      .charge(function(d) {
         return -200 - (d.weight * 10);
      })
      .chargeDistance(400);
   
   var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link");
   
   var node = svg.selectAll("image")
      .data(nodes)
      .enter().append("image")
      .attr("class", function(d) { return "flag-" + d.code; })
      .attr("xlink:href", "/forcemap/img/flags_25x15.png")
      .attr("height", 225)
      .attr("width", 400)
      .call(force.drag)
      .on("mouseover", function(d) {
         d3.select("#name").text(d.country);
      })
      .on("mouseout", function(d) {
         d3.select("#name").text("Hover over a flag to see the country's name");
      })
      .on("mousedown", function() { d3.event.stopPropagation(); });
   
   force.on("tick", function() {
      node.attr("transform", function(d) { 
         if (d.x < 20)
            d.x = 20;
         if (d.x > width - 20)
            d.x = width - 20;
         
         if (d.y < 20)
            d.y = 20;
         if (d.y > height - 20)
            d.y = height - 20;
         
         return "translate(" + (d.x - 12) + ", " + (d.y - 7) + ")"; 
      });
      
      link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });
   });
   
   force.start();
});