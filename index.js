//@ts-check

const types = require('./types');
const parseSQLite = require('sqlite-parser');
const lodashGet = require('lodash.get');
const _ = { get: lodashGet };

module.exports = { parse };

/**
 * @param {Buffer|string} sql
 * @returns {types.SQLiteDDLParserResult}
 */
function parse(sql) {
	if (sql) {
		if (typeof sql !== 'string' && typeof sql.toString === 'function')
			sql = sql.toString();
	} else {
		sql = '';
	}

	const ast = parseSQLite(sql);
	if (!ast)
		return { tables: [] };

	assert('AST root element should be a list', ast.variant === 'list')
	assertArray('statements should be an array', ast.statement);

	/** @type {types.SQLiteTable[]} */
	const tables = [];

	for (const stat of ast.statement) {
		if (!stat) {
			continue;
		}
		if (stat.variant === 'create' && stat.format === 'table') {
			tables.push(parseSQliteTable(stat));
			continue;
		}

	}

	return { tables };
}

/** @returns {types.SQLiteTable} */
function parseSQliteTable(stat) {
	const name = _.get(stat, 'name.name');
	assert('create table statename without name prop', stat.name);
	assertArray('create table statement should has `definition` property (array)', stat.definition);

	const primaryKeys = createSet();

	/** @type {types.SQLiteColumn[]} */
	const columns = [];

	for (const def of stat.definition) {
		if (def.variant === 'column') {
			const name = def.name;
			const type = _.get(def, 'datatype.affinity');

			/** @type {string[]} */
			const constraint = Array.isArray(def.definition)
				? def.definition.filter(it => it.type === 'constraint').map(it => it.variant)
				: [];

			let notNull = false, unique = false;
			for (const c of constraint) {
				switch (c) {
					case 'not null': notNull = true; break;
					case 'unique': unique = true; break;
					case 'primary key': primaryKeys.add(name); break;
				}
			}

			columns.push({ name, type, notNull, unique });
			continue;
		} else if (def.variant === 'constraint') {
			const type = _.get(def, 'definition[0].variant');
			if (type === 'primary key') {
				def.columns.forEach(it => primaryKeys.add(it.name));
				continue;
			}
			// console.log(console.log(JSON.stringify(def)))
		}
	}

	return { name, columns, primaryKeys: Array.from(primaryKeys) };
}

/** @returns {Set<any>} */
function createSet() {
	if (typeof Set !== 'undefined')
		return new Set();
	const arr = [];
	//@ts-ignore
	arr.add = el => { if (arr.indexOf(el) < 0) arr.push(el); };
	//@ts-ignore
	return arr;
}

function assertArray(msg, array) {
	assert(msg, Array.isArray(array));
}
function assert(msg, ok) {
	if (!ok)
		throw new Error(msg);
}
