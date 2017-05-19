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
        initPool: function(cb){
            this.pool = new sql.Connection(this.dbConfig, function(err){
                if (err){
                    cb(err);
                }
                else{
                    this.poo.connect(function(err){
                        if (err){
                            cb(err);
                        }else{
                            return cb(null, this.pool);
                        }
                    })
                }
            });
        },
        getConnection: function (cb) {
            return cb(null, this.pool);
        },

        execute: function (procname, cb) {
            var request = new sql.Request(this.pool);
            //request.input('retident', 1);
            request.output('output_parameter', sql.Int);
            request.execute(procname, function (err, recordsets, returnValue) {
                cb(null, returnValue);
            });
        },
        query: function (strSQL, cb) {
            var self = this;
            var request = new sql.Request(this.pool);
            request.query(strSQL, function(err, result){
                if (err){
                    return cb(err);
                }else{
                    return cb(null, result);
                }          
            });
        }
    }

module.exports = SQLConnection;
