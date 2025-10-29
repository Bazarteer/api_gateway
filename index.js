const express = require('express');

const app = express();
const port = 3000;
require('dotenv').config();


const userRouter = require('./routes/user');

app.use(express.json());

app.use('/user', userRouter);

app.listen(port, () => {
    console.log("Evo me na " + port);
})