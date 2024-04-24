// Import required modules
const fs = require('fs');
const { parse } = require('json2csv');

const PERIODIC_TABLE_CSV = "PeriodicTable.csv";

// Validate and load data
const PERIODIC_TABLE_JSON = require('./validate_json').PERIODIC_TABLE_JSON;

fs.readFile(PERIODIC_TABLE_JSON, (err, data) => {
  if (err) throw err;
  const jdata = JSON.parse(data).elements;

  // Convert JSON to CSV
  const fields = Object.keys(jdata[0]);
  const opts = { fields };
  try {
    const csv = parse(jdata, opts);
    console.log(csv);
    fs.writeFile(PERIODIC_TABLE_CSV, csv, (err) => {
      if (err) throw err;
      console.log(`CSV saved to ${PERIODIC_TABLE_CSV}`);
    });
  } catch (err) {
    console.error(err);
  }
});


