"use strict";

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;
    
var Search = new Schema({
    term: String,
    timestamp: Number
});

module.exports = mongoose.model("Search", Search);