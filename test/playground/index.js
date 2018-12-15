
//@ts-check

const fs = require('fs');
const path = require('path');
const { parse } = require('../..');
const { generateTypeDefination } = require('../../utils');

const sqlFilesDir = path.join(__dirname, '..', 'sql');

console.log(generateTypeDefination(parse(readSQL('contacts.sql'))));

function readSQL(fileName) {
	return fs.readFileSync(path.join(sqlFilesDir, fileName), 'utf8');
}
