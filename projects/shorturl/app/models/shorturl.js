"use strict";

module.exports = function(autoincrement, db) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
        
    var ShortUrl = new Schema({
        original_url: String,
        short_url: String
    });
    
    ShortUrl.plugin(autoincrement.plugin, "ShortUrl");
    
    return db.model("ShortUrl", ShortUrl);
}