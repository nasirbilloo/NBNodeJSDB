'use strict'
var mysql = require('mysql');

var MySQLConnection = function (connObj, poolSize) {
    if (!poolSize || poolSize == NaN) poolSize = 100;
    if (poolSize < 0) poolSize = 100;
    this.dbConfig = {
        connectionLimit: poolSize,
        waitForConnections: false,
        acquireTimeout: 500,
        host: connObj.DBHOST,
        user: connObj.DBUSER,
        password: connObj.DBPASS,
        database: connObj.DBDB
    }
}
MySQLConnection.prototype = {
    initPool: function (cb) {
        this.pool = mysql.createPool(this.dbConfig);
        /*
        this.pool.on('enqueue', function () {
            console.log('Waiting for available connection slot');
          });        
        this.pool.on('release', function (connection) {
            console.log('Connection %d released', connection.threadId);
          });
        */
        cb(null, this);      
    },
    getConnection: function (cb) {
        if (this.debug) console.log("In MySQLConnection: getConnection");
        var self = this;
        if (!this.pool) {
            return initPool(cb);
        } else {
            return cb(null, self);
        }
        //return cb(null, self);
    },
    query: function (strSQL, cb) {
        if (this.debug) console.log("In MySQLConnection: query");
        var self = this;
        if (!this.pool) {
            if (self.debug) console.log("FUCK");
            return cb("FUCK");
        } else {
            self.pool.query(strSQL, function (err, rows, fields) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, rows);
                }
            });
        }
    }
}

module.exports = MySQLConnection;
