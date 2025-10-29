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
                console.log('gRPC Register error: ', err);
                return res.status(500).json({error: 'Failed to register user'});
            }
            const jsonwt = jwt.sign({userId: grpcResponse.userId, username: grpcResponse.username}, process.env.JWT_PRIVATE_KEY)
            res.status(200).json(jsonwt);
        })


    } catch(error){
        console.error("Error registering an user: ", error);
        res.status(500).send("Error registering an user");
    }
})

module.exports = router;