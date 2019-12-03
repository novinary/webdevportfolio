import * as d3 from 'd3';

var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 120
  },
  width = 800 - margin.left - margin.right,
  height = 210 - margin.top - margin.bottom;

var svg = d3
  .select('.zoom')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var y = d3.scaleLinear().rangeRound([height, 0]);

var x = d3.scaleTime().rangeRound([0, width]);

var xAxis = d3.axisTop(x);

var zoom = d3
  .zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([[0, 0], [width, height]])
  .extent([[0, 0], [width, height]])
  .on('zoom', zoomed);

var parseTime = d3.timeParse('%Y-%m-%d');

var lanes = ['A', 'B', 'C'];
var lanesLength = lanes.length;

var a = ['2010-02-12', '2013-08-15', '2015-01-23', '2017-01-22'];
var data = [];
a.forEach(function(d) {
  data.push(parseTime(d));
});

var today = new Date();
x.domain([
  d3.min(data, function(d) {
    return d;
  }),
  today
]);
y.domain([0, lanesLength]);

svg
  .append('g')
  .attr('class', 'axis axis--x')
  .style('stroke-width', 2)
  .attr('transform', 'translate(0)')
  .call(xAxis);

svg
  .append('g')
  .selectAll('.lanetext')
  .data(lanes)
  .enter()
  .append('text')
  .text(function(d) {
    return d;
  })
  .attr('x', -margin.right)
  .attr('y', function(d, i) {
    return y(i + 0.5);
  })
  .attr('dy', '.5ex')
  .attr('text-anchor', 'end')
  .attr('class', 'lanetext');

svg
  .append('g')
  .selectAll('logo')
  .attr('class', 'logo')
  .data(data)
  .enter()
  .append('circle')
  .attr('cy', 40)
  .attr('cx', function(d) {
    return x(d);
  })
  .attr('r', 10)
  .style('fill', '#000000');

svg
  .append('rect')
  .attr('class', 'zoom')
  .attr('width', width)
  .attr('height', height)
  .call(zoom);

function zoomed() {
  svg.select('.axis--x').call(xAxis.scale(d3.event.transform.rescaleX(x)));
  var new_x = d3.event.transform.rescaleX(x);
  svg.selectAll('.logo').attr('cx', function(d) {
    return new_x(d);
  });
}
