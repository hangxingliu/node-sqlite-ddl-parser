//@ts-check

const types = require('./types');
const lodashGet = require('lodash.get');
const _ = { get: lodashGet };

/** @type {types.GenerateTypeDefinationOpts} */
const DEFAULT_OPTS = {
	exportType: false,
	tablePrefix: 'SQLite_',
	indent: 4,
	colon: true,
};

module.exports = { generateTypeDefination };

/**
 * @param {types.SQLiteDDLParserResult} result
 * @param {types.GenerateTypeDefinationOpts} [opts]
 */
function generateTypeDefination(result, opts) {
	const tables = _.get(result, 'tables');
	assertArray('result.tables should be an array', tables);

	if (!opts) opts = {};
	opts = Object.assign({}, DEFAULT_OPTS, opts);

	const indent = typeof opts.indent === 'string'
		? opts.indent
		: new Array(opts.indent + 1).join(' ');

	const colon = opts.colon ? ';' : '';
	const prefix = opts.tablePrefix;

	/** @type {string[]} */
	let ts = [];
	for (const tb of result.tables) {
		ts.push([
			`${opts.exportType ? 'export ' : ''}type ${prefix}${tb.name} = {`,
			...tb.columns.map(col =>
				`${indent}${col.name}${col.notNull ? '' : '?'}: ${convertType(col.type)}${colon}`),
			`}${colon}`
		].join('\n'));
	}

	return ts.join('\n');
}

/** @param {string} sqliteType */
function convertType(sqliteType) {
	sqliteType = sqliteType.toLowerCase();
	switch (sqliteType) {
		case 'integer':
		case 'real':
			return 'number';
		case 'text':
			return 'string';
		default:
			return 'any';
	}
}

function assertArray(msg, array) {
	assert(msg, Array.isArray(array));
}
function assert(msg, ok) {
	if (!ok)
		throw new Error(msg);
}
