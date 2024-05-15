const express = require("express");
const router = express.Router();


router.get("/home", async(req, res)=>{
  if (req.session.loggedIn){
    res.render("home");
  }else{
    res.redirect("/")
  }
})

module.exports = router