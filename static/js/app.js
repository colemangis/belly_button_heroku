function buildMetadata(sample) {
    var metadata_url = `/metadata/${sample}`;
    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(metadata_url).then(successHandle).catch(errorHandle)
    
    function successHandle(results) {
      var sample_metadata = d3.select("#sample-metadata");
      sample_metadata.html("");
  
      Object.entries(results).forEach(result => {
        let key = result[0]
        let value = result[1]
      var row = sample_metadata.append("p");
      row.text(`${key}: ${value}`);
    });
    }
    function errorHandle(error) {
      console.log(`error = ${error}`);
    };
  };
  

function buildCharts(sample) {
  //console.log(sample);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  sampleUrl = `/samples/${sample}`
  d3.json(sampleUrl).then(successHandle).catch(errorHandle)
  
  function successHandle(result) {
    var plotData = result;
    var msize = plotData.sample_values;
    // var msize = [20, 40, 60, 80, 100]
    var mcolor = plotData.otu_ids;
    var textValue = plotData.otu_labels;
    var sampleData = d3.select("#bubble");
    
    // var label = plotData.otu_labels;

    // console.log(data);
    // console.log(sample);
    var trace = {
      x: plotData.otu_ids,
      y: plotData.sample_values,
      mode: 'markers',
      marker: {
        color: mcolor,
        size: msize,
      }
      };

    var datdata1 = [trace];

    var layout = {
      margin: {t: 0},
      title: "Bubble",
      showlegend: false,
      height: 600,
    };


    Plotly.newPlot("bubble", datdata1, layout, {responsive: true});

    var pieData = result;

    // Zip all arrays together to sort accordingly 
    var zipped = []
    var sValues = []
    var ids = []
    var labels = []
    var sample_data2 = d3.select("#pie");
    for (var i = 0; i < pieData.sample_values.length; i++){
      zipped.push([pieData.sample_values[i], pieData.otu_ids[i], pieData.otu_labels[i]]);
  };
    // Sort the array list in desc order and get top ten elements
    sorted = zipped.sort((a, b) => b[0]-a[0]).slice(0,10)
    for (var i = 0; i < sorted.length; i++){
      sValues.push(sorted[i][0]);
      ids.push(sorted[i][1]);
      labels.push(sorted[i][2]);
    };

    // Trace to plot for a pie chart
    var trace2 = [{
      values: sValues,
      labels: ids,
      hovertext: labels,
      type: 'pie'
    }];
    
    var layout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false
    };


    Plotly.newPlot("pie", trace2, {responsive: true});
};

function errorHandle(error) {
  console.log(`error = ${error}`)
};

};
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
