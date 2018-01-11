const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//Connect to DB
    useMongoClient: true
}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err => console.log(err));
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