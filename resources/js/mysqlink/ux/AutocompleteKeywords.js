Ext.ns('Autocomplete');

Autocomplete.Keywords = [
    ('ACCESSIBLE'), ('ALTER'), ('AS'), ('BEFORE'), ('BINARY'), ('BY'), ('CASE'), ('CHARACTER'), ('COLUMN'), ('CONTINUE'), ('CROSS'), ('CURRENT_TIMESTAMP'), ('DATABASE'), ('DAY_MICROSECOND'), ('DEC'), ('DEFAULT'),
    ('DESC'), ('DISTINCT'), ('DOUBLE'), ('EACH'), ('ENCLOSED'), ('EXIT'), ('FETCH'), ('FLOAT8'), ('FOREIGN'), ('GRANT'), ('HIGH_PRIORITY'), ('HOUR_SECOND'), ('IN'), ('INNER'), ('INSERT'), ('INT2'), ('INT8'),
    ('INTO'), ('JOIN'), ('KILL'), ('LEFT'), ('LINEAR'), ('LOCALTIME'), ('LONG'), ('LOOP'), ('MATCH'), ('MEDIUMTEXT'), ('MINUTE_SECOND'), ('NATURAL'), ('NULL'), ('OPTIMIZE'), ('OR'), ('OUTER'), ('PRIMARY'),
    ('RANGE'), ('READ_WRITE'), ('REGEXP'), ('REPEAT'), ('RESTRICT'), ('RIGHT'), ('SCHEMAS'), ('SENSITIVE'), ('SHOW'), ('SPECIFIC'), ('SQLSTATE'), ('SQL_CALC_FOUND_ROWS'), ('STARTING'), ('TERMINATED'),
    ('TINYINT'), ('TRAILING'), ('UNDO'), ('UNLOCK'), ('USAGE'), ('UTC_DATE'), ('VALUES'), ('VARCHARACTER'), ('WHERE'), ('WRITE'), ('ZEROFILL'), ('ALL'), ('AND'), ('ASENSITIVE'), ('BIGINT'), ('BOTH'), ('CASCADE'),
    ('CHAR'), ('COLLATE'), ('CONSTRAINT'), ('CREATE'), ('CURRENT_TIME'), ('CURSOR'), ('DAY_HOUR'), ('DAY_SECOND'), ('DECLARE'), ('DELETE'), ('DETERMINISTIC'), ('DIV'), ('DUAL'), ('ELSEIF'), ('EXISTS'), ('FALSE'),
    ('FLOAT4'), ('FORCE'), ('FULLTEXT'), ('HAVING'), ('HOUR_MINUTE'), ('IGNORE'), ('INFILE'), ('INSENSITIVE'), ('INT1'), ('INT4'), ('INTERVAL'), ('ITERATE'), ('KEYS'), ('LEAVE'), ('LIMIT'), ('LOAD'), ('LOCK'),
    ('LONGTEXT'), ('MASTER_SSL_VERIFY_SERVER_CERT'), ('MEDIUMINT'), ('MINUTE_MICROSECOND'), ('MODIFIES'), ('NO_WRITE_TO_BINLOG'), ('ON'), ('OPTIONALLY'), ('OUT'), ('PRECISION'), ('PURGE'), ('READS'),
    ('REFERENCES'), ('RENAME'), ('REQUIRE'), ('REVOKE'), ('SCHEMA'), ('SELECT'), ('SET'), ('SPATIAL'), ('SQLEXCEPTION'), ('SQL_BIG_RESULT'), ('SSL'), ('TABLE'), ('TINYBLOB'), ('TO'), ('TRUE'), ('UNIQUE'),
    ('UPDATE'), ('USING'), ('UTC_TIMESTAMP'), ('VARCHAR'), ('WHEN'), ('WITH'), ('YEAR_MONTH'), ('ADD'), ('ANALYZE'), ('ASC'), ('BETWEEN'), ('BLOB'), ('CALL'), ('CHANGE'), ('CHECK'), ('CONDITION'), ('CONVERT'),
    ('CURRENT_DATE'), ('CURRENT_USER'), ('DATABASES'), ('DAY_MINUTE'), ('DECIMAL'), ('DELAYED'), ('DESCRIBE'), ('DISTINCTROW'), ('DROP'), ('ELSE'), ('ESCAPED'), ('EXPLAIN'), ('FLOAT'), ('FOR'), ('FROM'),
    ('GROUP'), ('HOUR_MICROSECOND'), ('IF'), ('INDEX'), ('INOUT'), ('INT'), ('INT3'), ('INTEGER'), ('IS'), ('KEY'), ('LEADING'), ('LIKE'), ('LINES'), ('LOCALTIMESTAMP'), ('LONGBLOB'), ('LOW_PRIORITY'),
    ('MEDIUMBLOB'), ('MIDDLEINT'), ('MOD'), ('NOT'), ('NUMERIC'), ('OPTION'), ('ORDER'), ('OUTFILE'), ('PROCEDURE'), ('READ'), ('REAL'), ('RELEASE'), ('REPLACE'), ('RETURN'), ('RLIKE'), ('SECOND_MICROSECOND'),
    ('SEPARATOR'), ('SMALLINT'), ('SQL'), ('SQLWARNING'), ('SQL_SMALL_RESULT'), ('STRAIGHT_JOIN'), ('THEN'), ('TINYTEXT'), ('TRIGGER'), ('UNION'), ('UNSIGNED'), ('USE'), ('UTC_TIME'), ('VARBINARY'), ('VARYING'),
    ('WHILE'), ('XOR'), ('FULL'), ('COLUMNS'), ('MIN'), ('MAX'), ('STDEV'), ('COUNT'), ('BEGIN'), ('END'), ('VIEW'), ('PROCESSLIST'), ('VARIABLES'), ('STATUS'), ('WARNINGS'), ('MASTER'), ('PROFILE'), ('PROFILES'),
	('CHARSET'), ('COLLATION'), ('SQL_MODE'), ('AUTO_INCREMENT'), ('ENGINE'), ('ENGINES'), ('FUNCTION'), ('EVENTS'), ('SLAVE'), ('GLOBAL'), ('SESSION'), ('TRIGGERS'), ('LOGS'), ('STORAGE'), ('PRIVILEGES')];

// $0 Cursor position
Autocomplete.Snippets = [
    ['Select all', 'SELECT * FROM `$0`'],
    ['Drop database', 'DROP DATABASE `$0`'],
    ['Server statics', 'SHOW PROCESSLIST;\nSHOW VARIABLES;\nSHOW STATUS;'],
    ['Profiling', 'SET profiling = 1;\nSELECT * FROM `user`;\nSHOW PROFILE;']
];