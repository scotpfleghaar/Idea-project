const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();


///////////DATABASE////////////

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


///////////MIDDLEWARE////////////

//Handlebard Middleware
app.engine("handlebars",exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));


///////////ROUTES////////////

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

// Idea Index Page
app.get('/ideas',(req,res)=>{
    Idea.find({}).sort({date:'desc'}).then(ideas =>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })
    
})

// Add Idea Form
app.get("/ideas/add", (req,res)=>{
    res.render("ideas/add");
});


// Edit Idea Form
app.get("/ideas/edit/:id", (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea =>{
        res.render("ideas/edit",{
            idea: idea
        });
    });
    
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
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            // user: req.user.id
        }
        new Idea(newUser).save().then(idea => {
            res.redirect('/ideas');
        });
    }
})

// Edit form Process
app.put('/ideas/:id',(req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea =>{
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea => {
            res.redirect('/ideas');
        });
    });
});

//DELETE IDEA
app.delete('/ideas/:id',(req,res)=>{
    Idea.remove({
        _id: req.params.id
    }).then(()=>{
        res.redirect('/ideas');
    });
})


const port = 5000;

app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});