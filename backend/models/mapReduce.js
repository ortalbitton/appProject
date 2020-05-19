const mongoose = require("mongoose");


module.exports = mongoose.model('titles',
  mongoose.Schema({
    _id: String,
    value: Number
  }),
  'mapReduce'); //mapReduce is collection Which contains the results of the query mapReduce found in routes/advertisements.js
//not a new collection