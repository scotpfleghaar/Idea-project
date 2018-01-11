const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//Map Global Promises - Removes Warning
mongoose.Promise = global.Promise;
//Connect to DB
mongoose.connect('mongodb://test:test@ds249787.mlab.com:49787/idea-dev',{
    useMongoClient: true
}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err => console.log(err));

//Load idea model
require("./models/Idea");
const Idea = mongoose.model("ideas");

//Handlebard Middleware
app.engine("handlebars",exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Index Route
app.get("/", (req, res)=>{
   const title = "Welcome";
    res.render("index", {
        title: title
    });
});

//About Route
app.get("/about", (req,res)=>{
    res.render("about");
});
const port = 5000;

app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});