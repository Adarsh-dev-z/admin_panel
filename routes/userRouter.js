const express= require("express");
const { userRegister, userLogin } = require("../middlewares/Authentification");
const router =express.Router();
const User= require("../models/userSchema")


router.get("/", (req, res)=>{
  
  if (req.session.admin){
    res.redirect("/admin");
  }
  else if (req.session.user){
    res.render("home")
  }else{
    res.render("login")
  }
 
})

router.get("/register", (req, res)=>{
  if (req.session.loggedIn){
    res.redirect("/home");
  }else{
    res.render("register")
  }
});

router.post("/register", userRegister, (req, res)=>{
  try {
    const registeredUser = req.user;
    req.session.user = registeredUser;
    req.session.loggedIn= true;
    res.redirect("home");
    console.log("user signed and logged in");

  }catch(err){
    console.log(err);
  }
});


router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else {
    res.render("login");
  }
});

router.post("/login", userLogin, (req, res)=>{
  try{
    const validateUser = req.user;
    req.session.user= validateUser;
    const validateAdmin = req.admin;
    req.session.admin = validateAdmin;
    req.session.loggedIn=true;
    if(req.session.user){
      res.redirect("/home")
      console.log("user authenticated and logged in");
    }else if (req.session.admin){
      res.redirect("/admin")
    }
  }catch(err){
    console.log(err);
  }
});


router.get("/logout", (req, res)=>{
  req.session.destroy();
  res.redirect("/")
})


module.exports= router