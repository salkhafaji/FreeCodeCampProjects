
const w = 800;
const h = 600;
const padding = 40;
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const req = new XMLHttpRequest();

let data
let dataset

let heightScale //height of bars
let xScale //where bars are placed horizontally 
let xAxisScale
let yAxisScale


let svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

let generateScales = () =>{
        heightScale =  d3.scaleLinear()
                 .domain([0, d3.max(dataset, (d) => d[1])]) // a bar can be from 0 to max gdp value
                 .range([0, h -(2*padding)]); // a bars height on the canvas can be from 0 to the height of the canvas minus the padding *2 to give ample space
        xScale = d3.scaleLinear()
                 .domain([0, dataset.length -1 ]) //the placement of the bar can be from 0 to number of bars
                 .range([padding, w - padding]) //the range of placement of the bars on the canvas goes from padding to the width of the canvas - padding
        let datesArray = dataset.map((d) => { 
            return new Date(d[0])
            })
        xAxisScale = d3.scaleTime()
                      .domain([d3.min(datesArray), d3.max(datesArray)]) // set the domain to the min and max date
                      .range([padding, w - padding] ) //set the range of the x axis to the width of the canvas - padding
        yAxisScale = d3.scaleLinear()
                      .domain([0, d3.max(dataset, (d) => d[1]) ])
                      .range([ h - padding, padding])
}

let generateAxes = () => {
  
  let xAxis = d3.axisBottom(xAxisScale)
  svg.append('g')
      .call(xAxis)
      .attr('id','x-axis')
      .attr("transform", "translate(0," + (h - padding) + ")")
      .selectAll('tick')
      .attr('class','tick')
  
  let yAxis = d3.axisLeft(yAxisScale)
  svg.append('g')
     .call(yAxis)
     .attr('id','y-axis')
     .attr('transform',"translate(" +(padding)+",0)")
     .selectAll('tick')
     .attr('class','tick')
  
}

let drawBars = () => {
  
  let tooltip = d3.select('body')
      .append('div')
      .attr('id','tooltip')
      .style('visibility', 'hidden')
      .style('width','auto')
      .style('height','auto')
  
  svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i)) //defines on the x axis where the bar should go
      .attr('y', (d) => h - padding - heightScale(d[1])) // Adjusted y position to accommodate padding
      .attr('width', (w - 2 * padding) / dataset.length) // Adjusted width to evenly distribute bars
      .attr('height', (d) => heightScale(d[1])) //defines the height of the bar
      .attr("fill",'teal')
      .attr('class','bar')
      .attr('data-date', (d) =>d[0])
      .attr('data-gdp', (d) => d[1])
      .on('mouseover', (event, d)=> {
        console.log(d);
        tooltip.transition()
            .style('visibility', 'visible')

        tooltip.text("Date: "+d[0] +"\n\n   GDP: "+d[1])

        document.querySelector('#tooltip').setAttribute('data-date', d[0])
    })
    .on('mouseout', (event, d) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })  
      
      
      
  
}


req.open('GET', url, true)
req.onload = () =>{
  data =JSON.parse(req.responseText)
  dataset = data.data
  console.log(dataset)
  generateScales()
  generateAxes()
  drawBars()
}

req.send()

svg.append("text")
   .attr("id","title")
   .attr("x", w / 2 - 50)
   .attr("y", padding /2)
   .attr("text-anchor", "middle")
   .text("United States GDP");

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 30)
    .attr("y", (d) =>  h - d * 5)
    .attr("width", 25)
    .attr("height", (d, i) => d*5)
    .attr("fill","teal")