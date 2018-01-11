const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const IdeaSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    details:{
        type: String,
        required: true
    }, 
    Date:{
        type: Date,
        default: Date.now
    }
});

mongoose.model("ideas", IdeaSchema);