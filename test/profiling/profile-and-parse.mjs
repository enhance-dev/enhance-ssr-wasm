import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = join(__dirname, './node-and-wasm.mjs');
const outputPath = join(__dirname, './profile.csv');

async function main() {
  const result = await runScriptAndCaptureOutput(scriptPath)
  console.log(result)
  const parsedResult = parseOutputToCSV(result); // Adjust paths as necessary
  console.log(parsedResult)
  writeFileSync(outputPath, parsedResult);
  console.log('Processing and saving completed.')
}

main();


async function runScriptAndCaptureOutput(scriptPath) {
  try {
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    if (stderr) console.error('Error:', stderr);
    return stdout;
  } catch (error) {
    console.error('Execution error:', error);
  }
}

function parseOutputToCSV(output) {
  const lines = output.split('\n');
  let groups = [{ csvData: `"Group ID","Y Label","X Label","X Value","Node","Wasm"\n` }];
  let currentGroup = null;
  let readingJSON = false;
  let jsonBuffer = '';
  let captureNextLineFor = '';

  lines.forEach(line => {
    if (line.includes('** NEW GROUP **')) {
      currentGroup = { config: null, dataPoints: [], csvData: '' };
    } else if (line.includes('** END GROUP **')) {
      finalizeCurrentGroup(groups, currentGroup);
      currentGroup = null;
    } else if (line.includes('** START JSON **')) {
      readingJSON = true;
      jsonBuffer = '';
    } else if (line.includes('** END JSON **')) {
      readingJSON = false;
      const jsonData = JSON.parse(jsonBuffer);
      if (!currentGroup.config) {
        currentGroup.config = jsonData;
      } else {
        currentGroup.dataPoints.push(jsonData);
      }
    } else if (readingJSON) {
      jsonBuffer += line;
    } else if (line.startsWith('Wasm:') || line.startsWith('Node:')) {
      captureNextLineFor = line.split(':')[0].trim(); // Prepare to capture the next line for either Wasm or Node
    } else if (captureNextLineFor && line.trim().startsWith(currentGroup.config.yValue)) {
      const metric = line.trim().split(':');
      const metricName = metric[0].trim();
      const value = parseInt(metric[1].trim(), 10);
      const lastDataPoint = currentGroup.dataPoints[currentGroup.dataPoints.length - 1];
      if (!lastDataPoint.metrics) lastDataPoint.metrics = {};
      lastDataPoint.metrics[captureNextLineFor] = lastDataPoint.metrics[captureNextLineFor] || {};
      lastDataPoint.metrics[captureNextLineFor][metricName] = value;
      captureNextLineFor = ''; // Reset after capturing
    }
  });

  return groups.map(group => group.csvData).join('');
}

function finalizeCurrentGroup(groups, currentGroup) {
  const groupLabel = `"${currentGroup.config.groupLabel}"`
  const yLabel = `"${currentGroup.config.yLabel}"`;
  const xLabel = `"${currentGroup.config.xLabel}"`;
  const body = currentGroup.dataPoints.map(dp => {
    const nodeValue = dp.metrics && dp.metrics['Node'] && dp.metrics['Node'][currentGroup.config.yValue] !== undefined ? dp.metrics['Node'][currentGroup.config.yValue] : '';
    const wasmValue = dp.metrics && dp.metrics['Wasm'] && dp.metrics['Wasm'][currentGroup.config.yValue] !== undefined ? dp.metrics['Wasm'][currentGroup.config.yValue] : '';
    return `${groupLabel},${yLabel},${xLabel},"${dp[currentGroup.config.xValue]}","${nodeValue}","${wasmValue}"\n`;
  }).join('');

  currentGroup.csvData = `
${body}
`;
  groups.push(currentGroup);
}





