var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

//campground ownership middleware
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
               req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does the campground belong to the user?
            if(foundCampground.author.id.equals(req.user._id || req.user.isAdmin)) {
                next();
            } else {
                //campground doesnt belong to the user
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        //user not logged in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}
//comment ownership middleware
middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does the comment belong to the user?
            if(foundComment.author.id.equals(req.user._id || req.user.isAdmin)) {
                next();
            } else {
                //comment doesnt belong to the user
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        //user not logged in
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//logged in middleware(if user not logged in => redirect to login page)
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;