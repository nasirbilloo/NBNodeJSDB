'use strict';

var sql = require('mysql');

var MySQLTable2 = function (strTable, idFields, dbConn) {
    this.table = strTable;
    this.userID = 'SYS';
    idFields ? this.idFields = idFields : this.idFields = ['id']; //Array
    this.dbConn = dbConn;
};

MySQLTable2.prototype = {
    setConnection: function(conn){
        this.dbConn = conn;
    },    
    getIdWhereClause: function (data) {
        var ret = "";
        var count = 0;
        this.idFields.forEach(function (item) {
            if (count > 0) ret += " and "
            ret += item + " = '" + data[item] + "' ";
            count++;
        });
        return ret;
    },
    findAll: function (cb) {
        var self = this;
        var strSQL = "select * from " + self.table;
        self.runQuery(strSQL, cb);
    },
    find: function (object, cb) {
        return this.findFew(object, cb);
    },
    findFew: function (object, cb) {
        var self = this;
        var strSQL = "select * from " + self.table;
        var x = 0;
        for (var key in object) {
            if (x++ > 0) {
                strSQL += " and "
            } else {
                strSQL += " where ";
            }
            strSQL += key + "  " + object[key];
        }
        self.runQuery(strSQL, cb);
    },
    findOne: function (obj, cb) {
        var self = this;

        self.isNullIdField(obj, function (err, isNull) {
            if (err) {
                return cb("Primary Key can't be null");
            } else {
                var strSQL = "select * from " + self.table + " where " + self.getIdWhereClause(obj);
                self.runQuery(strSQL, cb);

            }
        });

    },
    insert: function (object, cb) {
        var self = this;

        var strSQL = "insert into " + self.table + " (";
        var x = 0;
        for (var key in object) {
            if (x++ > 0) {
                strSQL += ","
            } else {
                strSQL += "";
            }
            strSQL += key + " "
        }
        strSQL += ") values (";

        x = 0;
        for (key in object) {
            if (object[key]) {
                if (x++ > 0) {
                    strSQL += ",'"
                } else {
                    strSQL += "'";
                }
                strSQL += object[key] + "'";
            } else {
                if (x++ > 0) {
                    strSQL += ",NULL"
                } else {
                    strSQL += "NULL";
                }
            }
        }
        strSQL += ")";
        self.runCUDQuery(strSQL, cb);
    },
    isIdField: function (key) {

        if (this.idFields.indexOf(key) > -1) return true;
        return false;

        //return false;
    },
    mergeObjects: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    },
    update: function (object, cb) {
        var self = this;

        var strSQL = "update " + self.table + " set ";
        var x = 0;
        for (var key in object) {
            if (self.isIdField(key)) {
                continue;
            }
            if (x++ > 0) {
                strSQL += ","
            }

            if (object[key]) {
                strSQL += key + "='" + object[key] + "' ";
            } else {
                strSQL += key + "=NULL ";
            }
        }
        strSQL += " where " + self.getIdWhereClause(object);
        self.runCUDQuery(strSQL, cb);
    },
    updateWithCompare: function (originalObj, newObj, cb) {
        var self = this;
        var x = 0;
        var strSQL = "update " + self.table + " set ";
        //var tempObj = self.mergeObjects(originalObj, newObj);

        for (var key in originalObj) {
            if (self.isIdField(key)) {
                continue;
            }
            //DON'T JUDGE ME
            //I must have done this in my lowest, most vulnerable state
            //Seriously, don't judge me.
            if (self.table.toLowerCase() == "people") {
                if (key.toLowerCase() == "departmentid" || key.toLowerCase() == "manager" || key.toLowerCase() == "authorized") {
                    continue;
                }
            }
            /*
                if newObj[key] is null, set the originalObj[key] to null
                if the originalObj[key] is null, add the newObj[key] to strSQL
            */
            //MAKE SURE THE FIELD NAMES ARE THE SAME CASE OR THE BELOW CHECKS FAIL!
            if (originalObj[key] && newObj[key]) { //Both Fields exist
                if (originalObj[key] == newObj[key]) { //Both Fields are the same
                    continue;
                } else {
                    if (x++ > 0) {
                        strSQL += ",";
                    }
                    if (!newObj[key]) { //Both Fields exist, but the value of newObj is null
                        strSQL += key + " = NULL ";
                    } else {
                        strSQL += key + " = '" + newObj[key] + "' ";
                    }
                }
            } else { // One of them is null
                if (x++ > 0) {
                    strSQL += ",";
                }
                if (!newObj[key]) {
                    strSQL += key + " = NULL ";
                } else {
                    strSQL += key + " = '" + newObj[key] + "' ";
                }
            }
        }
        strSQL += " where " + self.getIdWhereClause(originalObj);
        if (x < 1) { //Nothing to update, bailing
            return cb(null, originalObj);
        } else {
            self.runCUDQuery(strSQL, cb);
        }
    },
    remove: function (object, cb) {
        var self = this;

        var strSQL = "delete from " + self.table;
        var x = 0;
        strSQL += " where ";
        strSQL += self.getIdWhereClause(object)
        self.runCUDQuery(strSQL, cb);
    },
    count: function (object, cb) {
        var self = this;

        var strSQL = "select count(*) nasir from " + self.table;
        var x = 0;
        for (var key in object) {
            if (x++ > 0) {
                strSQL += " and "
            } else {
                strSQL += " where ";
            }
            strSQL += key + " " + object[key] + " ";
        }
        self.runQuery(strSQL, cb);
    },
    getIdObject: function (obj) {
        var retObj = {};
        this.idFields.forEach(function (idField) {
            retObj[idField] = obj[idField]
        });
        return retObj;
    },
    getIdObjectWithOperators: function (obj) {
        var retObj = {};
        this.idFields.forEach(function (idField) {
            retObj[idField] = "='" + obj[idField] + "'";
        });
        return retObj;
    },
    isNullIdField: function (obj, cb) {
        var self = this;
        if (!obj) return true;
        var count = 0;
        var len = this.idFields.length;
        this.idFields.forEach(function (idField) {
            if (count++ > len) {
                return cb(null, false);
            }
            if (!obj.hasOwnProperty(idField)) {
                return cb(null, true);
            } else if (typeof obj[idField] == "undefined") {
                return cb(null, true);
            } else if (!obj[idField]) {
                return cb(null, true);
            } else if (count >= len) {
                return cb(null, false);
            }
        });
    },
    exists: function (object, cb) {
        var self = this;
        if (!object) {
            return cb(null, false);
        }
        self.isNullIdField(object, function (err, isNull) {
            if (!isNull) {
                self.count(self.getIdObjectWithOperators(object), function (err, result) {
                    if (err) {
                        return cb(err, null);
                    } else {
                        if (result[0]['nasir'] > 0) {
                            return cb(null, true);
                        } else {
                            return cb(null, false);
                        }
                    }
                });
            } else {
                return cb(null, false);
            }
        });
    },
    getName: function (obj, cb) {
        var self = this;

        var strSQL = "select name from " + self.table + " where " + self.getIdWhereClause(obj)
        self.runQuery(strSQL, cb);
    },
    runQuery: function (sqlstring, cb) {
        var self = this;

        if (!self.dbConn) {
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }
        self.dbConn.query(sqlstring, function (err, rows, fields) {
            if (err) {
                var n = String(err).indexOf("Error Establishing Connection");
                var m = String(err).indexOf("Failed to connect");
                var o = String(err).indexOf("Connection lost - read ECONNRESET");
                if (n > -1 || m > -1 || o > -1) {
                    console.error("MySQLTable2: Connection Error, retrying in 2 seconds");
                    setTimeout(function(){self.runQuery(self.dbConn, sqlstring, cb)}, 2000);
                } else {
                    return cb(err);
                }
            } else {
                return cb(null, rows);
            }
        });
    },
    runCUDQuery: function (sqlstring, cb) {
        var self = this;

        if (!self.dbConn) {
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }
        //var cb = req.query['callback'];
        var retval = '';
        self.dbConn.query(sqlstring, function (err, rows, fields) {
            if (err) {
                var n = String(err).indexOf("Error Establishing Connection");
                var m = String(err).indexOf("Failed to connect");
                var o = String(err).indexOf("Connection Lost");
                if (n > -1 || m > -1 || o > -1) {
                    console.error("Connection Error, retrying in 2 seconds");
                    setTimeout(function(){self.dbConn.query(sqlstring, function (err, rows, fields){
                        if (err){
                            return cb(err);
                        }else{
                            return cb(null, rows);
                        }
                    });}, 2000);
                } else {
                    return cb(err);
                }
            } else {
                return cb(null, rows);
            }
        });

    }
};

module.exports = MySQLTable2;
