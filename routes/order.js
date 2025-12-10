const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const orderClient = require('../grpc/OrderClient')


router.post('/placeOrder', async (req, res) => {
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
        const order_data = {
            custumerId: decoded.userId,
            sellerId: req.body.sellerId,
            custumerLocation: req.body.custumerLocation,
            productLocation: req.body.productLocation,
            finalPrice: req.body.finalPrice,
            productId: req.body.productId
        }

        orderClient.placeOrder(order_data, (err, grpcResponse) => {
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

            res.status(200).json({ message: 'Order placed succesfully' });
        })

    } catch (error) {
        console.error("Error placing an order: ", error);
        res.status(500).json({ error: 'Error placing an order' });
    }
})

module.exports = router;