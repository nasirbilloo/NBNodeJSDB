'use strict';

//var logger = require('../../util/logger');
var DBConnectionFactory = require('./DBConnectionFactory');

var GenericSimpleModel = function (table, debug) {
    //this.strTable = table;
    this.debug = debug;
    this.Table = table;
    this.tableName = table.tableName;
    this.retID = false;
    var self = this;
};

GenericSimpleModel.prototype = {
    setDebug: function (debug) {
        this.debug = true;
        this.Table.debug = this.debug;
        console.log("TABLE DEBUG: " + this.Table.debug + " " + this.Table.tableName);
    },
    setRetID: function (retID) {
        this.retID = retID;
    },
    getAll: function (cb) {
        var self = this;
        self.Table.findAll(function (err2, results) {
            if (err2) {
                return cb(err2, null);
            }
            return cb(null, results);
        });
    },
    getSome: function (obj, cb) {
        var self = this;
        self.Table.findFew(obj, function (err2, results) {
            if (err2) {
                return cb(err2, null);
            }
            return cb(null, results);
        });
    },
    getWithID: function (itemID, itemIDName, cb) {
        var self = this;
        var obj = {};
        obj[itemIDName] = "=" + itemID;
        self.Table.findFew(obj, function (err2, results) {
            if (err2) {
                return cb(err2, null);
            }
            return cb(null, results);
        });
    },
    simpleUpdate: function (data, cb) {
        var self = this;
        self.Table.update(data, function (err3, results) {
            if (err3) {
                return cb(err3, null);
            } else {
                return cb(null, results);
            }
        });

    },
    update: function (data, cb) {
        var self = this;
        if (self.debug) logger.debug("update");
        self.Table.findOne(data, function (err1, results) {
            if (err1 || !results || results.length < 1) {
                return cb(err1);
            } else {
                self.Table.updateWithCompare(results[0], data, function (err3, results) {
                    if (err3) {
                        return cb(err3, null);
                    } else {
                        return cb(null, results);
                    }
                });
            }
        }); //FindOne
    },
    getIDCol: function (cb) { //Don't Need to do that for MySQL
        var self = this;
        var strSQL = "SELECT max(id) as insertId from " + self.Table.tableName;
        DBConnectionFactory.executeSQLQuery(strSQL, function (err, results) {
            if (err) {
                console.log(err);
                return cb(err);
            } else {
                console.log(results);
                return cb(null, results);
            }
        });
    },
    insert: function (data, cb) {
        var self = this;
        self.Table.insert(data, function (err2, results) {
            if (err2) {
                return cb(err2, null);
            } else {
                if (self.retID) {
                    return cb(null, { insertId: results.insertId });
                } else {
                    //logger.dir("done with insert");
                    return cb(null, results);
                }
            }
        });
    },
    insertOrUpdate: function (data, cb) {
        //logger.dir(data);
        var self = this;
        if (self.debug) logger.debug("insertOrUpdate");
        self.Table.exists(data, function (err1, results) {
            //logger.debug("insertOrUpdate");
            if (err1) { //Error in query
                return cb(err1, null);
            } else {
                if (!results || results.length < 1) { //Doesn't Existt
                    return self.insert(data, cb);

                } else { //Exists
                    return self.update(data, cb);
                }
            }
        });
    },
    exists: function (data, cb) {
        var self = this;
        if (self.debug) logger.debug("insertOrUpdate");
        self.Table.exists(data, function (err1, results) {
            //logger.debug("insertOrUpdate");
            if (err1) { //Error in query
                return cb(err1, null);
            } else {
                if (!results || results.length < 1) { //Doesn't Existt
                    return cb(null, false);

                } else { //Exists
                    return cb(null, true);
                }
            }
        });
    },
    removeSimple: function (data, cb) {
        var self = this;
        self.Table.remove(data, function (err3, results) {
            if (err3) {
                return cb(err3, null);
            } else {
                return cb(null, results);
            }
        });
    },
    removeIfExists: function (data, cb) {
        var self = this;
        self.Table.exists(data, function (err1, results) {
            if (err1) { //Error in query
                return cb(err1, null);
            } else {
                if (!results || results.length < 1) { //Doesn't Exist
                    return cb(null, "Can't delete, doesn't exist");
                } else { //Exists
                    self.Table.remove(data, function (err3, results) {
                        if (err3) {
                            return cb(err3, null);
                        } else {
                            return cb(null, results);
                        }
                    });
                }
            }
        });
    }
}

module.exports = GenericSimpleModel