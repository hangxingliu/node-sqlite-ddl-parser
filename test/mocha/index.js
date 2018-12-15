//@ts-check

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { parse } = require('../..');

const sqlFilesDir = path.join(__dirname, '..', 'sql');

describe('simple sql test', () => {
	it('# empty SQL string', () => {
		const result = parse('');

		assert(result.tables.length === 0);
	});

	it('# single string', () => {
		const result = parse(
			'CREATE TABLE IF NOT EXISTS `tbTest` (' +
			'  `key` TEXT' +
			');'
		);
		assert(result.tables.length === 1);

		const table = result.tables[0];
		assert(table.name === 'tbTest');
		assert(table.columns[0].name === 'key');
		assert(table.columns[0].type === 'text');
	});

	it('# sql file: contacts.sql', () => {
		const result = parse(readSQL('contacts.sql'));
		assert(result.tables.length === 1);

		const table = result.tables[0];
		assert(table.name === 'contacts');
		assert(table.columns[0].name === 'contact_id');
		assert(table.columns[0].type === 'integer');
		assert(table.primaryKeys[0] === 'contact_id');

		assert(table.columns[3].name === 'email');
		assert(table.columns[3].type === 'text');
		assert(table.columns[3].unique);
	});

	it('# sql file: contacts_full.sql', () => {
		const result = parse(readSQL('contacts_full.sql'));
		assert(result.tables.length === 3);

		const table = result.tables[2];
		assert(table.primaryKeys[0] === 'contact_id');
		assert(table.primaryKeys[1] === 'group_id');
	});
})


function readSQL(fileName) {
	return fs.readFileSync(path.join(sqlFilesDir, fileName), 'utf8');
}
