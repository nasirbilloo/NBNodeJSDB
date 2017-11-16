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
    this.debug = false;
}
DBConnectionFactory.prototype = {
    setConnectionParameters: function (connObj, cb) {
        if (this.debug) console.log("In DBConnectionFactory: setConnectionParameters");
        this.connObj = connObj;
        this.initConnectionPool(function (err, conn) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, conn);
            }
        })
    },
    setSQLConverter: function (converter) {
        if (this.debug) console.log("In DBConnectionFactory: setSQLConverter");        
        this.sqlConverter = converter;
    },
    getConnectionParameters: function () {
        if (this.debug) console.log("In DBConnectionFactory: getConnectionParameters");        
        return this.connObj;
    },
    getSQLConverter: function () {
        if (this.debug) console.log("In DBConnectionFactory: getSQLConverter");        
        return this.sqlConverter;
    },
    initConnectionPool: function (cb) {
        if (this.debug) console.log("In DBConnectionFactory: initConnectionPool");        
        var self = this;
        if (!self.connObj) {
            return cb("DBConnectionFactory - initConnectionPool: \nInvalid Connection Parameters");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn = new MySQLConnection(self.connObj);
                self.dbConn.initPool(function (err, result) {
                    if (err){
                        return cb(err);
                    }
                    return self.dbConn.getConnection(cb);
                })
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                self.dbConn = new SQLServerConnection(self.connObj);
                self.dbConn.initPool(function (err, result) {
                    if (err){
                        return cb(err);
                    }
                    return self.dbConn.getConnection(cb);
                });
            } else {
                return cb("DBConnectionFactory - initConnectionPool: \nInvalid DB Type")
            }
        }
    },
    getConnection: function (cb) {
        if (this.debug) console.log("In DBConnectionFactory: getConnection");        
        var self = this;
        if (!self.connObj) {
            return cb("DBConnectionFactory - getConnection: \nInvalid Connection Parameters");
        } else {
            if (self.dbConn) {
                return self.dbConn.getConnection(cb);
            } else {
                return self.initConnectionPool(cb);
            }
        }
    },
    releaseConnection: function (cb) {
        if (this.debug) console.log("In DBConnectionFactory: releaseConnection");        
        var self = this;
        if (!self.dbConn) {
            return cb("DBConnectionFactory - releaseConnection: \nInvalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn.release();
            }
        }
    },
    getSQLTable: function (tableName, idFields, doNotUpdateFields, cb) {
        if (this.debug) console.log("In DBConnectionFactory: getSQLTable");        
        var self = this;
        var table = null;
        var SQLTableType = null;
        if (!self.dbConn) {
            return cb("DBConnectionFactory - getSQLTable: \nInvalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                SQLTableType = MySQLTable2;
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                SQLTableType = SQLServerTable2;
            } else {
                return cb("DBConnectionFactory - getSQLTable: \nInvalid DB Type")
            }
            self.getConnection(function (err, conn) {
                if (err) {
                    return cb(err);
                } else {
                    table = new SQLTableType(tableName, idFields, doNotUpdateFields, conn);
                    return cb(null, table);
                }
            });
        }
    },
    getSQLQuery: function (cb) {
        if (this.debug) console.log("In DBConnectionFactory: getSQLQuery");        
        var self = this;
        var query = null;
        var SQLQueryType = null;
        if (!self.dbConn) {
            return cb("DBConnectionFactory - getSQLQuery: \nInvalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                SQLQueryType = MySQLQuery;
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                SQLQueryType = SQLServerQuery;
            } else {
                return cb("DBConnectionFactory - getSQLQuery: \nInvalid DB Type")
            }
            self.getConnection(function (err, conn) {
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, new SQLQueryType(conn));
                }
            });
        }
    },
    executeSQLQuery: function (strSQL, cb) {
        if (this.debug) console.log("In DBConnectionFactory: executeSQLQuery");        
        var self = this;
        self.getSQLQuery(function (err, myQuery) {
            if (err) {
                cb(err);
            } else {
                myQuery.query(strSQL, function (err, results) {
                    if (err) {
                        //this.releaseConnection();
                        return cb(err);
                    } else {
                        return cb(null, results)
                    }
                });
            }
        });
    },
    getSQLModel: function (tableName, idFields, doNotUpdateFields, cb) {
        if (this.debug) console.log("In DBConnectionFactory: getSQLModel");        
        var self = this;
        var model = null;
        if (!self.dbConn) {
            return cb("DBConnectionFactory - getSQLModel: \nInvalid Connection");
        } else {
            self.getSQLTable(tableName, idFields, doNotUpdateFields, function (err, table) {
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