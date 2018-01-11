const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
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

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

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

// Add Idea Form
app.get("/ideas/add", (req,res)=>{
    res.render("ideas/add");
});

// Process Form
app.post('/ideas',(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text:"Please add a Title"});
    }
    if(!req.body.details){
        console.log("Called");
        errors.push({text:"Please add Details"});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            detials: req.body.detials
        });
    } else {
        res.send("Passed");
    }
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});