const pool = require('./db_pool');
module.exports = {
    checkUsername: async(authRequest) => {
        const query = "SELECT * FROM users WHERE MD5(username) = ?";

        try{
            const [results, fields] = await pool.query(query, [authRequest]);
            var result = true;

            if(results.length == 1){
                result = true;
            } else {
                result = false;
            }
            return{
                isErr: false,
                result: result,
                data: result
            };
        } catch(err) {
            console.log("checkUsername error:", err);
            return{
                isErr: true,
                errMessage: err.message,
            }
            
        }
    },

    accessRequest: async (authSignature) => {
        const query = "SELECT a.user_id, a.username, a.first_name, a.last_name, a.role_id" 
            + " FROM users a JOIN roles b ON a.role_id = b.role_id"
            + " WHERE MD5(CONCAT(username, '&', password)) = ?";
    
        try{
            const [results, fields] = await pool.query(query, [authSignature]);
            var result = true;

            if(results.length == 1){
            result = true;
            } else {
            result = false;
            }
            return{
                isErr: false,
                result: result,
                data: results[0]
            };
        } catch(err) {
            return{
                isErr: true,
                errMessage: err.message
            };

        }
    }
};



