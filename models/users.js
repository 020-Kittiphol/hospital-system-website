const pool = require('./db_pool');

module.exports = {
    getAllUser: async() => {
        var query = "SELECT a.user_id, a.username, a.first_name, a.last_name, a.tel_num, a.address, a.email, a.role_id "
          + "FROM users a "
          + "JOIN roles b ON a.role_id = b.role_id";

        try{
            const [results, fields] = await pool.query(query);
            return {isErr: false, results: true, data: results};
        }catch(err){
            console.log(err);
            return {isErr: true, results: false, errMessage: err.message};

        }
    },
        
};