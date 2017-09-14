'use strict';
var sql = require('mssql');

var SQLConnection = function (ConnObj, poolSize) {
    if (!poolSize || poolSize == NaN) poolSize = 100;
    if (poolSize < 0) poolSize = 100;

    this.dbConfig = {
        user: ConnObj.DBUSER,
        password: ConnObj.DBPASS,
        server: ConnObj.DBINSTANCE ? ConnObj.DBHOST + "\\" + ConnObj.DBINSTANCE : ConnObj.DBHOST,
        database: ConnObj.DBDB,
        pool: {
            min: poolSize,
            max: poolSize
        }
    };
    this.pool = null;
    this.debug = false;
};

SQLConnection.prototype = {
    initPool: function (cb) {
        if (this.debug) console.log("In SQLConnection: initPool");
        if (this.debug) console.dir(this.dbConfig);
        var self = this;
        self.pool = new sql.ConnectionPool(self.dbConfig);
        self.pool.connect(function (err) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, self);
            }
        });
    },
    getConnection: function (cb) {
        if (this.debug) console.log("In SQLConnection: getConnection");
        var self = this;
        if (!this.pool) {
            return initPool(cb);
        } else if (!this.pool.connected) {
            self.pool.connect(function (err) {
                if (err) {
                    cb(err);
                } else {
                    return cb(null, self);
                }
            });
        }
        return cb(null, this);
    },

    execute: function (procname, cb) {
        if (this.debug) console.log("In SQLConnection: execute");        
        var request = this.pool.request();
        //request.input('retident', 1);
        request.output('output_parameter', sql.Int);
        request.execute(procname, function (err, recordsets, returnValue) {
            cb(null, returnValue);
        });
    },
    query: function (strSQL, cb) {
        if (this.debug) console.log("In SQLConnection: query");
        var self = this;
        if (!this.pool.connected) {
            if (self.debug) console.log("FUCK");
            return cb("FUCK");
        }
        try {
            self.pool.request().query(strSQL, function (err, result) {
                if (err) {
                    return cb(err);
                }
                return cb(null, result.recordset);
            });
        } catch (err) {
            return cb(err);
        }
    }
}

module.exports = SQLConnection;
