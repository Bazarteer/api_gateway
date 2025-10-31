const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authClient = require('../grpc/AuthClient')

router.post('/register', async (req, res) => {
    try{
        const user_data = {
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            bio: '',
            image: '',
            password: req.body.password || '',
            googleToken: req.body.googleToken || ''
        }

        authClient.register(user_data, (err, grpcResponse) => {
            if (err) {
               const grpcErrStatus = err.code;
                switch (grpcErrStatus) { //https://grpc.io/docs/guides/status-codes
                    case 6:
                        return res.status(403).json({error: 'Username already taken'});
                    case 13:
                        return res.status(500).json({error: 'Internal server error'});
                    default:
                        return res.status(500).json({error: 'Unexpected error'});
                }
            }
            const jsonwt = jwt.sign({userId: grpcResponse.userId, username: grpcResponse.username}, process.env.JWT_PRIVATE_KEY)
            res.status(200).json(jsonwt);
        })


    } catch(error){
        console.error("Error registering an user: ", error);
        res.status(500).send("Error registering an user");
    }
})

router.post('/login', async (req, res) => {
    try{
        const user_data = {
            username: req.body.username,
            password: req.body.password,
        }

        authClient.login(user_data, (err, grpcResponse) => {
            if (err) {
                const grpcErrStatus = err.code;
                switch (grpcErrStatus) { //https://grpc.io/docs/guides/status-codes
                    case 5:
                        return res.status(404).json({error: 'User not found'});
                    case 16:
                        return res.status(401).json({error: 'Invalid password'}); 
                    case 13:
                        return res.status(500).json({error: 'Internal server error'});
                    default:
                        return res.status(500).json({error: 'Unexpected error'});
                }
            }
            const jsonwt = jwt.sign({userId: grpcResponse.userId, username: grpcResponse.username}, process.env.JWT_PRIVATE_KEY)
            res.status(200).json(jsonwt);
        })

    } catch(error){
        console.error("Error signing in an user: ", error);
        res.status(500).json({error: 'Error signing in an user'});
    }
})

module.exports = router;