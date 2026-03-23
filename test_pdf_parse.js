const fs = require('fs');
const pdf = require('pdf-parse');

async function run() {
  const buffer = fs.readFileSync('test.pdf');
  const data = await pdf(buffer);
  console.log(Object.keys(data));
}
run();
