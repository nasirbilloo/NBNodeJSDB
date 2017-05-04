'use strict';
var sql = require('mssql');

var SQLServerTable = function(connection, strTable){
    this.table = strTable;
    this.connection = connection;
};

SQLServerTable.prototype = {
    findAll: function(cb){
        var self = this;
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Connection Error");
            }
        }
        var strSQL = "select * from " + self.table;
        self.runQuery(strSQL, cb);
    },
    find: function(object, cb){
      return this.findFew(object, cb);  
    },
    findFew: function(object,cb){
        var self = this;
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Connection Error");
            }
        }

        var strSQL = "select * from " + self.table ;
        var x = 0;
        for (var key in object){
            if (x++ > 0){
                strSQL += " and "
            }else{
                strSQL += " where ";
            }
            strSQL += key + "  " + object[key];
        }
        this.runQuery(strSQL, cb);
    },
    findOne: function(obj,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }
        if (!obj['id'])
            return cb(null, null);
        var strSQL = "select * from " + self.table + " where id=" + obj['id'];
        self.runQuery(strSQL, cb);
    },
    insert: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "insert into " + self.table + " (";
        var x =0;
        for (var key in object){
            if (x++ > 0){
                strSQL += ","
            }else{
                strSQL += "";
            }
            strSQL += key + " "
        }
        strSQL += ") values (";

        x = 0;
        for (key in object){
            if (x++ > 0){
                strSQL += ",'"
            }else{
                strSQL += "'";
            }
            strSQL += object[key] + "'";
        }
        strSQL += ")";
        self.runCUDQuery(strSQL, cb);
    },
    update: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "update " + self.table + " set ";
        var x = 0;
        for (var key in object)
        {
            if (key == "id"){continue;}
            if (x++ > 0){
                strSQL += ","
            }

            if (object[key]){
            strSQL += key + "='" + object[key] + "' ";
            }else{
                strSQL += key + "=" + object[key] + " ";
            }
        }
        strSQL += " where ID='" + object['id'] + "' ";
        self.runCUDQuery(strSQL, cb);
    },
    updateWithCompare: function(originalObj, newObj, cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var x = 0;
        var strSQL = "update " + self.table + " set ";
        for (var key in originalObj){
            if (key == "id"){continue;}
            if (originalObj[key] && newObj[key]){
                if (originalObj[key] === newObj[key]){
                    continue;
                }else{
                    if (x++ > 0){
                        strSQL += ",";
                    }
                    
                    strSQL += key + " = '" + newObj[key] + "' ";
                }
            }else{
                continue;
            }
        }
        var idValue = originalObj['id'];
        if (!idValue)
            idValue = originalObj['ID'];
        if (!idValue){
            return cb("Invalid ID provided: " + idValue);
        }
        strSQL += " where ID='" + idValue + "' ";
        if (x < 1){
            return cb(null, originalObj);
        }
        else{
            self.runCUDQuery(strSQL, cb);
        }
    },
    remove: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "delete from " + self.table;
        var x = 0;
        strSQL += " where ";
        strSQL += " id = " + object['id'] + " ";
        self.runCUDQuery(strSQL, cb);
    },
    count: function(object,cb){
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        var strSQL = "select count(*) nasir from " + self.table ;
        var x = 0;
        for (var key in object){
            if (x++ > 0){
                strSQL += " and "
            }else{
                strSQL += " where ";
            }
            strSQL += key + " " + object[key] + " ";
        }
        self.runQuery(strSQL, cb);
    },
    exists: function(object, cb){
        if (!object || !object['id']){
            return cb(null, false);
        }
        var self = this;
        if (!self.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid Error");
            }
        }

        self.count({'id':"=" + object['id']}, function(err, result){
            if (err){
                return cb(err, null);
            }else{
                if (result[0]['nasir'] > 0){
                    return cb(null, true);
                }else{
                    return cb(null, false);
                }
            }
        });
    },
    getName: function(obj,cb){
        var self = this;
        if (!this.connection){
            if (!cb) {
                return ("Invalid Connection");
            } else {
                return cb("invalid connection Error");
            }
        }

        var strSQL = "select name from " + self.table + " where id=" + obj['id'];
        self.runQuery(strSQL, cb);
    },
    runQuery: function(sqlstring,cb){
        var request = new sql.Request(this.connection);
        request.query(sqlstring, function(err, recordset){
            if (err){
                //logger.error(err);
            }
            cb(err, recordset);
        });
    },
    runCUDQuery: function(sqlstring,cb){
        var retval = '';
        var request = new sql.Request(this.connection);
        request.query(sqlstring, function(err, recordset){
            if (err){
                //logger.error('Error: ' + err);
            } else {
                cb(err, recordset);
            }
        });
    }
};

module.exports = SQLServerTable;
