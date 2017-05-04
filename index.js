'use strict';

module.exports.DBConnectionFactory = requier("./db/DBConnectionFactory");
module.exports.GenericSimpleModel = requier("./db/GenericSimpleModel");
module.exports.MySQLConnection = require("./db/MySQLConnection");
module.exports.MySQLQuery = require("./db/MySQLQuery");
module.exports.MySQLTable = require("./db/MySQLTable");
module.exports.MySQLTable2 = require("./db/MySQLTable2");
module.exports.SQLServerConnection = require("./db/SQLServerConnection");
module.exports.SQLServerQuery = require("./db/SQLServerQuery");
module.exports.SQLServerTable = require("./db/SQLServerTable");
module.exports.SQLServerTable2 = require("./db/SQLServerTable2");

module.exports.AuthHelper = require("../routes/AuthHelper");
module.exports.authRoute = require("../routes/authRoute");
module.exports.expressLogger = require("../routes/expressLogger");
module.exports.LoggerFactory = require("../routes/LoggerFactory");
module.exports.RouteFactory = require("../routes/RouteFactory");
module.exports.RouteHelper = require("../routes/RouteHelper");
module.exports.SimpleCrudHandler = require("../routes/SimpleCrudHandler");

module.exports.printMsg = function(){
    console.log("NB NodeJS Helper");
}
