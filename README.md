# SQlite DDL Parser

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/sqlite-ddl-parser.svg
[npm-url]: https://npmjs.org/package/sqlite-ddl-parser
[travis-image]: https://travis-ci.org/hangxingliu/node-sqlite-ddl-parser.svg?branch=master
[travis-url]: https://travis-ci.org/hangxingliu/node-sqlite-ddl-parser

A SQLite DDL([Data definition language](https://en.wikipedia.org/wiki/Data_definition_language)) parser module.

This module is built on [codeschool/sqlite-parser](https://github.com/codeschool/sqlite-parser)

## Install

``` bash
npm install sqlite-ddl-parser
```

## Example

``` javascript
const fs = require('fs');
const SQLiteDDLParser = require('sqlite-ddl-parser');

console.log(SQLiteDDLParser.parse(fs.readFileSync('./test/sql/contacts.sql'))); 
/*
{
    "tables": [{
		"name": "contacts",
		"columns": [{
			"name": "contact_id",
			"type": "integer",
			"notNull": false,
			"unique": false
		},{
			"name": "first_name",
			"type": "text",
			"notNull": true,
			"unique": false
		},{
			"name": "last_name",
			"type": "text",
			"notNull": true,
			"unique": false
		},{
			"name": "email",
			"type": "text",
			"notNull": true,
			"unique": true
		},{
			"name": "phone",
			"type": "text",
			"notNull": true,
			"unique": true
		}],
		"primaryKeys": [
			"contact_id"
		]
	}]
}
*/

```


## Author

[Liu Yue](https://github.com/hangxingliu)

## License

[GPL-3.0](LICENSE)
