const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');

const app = express();


//Load Idea Routes
const ideas = require('./routes/ideas');

//Load User Routes
const users = require('./routes/users');

///////////DATABASE////////////

//Map Global Promises - Removes Warning
mongoose.Promise = global.Promise;
//Connect to DB
mongoose.connect('mongodb://test:test@ds249787.mlab.com:49787/idea-dev',{
    useMongoClient: true
}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err => console.log(err));




///////////MIDDLEWARE////////////

//Handlebard Middleware
app.engine("handlebars",exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express-session Middlware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// connect-flash Middleware
app.use(flash());

// Global variable
app.use(function(req, res, next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});


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


// Use Routes
app.use('/ideas', ideas);

app.use('/users', users);

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});