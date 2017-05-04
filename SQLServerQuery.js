'use strict';
var sql = require('mssql');

var SQLQuery = function (connection) {
    this.connection = connection;
};

SQLQuery.prototype = {
    query: function (strSQL, cb) {
        var self = this;
        if (!this.connection) {
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Connection Error");
            }
        }
        self.runQuery(strSQL, cb);
    },
    runQuery: function (sqlstring, cb) {
        var self = this;
        if (!self.connection) {
            return cb("invalid connection Error");
        }else{
            self.connection.query(sqlstring, function (err, recordset) {
                if (err) {
                    return cb(err + "\n SQL Statement: " + sqlstring);
                }
                return cb(null, recordset);
              //return cb("stuff");
            });
        }
    },
};

module.exports = SQLQuery;
