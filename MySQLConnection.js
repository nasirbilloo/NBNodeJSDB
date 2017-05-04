'use strict'
var mysql = require('mysql');

var MySQLConnection = function (connObj, poolSize, debug) {
    if (!poolSize || poolSize == NaN) poolSize = 100;
    if (poolSize < 0) poolSize = 100;
    this.pool = mysql.createPool({
        connectionLimit: poolSize,
        host: connObj.DBHOST,
        user: connObj.DBUSER,
        password: connObj.DBPASS,
        database: connObj.DBDB
    });
    debug ? this.debug = debug : this.debug = false;
}
MySQLConnection.prototype = {
    getConnection: function (cb) {
        var self = this;
        self.pool.getConnection(function (err, connection) {
            if (err) {
                return cb(err, null);
            } else {
                return cb(null, connection);
            }
        });
    },
}

module.exports = mySQLConnection;
