const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const productClient = require('../grpc/ProductClient')


router.post('/publish', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token missing' });

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        } catch (e) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const product_data = {
            userId: decoded.userId,
            username: decoded.username,
            name: req.body.name,
            description: req.body.description,
            condition: req.body.condition,
            location: req.body.location,
            price: req.body.price,
            stock: req.body.stock,
            content_urls: req.body.content_urls
        }

        productClient.publish(product_data, (err, grpcResponse) => {
            if (err) {
                console.error('gRPC update error:', err);
                const grpcErrStatus = err.code;
                switch (grpcErrStatus) {
                    case 13:
                        return res.status(500).json({ error: 'Internal server error' });
                    default:
                        return res.status(500).json({ error: 'Unexpected error' });
                }
            }

            res.status(200).json({ message: 'Product published succesfully' });
        })

    } catch (error) {
        console.error("Error publishing a product: ", error);
        res.status(500).json({ error: 'Error publishing a product' });
    }
})

module.exports = router;