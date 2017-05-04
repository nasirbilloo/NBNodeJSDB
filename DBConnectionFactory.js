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
    setSQLConverter: function(converter){
        this.sqlConverter = converter;
    },
    getConnectionParameters: function(){
        return this.connObj;
    },
    getSQLConverter: function(){
        return this.sqlConverter;
    },
    initConnection: function (cb) {
        var self = this;
        if (connObj.DBTYPE = this.DBTYpes.MySQL) {
            self.dbConn = new MySQLConnection(self.connObj);
            return cb(null, self.dbConn.getConnection());
        } else if (connObj.DBTYPE = this.DBTYpes.SQLServer) {
            self.dbConn = new SQLServerConnection(self.connObj);
            return cb(null, self.dbConn.getConnection());
        } else {
            return cb("Invalid DB Type")
        }
    },
    getConnection: function (cb) {
        if (!connObj) {
            return cb("Invalid Connection Parameters");
        } else {
            if (dbConn) {
                return cb(null, dbConn);
            } else {
                return initConnection(cb);
            }
        }
    },
    releaseConnection: function(cb){
        if (connObj.DBTYPE = this.DBTYpes.MySQL) {
            self.dbConn.release();
        } else if (connObj.DBTYPE = this.DBTYpes.SQLServer) {
            self.dbConn.release();
        }         
    },
    getSQLTable: function (tableName, idFields, cb) {
        var self = this;
        var table = null;
        if (!connObj) {
            return cb("Invalid Connection Parameters");
        } else {
            if (connObj.DBTYPE = this.DBTYpes.MySQL) {
                table = new MYSQLTable2(tableName, idFields, self.dbConn);
                return cb(null, table);
            } else if (connObj.DBTYPE = this.DBTYpes.SQLServer) {
                table = new SQLServerTable2(tableName, idFields, self.dbConn);
                return cb(null, table);
            } else {
                return cb("Invalid DB Type")
            }
        }
    },
    getSQLQuery: function(cb){
        var self = this;
        var query = null;
        if (!connObj) {
            return cb("Invalid Connection Parameters");
        } else {
            if (connObj.DBTYPE = this.DBTYpes.MySQL) {
                query = new MYSQLQuery(self.dbConn);
                return cb(null, query);
            } else if (connObj.DBTYPE = this.DBTYpes.SQLServer) {
                query = new SQLServerQuery(self.dbConn);
                return cb(null, query);
            } else {
                return cb("Invalid DB Type")
            }
        }        
    }, 
    getSQLModel: function(tableName, idFields, cb){
        var self = this;
        var model = null;
        if (!connObj) {
            return cb("Invalid Connection Parameters");
        } else {
            self.getSQLTable(tableName, idFields, function(err, table){
                if (err){
                    return cb(err);
                }else{
                    var model = new GenericSimpleModel(table);
                    return cb(null, model);                   
                }
            });            
        }
    }
};

dbConnFactory = new DBConnectionFactory();

module.exports = dbConnFactory;