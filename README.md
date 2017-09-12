#NBNodeJSDB - 

Node JS DB Files
#
This is a DB Wrapper that allows me to access SQL Server and MySQL in the same manner. It consists of several classes like DBConnection, DBTable, DBQuery, a rudimentary non caching ORM, a simple CRUD enabler. All of these can be accessed via the DBConnectionFactory
#
You start with DBConnectionFactory.setConnectionParameters
Pass in the conn object
#
Then for your main loop you start with
DBConnectionFactory.initConnecitonPool(function(err, result){
    if (err){
        choke...
    }else{
        run your shit here....
    }
})
#
DBConnectionFactory.getSQLTable(...): returns a table object using the given table name in the callback function
#
DBConnectionFactory.getSQLQuery(...): returns a query object using the given table name in the callback function
#
DBConnectionFactory.executeSQLQuery(...): executes a sql and returns the results object in the callback function
#
DBConnectionFactory.getSQLModel(...): returns a GenericSimpleTableModel (pseudo ORM) object using the given table name in the callback function
#
Todo: Support Promises and event listeners and not just callbacks