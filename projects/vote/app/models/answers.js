"use strict";

module.exports = function(autoincrement, db) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
        
    var Answer = Schema({
        poll: { type: Number, ref: "Poll" },
        user: { type: Number, ref: "User" },
        answer: String,
        order: Number,
        created: { type: Date, default: Date.now }
    });
    
    Answer.plugin(autoincrement.plugin, { model: "Answer", startAt: 1 });
    
    return db.model("Answer", Answer);
}