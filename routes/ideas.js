const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


//Load idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// Idea Index Page
router.get('/',(req,res)=>{
    Idea.find({}).sort({date:'desc'}).then(ideas =>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })
    
})

// Add Idea Form
router.get("/add", (req,res)=>{
    res.render("ideas/add");
});


// Edit Idea Form
router.get("/edit/:id", (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea =>{
        res.render("ideas/edit",{
            idea: idea
        });
    });
    
});

// Process Form
router.post('/',(req,res)=>{
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
            req.flash('success_msg', 'Idea Added');
            res.redirect('/ideas');
        });
    }
})

// Edit form Process
router.put('/:id',(req, res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea =>{
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea => {
            req.flash('success_msg', 'Idea Updated');
            res.redirect('/ideas');
        });
    });
});

//DELETE IDEA
router.delete('/:id',(req,res)=>{
    Idea.remove({
        _id: req.params.id
    }).then(()=>{
        req.flash('success_msg', 'Idea Removed');
        res.redirect('/ideas');
    });
})


module.exports = router;