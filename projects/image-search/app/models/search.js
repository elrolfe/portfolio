"use strict";

module.exports = function(db) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
    
    var Search = new Schema({
        term: String,
        timestamp: Number
    });
    
    return db.model("Search", Search);
}
