'use strict';
const mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    user = new schema({
        password: String,
        userName: String,
        firstName: String,
        lastName: String,
        email: String,
        date: String
    },{strict: true});

let User = mongoose.model('User', user);

module.exports = User;