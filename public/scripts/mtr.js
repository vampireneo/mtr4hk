var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var line = d3.svg.line()
  .x(function(d) {
    return x(d.year);
  })
  .y(function(d) {
    return y(d.value);
  });

var allData = [];

var INIT_YEAR = 2004;
var LAST_YEAR = 2013;
var years = [];
i = INIT_YEAR;
while (i++ <= LAST_YEAR) {
  years.push(i);
}
d3.csv("mtr.csv").row(function(d) {
  // return { "field":d.Field};
  return d;
}).get(function(error, rows) {
  console.log(rows);

  rows.forEach(function(row) {
    var fieldData = [];
    years.forEach(function(y) {
      var value = 0.0;
      if (row[y]) {
        value = parseFloat(row[y].replace(',', '.'));
      }
      fieldData.push({
        "year": y,
        "value": value
      });

    });

    allData.push({
      field:row.Field,
      data:fieldData
    });

  });

x.domain([2000,2020]);

y.domain([0,1000]);
console.log('allData');
    console.log(JSON.stringify(allData));
// x.domain(d3.extent(fieldData, function(d) {
//   return d.year;
// }));
// y.domain(d3.extent(fieldData, function(d) {
//   return d.value;
// }));


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
// // .attr("x", 6)
// .attr("dy", ".71em")
// .style("text-anchor", "end")
// .text("Value");
// .text("Year");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Value");

svg.selectAll("path").data(allData).enter().append("path")
  .attr("class", "line")
  .attr("d", function(d){
    return line(d.data);
  });

// console.log(d3.select("body").append("svg").data(allData).enter());

//     data.forEach(function(fieldData) {
//         // d.close = +d.close;
//         console.log(fieldData);

//             x.domain(d3.extent(fieldData, function(d,k) {
//               console.log(d);
//               console.log('=');
//               console.log(k);

//               return k;
//             }));
//             y.domain(d3.extent(fieldData, function(d) {
//               return d[y];
//             }));
//     });

  });