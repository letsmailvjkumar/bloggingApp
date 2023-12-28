const clc = require('cli-color');
const express = require('express');
require('dotenv').config();
const AuthRouter = require('./Controllers/AuthController');
// file imports
const db = require('./db');


// constants
const app = express();
const PORT = process.env.PORT || 8000;

// middleware 
app.use(express.json());

app.get('/', (req, res) => {
    return res.send({
        status: 200,
        message: "Server is responding"
    })
})

// Routes
app.use('/auth', AuthRouter);

app.listen(PORT, () => {
    console.log(clc.yellowBright.underline(`Server listening on:${PORT}`))   
})