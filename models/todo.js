'use strict';
const mongoose = require('mongoose'),
      schema   = mongoose.Schema,
    toDo = new schema({
        name: String,
        title: String,
        date: String,
        whatToDo: String
    },{strict: true});

let ToDo = mongoose.model('ToDo', toDo);

module.exports = ToDo;