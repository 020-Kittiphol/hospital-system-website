const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hospital'
});

var myQuery = "SELECT * FROM users WHERE role_id = ? AND username = ?";

con.execute(myQuery,
    []
)