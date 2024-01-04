const clc = require('cli-color');
const express = require('express');
require('dotenv').config();
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);
const AuthRouter = require('./Controllers/AuthController');

// file imports
const db = require('./db');
const { mongo } = require('mongoose');

// constants
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongoDbSession({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});

// middleware 
app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

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