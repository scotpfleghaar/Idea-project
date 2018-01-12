const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();


//Load Idea Routes
const ideas = require('./routes/ideas');

//Load User Routes
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

///////////DATABASE////////////

//DB Configuration
const db = require('./config/database')

//Map Global Promises - Removes Warning
mongoose.Promise = global.Promise;
//Connect to DB
mongoose.connect(db.mongoURI,{
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

// Passport Middleware (Must follow Express-session)
app.use(passport.initialize());
app.use(passport.session());

// connect-flash Middleware
app.use(flash());

// Global variable
app.use(function(req, res, next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
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

const port = process.env.PORT || 5000;



app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});