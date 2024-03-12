import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = join(__dirname, './.build/quickout.js');
const outputPath = join(__dirname, './profile-quickjs.csv');

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
    const { stdout, stderr } = await execPromise(`qjs ${scriptPath}`);
    if (stderr) console.error('Error:', stderr);
    return stdout;
  } catch (error) {
    console.error('Execution error:', error);
  }
}

function parseOutputToCSV(output) {
  const lines = output.split('\n');
  let groups = [{ csvData: `"Group ID","Y Label","X Label","X Value","QuickJS"\n` }];
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
    } else if (line.startsWith('QuickJS:')) {
      captureNextLineFor = line.split(':')[0].trim(); // Prepare to capture the next line for either Wasm or Node
    } else if (captureNextLineFor && line.trim().startsWith(currentGroup.config.yValue)) {
      const regex = /(\w+)\s*:\s*(\d+)/g;
      let match;
      let result = {}
      const metrics = {};
      while ((match = regex.exec(line)) !== null) {
        // match[1] is the key, match[2] is the value
        const key = match[1].trim(); // Trim the key to remove any whitespace
        const value = parseInt(match[2], 10); // Parse the value as an integer
        result[key] = value; // Add to the result object
      }

      const metricName = currentGroup.config.yValue
      const value = result[metricName]
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
    const quickjsValue = dp.metrics && dp.metrics['QuickJS'] && dp.metrics['QuickJS'][currentGroup.config.yValue] !== undefined ? dp.metrics['QuickJS'][currentGroup.config.yValue] : '';
    return `${groupLabel},${yLabel},${xLabel},"${dp[currentGroup.config.xValue]}","${quickjsValue}"\n`;
  }).join('');

  currentGroup.csvData = `
${body}
`;
  groups.push(currentGroup);
}





