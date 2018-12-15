export type SQLiteColumn = {
	name: string;
	type: string;

	notNull: boolean;
	unique: boolean;
};

export type SQLiteTable = {
	name: string;
	columns: SQLiteColumn[];
	primaryKeys: string[];
};

export type SQLiteDDLParserResult = {
	tables: SQLiteTable[];
};


export type GenerateTypeDefinationOpts = {
	exportType?: boolean;
	tablePrefix?: string;
	indent?: number | string;
	colon?: boolean;
}
