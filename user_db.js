const pool = require('./db_pool');

async function getUsers(){
    var myQuery = "SELECT * FROM users";
    try{
        const [results, fields] = await pool.query(myQuery);
        return results;
    } catch(er) {
        console.log(er);
    }
}

async function doUser(){
    var data = await getUsers();
    console.log("ROWS: " + data.length);
    console.log(data);
}

doUser();