'use strict';
const mongoose = require('mongoose'),
      schema   = mongoose.Schema,
    todo = new schema({
        email: String,
        title: String,
        date: String,
        whatToDo: String
    },{strict: true});

let ToDo = mongoose.model('ToDo', todo);

module.exports = ToDo;