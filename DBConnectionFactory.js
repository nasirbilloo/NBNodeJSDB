'use strict';

var MySQLConnection = require('./MySQLConnection');
var MySQLTable2 = require('./MySQLTable2');
var MySQLQuery = require('./MySQLQuery');
var SQLServerConnection = require('./SQLServerConnection');
var SQLServerTable2 = require('./SQLServerTable2');
var SQLServerQuery = require('./SQLServerQuery');
var GenericSimpleModel = require('./GenericSimpleModel');

var DBConnectionFactory = function (connObj) {
    this.DBTypes = {
        MySQL: "MySQL",
        SQLServer: "SQLServer"
    }
    this.connObj = connObj;
    this.dbConn = null;
    this.sqlConverter = null;
}
DBConnectionFactory.prototype = {
    setConnectionParameters: function (connObj) {
        this.connObj = connObj;
    },
    setSQLConverter: function (converter) {
        this.sqlConverter = converter;
    },
    getConnectionParameters: function () {
        return this.connObj;
    },
    getSQLConverter: function () {
        return this.sqlConverter;
    },
    initConnection: function (cb) {
        var self = this;
        if (!self.connObj) {
            return cb("Invalid Connection Parameters");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn = new MySQLConnection(self.connObj);
                return self.dbConn.getConnection(cb);
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                self.dbConn = new SQLServerConnection(self.connObj);
                return self.dbConn.getConnection(cb);
            } else {
                return cb("Invalid DB Type")
            }
        }
    },
    getConnection: function (cb) {
        var self = this;
        if (!self.connObj) {
            return cb("Invalid Connection Parameters");
        } else {
            if (self.dbConn) {
                if (self.connObj.DBTYPE == self.DBTypes.MySQL) {                
                    return self.dbConn.getConnection(cb);
                } if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                    return cb(null, self.dbConn);
                }else{
                    return cb("Invalid DB Type")
                }
            } else {
                return self.initConnection(cb);
            }
        }
    },
    releaseConnection: function (cb) {
        var self = this;
        if (!self.dbConn) {
            return cb("Invalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn.release();
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                self.dbConn.release();
            }
        }
    },
    getSQLTable: function (tableName, idFields, cb) {
        var self = this;
        var table = null;
        if (!self.dbConn) {
            return cb("Invalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn.getConnection(function(err, conn){
                    if (err){
                        return cb(err);
                    }else{
                        table = new MySQLTable2(tableName, idFields, conn);
                        return cb(null, table);                        
                    }
                });
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                table = new SQLServerTable2(tableName, idFields, self.dbConn);
                return cb(null, table);
            } else {
                return cb("Invalid DB Type")
            }
        }
    },
    getSQLQuery: function (cb) {
        var self = this;
        var query = null;
        if (!self.dbConn) {
            return cb("Invalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn.getConnection(function(err, conn){
                    if (err){
                        return cb(err);
                    }else{                
                        query = new MySQLQuery(conn);
                        return cb(null, query);
                    }
                });
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                query = new SQLServerQuery(self.dbConn);
                return cb(null, query);
            } else {
                return cb("Invalid DB Type")
            }
        }
    },
    getSQLModel: function (tableName, idFields, cb) {
        var self = this;
        var model = null;
        if (!self.dbConn) {
            return cb("Invalid Connection");
        } else {
            self.getSQLTable(tableName, idFields, function (err, table) {
                if (err) {
                    return cb(err);
                } else {
                    var model = new GenericSimpleModel(table);
                    return cb(null, model);
                }
            });
        }
    }
};

var dbConnFactory = new DBConnectionFactory();

module.exports = dbConnFactory;