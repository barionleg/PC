/**
 * Validate that the JSON data is correctly formatted according
 * to the template in the 'schemas' directory.
 */

const fs = require('fs');
const Ajv = require('ajv');
const ajv = new Ajv();

const PERIODIC_TABLE_JSON = "PeriodicTable.json";
const PERIODIC_TABLE_SCHEMA = "periodicTableJSON.schema";

console.log(`Validating ${PERIODIC_TABLE_JSON} against ${PERIODIC_TABLE_SCHEMA}`);
const data = JSON.parse(fs.readFileSync(PERIODIC_TABLE_JSON, 'utf8'));
const schema = JSON.parse(fs.readFileSync(PERIODIC_TABLE_SCHEMA, 'utf8'));

// Raises an exception in case of failure
const validate = ajv.compile(schema);
const valid = validate(data);
if (!valid) {
    console.error(validate.errors);
    throw new Error("Validation failed");
}

console.log("Validation passed");


