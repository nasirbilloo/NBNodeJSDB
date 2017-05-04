'use strict';
var sql = require('mssql');

var SQLConnection = function (ConnObj) {
    this.user = ConnObj.DBUSER;
    this.password = ConnObj.DBPASS;
    this.host = ConnObj.DBHOST;
    this.instance = ConnObj.DBINSTANCE;
    this.connectionRetry = ConnObj.CONNECTION_RETRY;
    //this.port = strPort;
    this.db = ConnObj.DBDB;
    this.connection = null;
    this.connected = false;
    this.dbConfig = {
        server: this.host,
        user: this.user,
        password: this.password,
        database: this.db,
        option: {
            instanceName: this.instance
        }
    };
};

SQLConnection.prototype = {
        connect: function (cb, count) {
            if (!count) count = 0;
            //console.log("Count: " + count);
            var self = this;
            if (!self.connection) {
                self.connected = false;
                var config = this.dbConfig;
                self.connection = new sql.Connection(config, function (err) {
                    if (err) {
                        var n = String(err).indexOf("Error Establishing Connection");
                        var m = String(err).indexOf("Failed to connect");
                        var o =  String(err).indexOf("Connection Lost");
                        if ((n > -1 || m > -1 || o > -1) && count < 5){
                            count++;
                            setTimeout(function(){
                                self.connection = new sql.Connection(config, function(err){
                                    if (err){
                                        return cb(err);
                                    }else{
                                        return cb(null, self);
                                    }
                                });
                            }, this.connectionRetry * 1000);
                        }else{
                            return cb(err);
                        }
                        
                        //return cb(err);
                    } else {
                        self.connected = true;
                        return cb(null, self);
                    }
                });
            } else {
                return cb(null, self);
            }
        },
        getConnection: function (cb) {
            return this.connect(cb);
            //return cb(null, this);
        },
        disconnect: function (cb) {
            var self = this;
            if (self.connection) {
                self.connection.close(function () {
                    self.connection = null;
                });
            }
            if (cb) cb(null, "disconnected");
        },
        release: function (cb) {
            this.disconnect(cb);
        },
        execute: function (procname, cb) {
            if (!this.connection) {
                return cb("Invalid Connection");
            } else {
                var request = new sql.Request(this.connection);
                //request.input('retident', 1);
                request.output('output_parameter', sql.Int);
                request.execute(procname, function (err, recordsets, returnValue) {
                    cb(null, returnValue);
                });
            }
        },
        query: function (strSQL, cb) {
            var self = this;
            if (!this.connection) {
                return cb("Invalid Connection");
            } else {
                try{
                var request = new sql.Request(this.connection);
                request.query(strSQL, function(err, result){
                    if (err){
                        return cb(err);
                    }else{
                        return cb(null, result);
                    }          
                });
                }catch(err){
                    var n = string(err).indexOf("Error Establishing Connection");
                    var m = string(err).indexOf("Connection Lost");                    
                    if (n > -1 || m > -1){
                        setTimeout(self.query(strSQL, cb), 1500);
                    }else{
                        return cb(err);
                    }
                }
            };
        }
    }

module.exports = SQLConnection;
