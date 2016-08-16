var margin = {top: 20, right: 20, bottom: 90, left: 125},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select(".chart")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom);

var chart = svg.append("g")
   .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("/heatmap/json", function(data) {
   var baseTemp = data.baseTemperature;
   var monthlyData = data.monthlyVariance;
   
   var x = d3.scale.linear()
      .domain([d3.min(monthlyData, function(d) { return d.year; }),
               d3.max(monthlyData, function(d) { return d.year; })])
      .range([0, width]);
   
   d3.select(".minYear").text(x.invert(0));
   d3.select(".maxYear").text(x.invert(width));
   
   var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
   
   var y = d3.scale.linear()
      .domain([1, 13])
      .range([0, height]);
   
   var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   var months = d3.scale.ordinal()
      .domain(monthNames)
      .rangeBands([0, height]);
   
   var monthsAxis = d3.svg.axis()
      .scale(months)
      .orient("left");
   
   var legendDomain = ["< -5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5 >"];
   var legend = d3.scale.ordinal()
      .domain(legendDomain)
      .rangeBands([(width * .65) , width]);
   
   var legendAxis = d3.svg.axis()
      .scale(legend)
      .orient("bottom");
   
   var cellWidth = x(1) - x(0);
   var cellHeight = y(1) - y(0);
   
   chart.selectAll("rect")
      .data(monthlyData)
      .enter().append("rect")
      .attr("class", function(d) { 
         var classVal = "cell ";
         var tempCategory = (d.variance < 0 ? "cooler-" : "warmer-");
         var difference = Math.floor(Math.abs(d.variance));
      
         if (difference > 5)
            difference = 5;
      
         classVal += tempCategory + difference;
      
         return classVal; })
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.month); })
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .on("mouseover", function(d) {
         d3.select(".year").text(d.year);
         d3.select(".month").text(monthNames[d.month - 1]);
         d3.select(".average").text(Math.round((baseTemp + d.variance) * 1000) / 1000);
         d3.select(".difference").text(d.variance);
         d3.select(".tooltip")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
            .style("opacity", 1);
      })
      .on("mouseout", function(d) {
         d3.select(".tooltip")
            .style("left", "-250px")
            .style("opacity", 0);
      });

   chart.append("g")
      .attr("class", "y axis")
      .call(monthsAxis)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90), translate(" + (height / -2) + ", -100)")
      .style("font-weight", 700)
      .text("MONTHS");
   
   chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis.tickFormat(d3.format("d")))
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (width / 2) + ", 50)")
      .style("font-weight", 700)
      .text("YEARS");
   
   chart.append("g")
      .selectAll("rect")
      .data(legendDomain)
      .enter().append("rect")
      .attr("class", function(d) { 
         var classStr = "cell ";
      
         if (d == "< -5")
            classStr += "cooler-5";
         else if (d == "5 >")
            classStr += "warmer-5";
         else {
            if (parseInt(d) < 0)
               classStr += "cooler-";
            else
               classStr += "warmer-";
            classStr += Math.abs(parseInt(d));
         }
      
         return classStr;
      })
      .attr("x", function(d) { return legend(d); })
      .attr("y", height + 40)
      .attr("width", legend.rangeBand())
      .attr("height", legend.rangeBand() * .75)
   
   chart.append("g")
      .attr("class", "legend axis")
      .attr("transform", "translate(0," + (height + 40 + legend.rangeBand() * .75) + ")")
      .call(legendAxis);
});