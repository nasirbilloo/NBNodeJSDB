'use strict';
var sql = require('mysql');

var MySQLQuery = function (connection) {
    //    logger.log("In Projects constructor");
    this.connection = connection;
};

MySQLQuery.prototype = {
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
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }
        this.connection.query(sqlstring, function (err, rows, fields) {
            if (err) {
                if (logger) logger.error("MySQLQuery.query: " + err);
                return cb(err + "\n SQL Statement: " + sqlstring);
            }
            return cb(null, rows);
        });
    },
};

module.exports = MySQLQuery;
