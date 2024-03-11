import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Example usage
const csvFilePath = join(__dirname, 'profile.csv')
const data = readCSV(csvFilePath);
console.log({ data })

// Generate and save the chart HTML
function saveChartHTML(filePath, htmlContent) {
  fs.writeFileSync(filePath, htmlContent, { encoding: 'utf8' });
}

// Example usage
const htmlContent = generateChartHTML(data);
const htmlFilePath = join(__dirname, 'chart.html')
saveChartHTML(htmlFilePath, htmlContent);
console.log(`Chart HTML saved to ${htmlFilePath}`);

// Function to read and parse the CSV file
function readCSV(filePath) {
  const csvContent = fs.readFileSync(filePath, { encoding: 'utf8' });
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });
  return records;
}



// Function to generate HTML content for the chart
function generateChartHTML(data) {
  // Assuming your data array has objects with { Instances Count, Node, Wasm }
  const uniqueGroups = [...new Set(data.map(row => row['Group ID']))];
  let graphs = []
  uniqueGroups.forEach((group, i) => {
    const groupData = data.filter(row => row['Group ID'] === group)
    graphs.push({
      groupID: group,
      xValues: groupData.map(row => row['X Value']),
      nodeData: groupData.map(row => row['Node']),
      wasmData: groupData.map(row => row['Wasm']),
      yLabel: groupData[0]['Y Label'],
      xLabel: groupData[0]['X Label'],
      seriesLabel: 'Runtime',
      seriesValues: ['Node', 'Wasm'],

    })
  })

  return `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Simple Line Chart with ApexCharts</title>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>
<body>
${graphs.map((graph, i) => `
    <div id="chart-${i}" width=500px ></div>

<script type="text/javascript"> 
   var options = {
          series: [
          {
            name: "${graph.seriesValues[0]}",
            data: [${graph.nodeData}]
          },
          {
            name: "${graph.seriesValues[1]}",
            data: [${graph.wasmData}]
          }
        ],
          chart: {
          height: 500,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: '${graph.groupID}',
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: [${graph.xValues}] ,
          title: {
            text: '${graph.xLabel}'
          }
        },
        yaxis: {
          // logarithmic: true,
          title: {
            text: '${graph.yLabel}'
          },
         // min: 0,
         // max: 2000
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart-${i}"), options);
        chart.render();  
    </script>
`).join('')}
</body>
</html>
    `;
}

