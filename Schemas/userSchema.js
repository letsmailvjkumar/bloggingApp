const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: 'string',
    },
    email: {
        type: 'string',
        required: true,
        unqiue: true
    },
    username: {
        type: 'string',
        required: true,
        unqiue: true
    },
    password: {
        type: 'string',
        required: true,
    }
})

module.exports = mongoose.model("user", userSchema)