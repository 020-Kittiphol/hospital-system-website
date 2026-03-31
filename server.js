const http = require('http');
const bp = require('body-parser');
const express = require('express');
// var jwt = require('jsonwebtoken'); lib jwt
const jwt = require('./users-app/libs/jwt');
const cors = require('cors');

const users = require('./users-app/src/app/models/users');
const authen = require('./users-app/src/app/models/authen');

const app = express();
app.use(cors());
app.use(bp.urlencoded({extended: true}));
app.use(bp.json());

const hostname = '127.0.0.1';
const port = 8080;

const checkAccessToken = async (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }else if (req.query && req.query.token) {
        token = req.query.token;
    }else{
        token = req.body.token;
    }

    jwt.verify(token)
        .then((decoded) => {
            req.decoded = decoded;
            next();
        }, (err) => {
            res.json({
                isErr: true,
                result: false,
                errMessage: "ยังไม่ได้เข้าสู่ระบบ"
            });
        });
}

app.get("/api/users/all", checkAccessToken, async (req, res) => {
    var results = await users.getAllUser();
    var response ={
        isErr: false,
        data: results
    };

    res.send(JSON.stringify(response));
});

app.post("/api/authen_request", async (req, res) => {
    const authRequest = req.body.authen_request;
    console.log("body:", req.body);

    var response = {isErr: false, data: null};

    const rs = await authen.checkUsername(authRequest);
    console.log("rs:", rs);

    if(rs.isErr){
        response = {isErr: true, message: rs.errMessage};
    }else{
        if(rs.result){
            var payload = {username: authRequest};
            var hiddenKey = "My_hidden_key";
            const authenKey = jwt.sign(payload, hiddenKey);
            response = {
                isErr: false,
                result: true,
                data: authenKey
            }
        }else{
            response ={
                isErr: false,
                result: false,
                data: "ไม่พบข้อมูลผู้ใช้ในระบบ"
            }
        }
    }

    res.json(response);
});

app.post("/api/access_request", async (req, res) => {
    try {
        console.log("access_request body:", req.body);
        const authSignature = req.body.auth_signature;
        const authKey = req.body.auth_key;

        var decoded = await jwt.verify(authKey, "My_hidden_key");
        console.log("decoded:", decoded);

        if(decoded) {
            const rs = await authen.accessRequest(authSignature);

            if(rs.isErr) {
                res.json({ isErr: true, errMessage: rs.errMessage });
            } else {
                if(rs.result) {
                    var payload = {
                        user_id: rs.data.user_id,
                        username: rs.data.username,
                        first_name: rs.data.first_name,
                        last_name: rs.data.last_name,
                        role_id: rs.data.role_id,
                    };

                    const accessToken = jwt.sign(payload, "My_hidden_key");

                    res.json({
                        isErr: false,
                        result: true,
                        data: {
                            access_token: accessToken,
                            user_info: payload
                        }
                    });
                } else {
                    res.json({ isErr: false, result: false });
                }
            }
        } else {
            res.json({ isErr: false, result: false });
        }
    } catch(err) {
        console.log("access_request error:", err.message);
        res.json({ isErr: true, errMessage: err.message });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});