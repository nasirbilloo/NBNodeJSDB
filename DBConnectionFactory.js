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
        this.initConnectionPool(function (err, result) {
            if (err) {
                throw (err);
            } else {
                return;
            }
        })
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
    initConnectionPool: function (cb) {
        var self = this;
        if (!self.connObj) {
            return cb("DBConnectionFactory - initConnectionPool: \nInvalid Connection Parameters");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn = new MySQLConnection(self.connObj);
                self.dbConn.initPool(function (err, result) {
                    return self.dbConn.getConnection(cb);
                })
            } else if (self.connObj.DBTYPE == self.DBTypes.SQLServer) {
                self.dbConn = new SQLServerConnection(self.connObj);
                self.dbConn.initPool(function (err, result) {
                    return self.dbConn.getConnection(cb);
                });
            } else {
                return cb("DBConnectionFactory - initConnectionPool: \nInvalid DB Type")
            }
        }
    },
    getConnection: function (cb) {
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
        var self = this;
        if (!self.dbConn) {
            return cb("DBConnectionFactory - releaseConnection: \nInvalid Connection");
        } else {
            if (self.connObj.DBTYPE == self.DBTypes.MySQL) {
                self.dbConn.release();
            }
        }
    },
    getSQLTable: function (tableName, idFields, cb) {
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
                    table = new SQLTableType(tableName, idFields, conn);
                    return cb(null, table);
                }
            });
        }
    },
    getSQLQuery: function (cb) {
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
        var self = this;
        self.getSQLQuery(function (err, myQuery) {
            if (err) {
                cb(err);
            } else {
                myQuery.query(strSQL, function (err, results) {
                    if (err) {
                        return cb(err);
                    } else {
                        return cb(null, results)
                    }
                });
            }
        });
    },
    getSQLModel: function (tableName, idFields, cb) {
        var self = this;
        var model = null;
        if (!self.dbConn) {
            return cb("DBConnectionFactory - getSQLModel: \nInvalid Connection");
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