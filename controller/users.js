const User = require("../models/user.js");

//input route
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

//storage route
module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

//log in route
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

//verification route
module.exports.verification = async(req, res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout route
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","You are logout now!!");
        res.redirect("/listings");
    });
};