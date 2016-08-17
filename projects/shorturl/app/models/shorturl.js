"use strict";

module.exports = function(autoincrement) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
        
    var ShortUrl = new Schema({
        original_url: String,
        short_url: String
    });
    
    ShortUrl.plugin(autoincrement.plugin, { model: "ShortUrl" });
    
    return mongoose.model("ShortUrl", ShortUrl);
}