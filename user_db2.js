const mysql = require('mysql2/promise');

async function getUsers(){
    const con = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'hospital'
    });

    try{
        var myQuery = "SELECT * FROM users";

        const [results, fields] = await con.query(myQuery);

        console.log(results);
        return results;

    }catch(er){
        console.log(er);
    }
}
function doUser(){
    var data = getUsers();
}

doUser();
