var jwt = require('jsonwebtoken');
var hiddenKey = 'My_hidden_key';

module.exports = {
    sign(payload){
        let authenKey = jwt.sign(payload, hiddenKey, {
            expiresIn: '1d'
        });
        return authenKey;
    },

    verify(authenKey){
        return new Promise((resolve, reject) => {
            jwt.verify(authenKey, hiddenKey, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}