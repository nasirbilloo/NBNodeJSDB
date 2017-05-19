'use strict'
var mysql = require('mysql');

var MySQLConnection = function (connObj, poolSize) {
    if (!poolSize || poolSize == NaN) poolSize = 100;
    if (poolSize < 0) poolSize = 100;
    this.dbConfig = {
        connectionLimit: poolSize,
        host: connObj.DBHOST,
        user: connObj.DBUSER,
        password: connObj.DBPASS,
        database: connObj.DBDB      
    }
}
MySQLConnection.prototype = {
    initPool: function(cb){
        this.pool = mysql.createPool(this.dbConfig);
        cb(null, this.pool);
    },
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

module.exports = MySQLConnection;
