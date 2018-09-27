// DEFINE CONSTANTS
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const color = 'steelblue';
const API_URL = 'gethistdata';

let svg, x, y, histogram, formatCount, colorScale, bar;

// start the chart when document is ready
$(document).ready( async () => {
    initChart();

    // get the data from the url
    const data = await getData(API_URL);

    x.domain(d3.extent(data));
    y.domain([0, data.length]);
    colorScale.domain([0, data.length]);

    histogram
        .domain(x.domain())
        .thresholds(x.ticks(20));

    const bins = histogram(data);

    drawChart(bins);
    drawAxes();
    drawLine(data, bins);
});

// function that fetches data from server
const getData = async (url) => {
    const data = await d3.json(url).then(result => result.data);
    return data;
};

// initializes the chart
const initChart = () => {
    // display format for the text for each histogram bar
    formatCount = d3.format(',.0f');

    // set the ranges
    x = d3.scaleLinear().range([0, width]);
    y = d3.scaleLinear().range([height, 0]);
    colorScale = d3.scaleLinear()
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);      

    // set the parameters for the histogram
    histogram = d3.histogram();  

    // create the svg
    svg = d3.select('#hist-chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');
};

// draw the chart
const drawChart = (data) => {
    // add the bars
    bar = svg.selectAll('.bar')
        .data(data)
        .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${x(d.x0)},${y(d.length)})`);

    // add a rectangle to the bar group
    bar.append('rect')
        .classed('bar-rect', true)
        .attr('width', d => x(d.x1) - x(d.x0) - 1)
        .attr('height', d => height - y(d.length) )
        .attr('fill', d => colorScale(d.length));      

    // add text to the bar group
    bar.append('text')
        .classed('bar-text', true)
        .attr('dy', '.75em')
        .attr('y', -15)
        .attr('x', d => (x(d.x1) - x(d.x0) - 1) / 2 )
        .attr('text-anchor', 'middle')
        .text(d => formatCount(d.length) );
};

const drawLine = (data, bins) => {
    const dragLine = svg.append('g')
        .classed('drag-line', true)
        .attr('transform', `translate(${width/2}, 0)`)
        .call(
            d3.drag()
            .on("drag", function (d) {
                d3.select(this).attr('transform', `translate(${d3.event.x}, 0)`)
            })
            .on('end', function (d) {
                const inv = x.invert(d3.event.x);
                const selectedBin = bins.filter( bin => {
                    return inv >= bin.x0 && inv < bin.x1;
                });
                const dataLeft = data.filter( dat => {
                    return dat <= inv;
                });
                const dataRight = data.filter(dat => {
                    return dat > inv;
                });
                
                const barsLeft = bar.filter( k => {
                    return inv < k.x1;
                });
                const barsRight = bar.filter(k => {
                    return inv >= k.x0;
                });                
                barsLeft.selectAll('rect').style('fill', '#ff0000');
                barsRight.selectAll('rect').style('fill', '#0000ff');

                console.log('data left of line', dataLeft);
                console.log('data right of line', dataRight);
            })
        );

    dragLine.append('line')
        .attr('y1', 0)
        .attr('y2', height);
}

// draw the axes
const drawAxes = () => {
    // add the x Axis
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append('g')
        .call(d3.axisLeft(y));  
};