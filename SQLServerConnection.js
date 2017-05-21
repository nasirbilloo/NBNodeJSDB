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


};

SQLConnection.prototype = {
    initPool: function (cb) {
        console.dir(this.dbConfig);
        var self = this;
        self.pool = new sql.Connection(self.dbConfig, function (err) {
            if (err) {
                cb(err);
            } else {
                self.pool.connect(function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        return cb(null, self.pool);
                    }
                })
            }
        });
    },
    getConnection: function (cb) {
        var self = this;
        if (!this.pool) {
            return initPool(cb);
        } else if (!this.pool.connected) {
            self.pool.connect(function (err) {
                if (err) {
                    cb(err);
                } else {
                    return cb(null, self.pool);
                }
            });
        }
        return cb(null, this.pool);
    },

    execute: function (procname, cb) {
        var request = this.pool.request();
        //request.input('retident', 1);
        request.output('output_parameter', sql.Int);
        request.execute(procname, function (err, recordsets, returnValue) {
            cb(null, returnValue);
        });
    },
    query: function (strSQL, cb) {
        var self = this;
        if (!this.pool.connected) {
            console.log("FUCK");
            cb("FUCK");
        }
        var request = this.pool.request();
        request.query(strSQL, function (err, result) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, result);
            }
        });
    }
}

module.exports = SQLConnection;
