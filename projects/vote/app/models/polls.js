"use strict";

module.exports = function(autoincrement) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
        
    var Poll = new Schema({
        user: {
            type: Number,
            ref: "User"
        },
        question: String,
        created: { type: Date, default: Date.now }
    });
    
    Poll.index({ question: "text"});
    Poll.plugin(autoincrement.plugin, { model: "Poll", startAt: 1 });
    
    return mongoose.model("Poll", Poll);
}