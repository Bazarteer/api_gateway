const express = require('express');

const app = express();
const port = 3000;
require('dotenv').config();


const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');

app.use(express.json());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);

app.listen(port, () => {
    console.log("Evo me na " + port);
})