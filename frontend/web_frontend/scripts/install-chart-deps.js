// This script adds the required chart.js dependencies to package.json
const fs = require('fs');
const path = require('path');
const packageJsonPath = path.join(__dirname, '..', 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add chart.js and react-chartjs-2 dependencies if they don't exist
  packageJson.dependencies = packageJson.dependencies || {};
  
  if (!packageJson.dependencies['chart.js']) {
    packageJson.dependencies['chart.js'] = '^4.4.0';
    console.log('Added chart.js dependency');
  }
  
  if (!packageJson.dependencies['react-chartjs-2']) {
    packageJson.dependencies['react-chartjs-2'] = '^5.2.0';
    console.log('Added react-chartjs-2 dependency');
  }
  
  // Write the updated package.json file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Successfully updated package.json');
  console.log('Run "npm install" to install the dependencies');
} catch (error) {
  console.error('Error updating package.json:', error);
}