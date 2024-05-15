const  express = require("express")
const app= express()
const User= require("../models/userSchema");
const bcrypt =require("bcrypt")



async function userRegister(req,res, next){
  const fullName = req.body.fullName.trim();
  const phone = req.body.phone.trim();
  const email= req.body.email.trim();
  const password= req.body.password.trim();
  const gender= req.body.gender.trim();

  if (fullName==="" || phone==="" || email==="" || password==="" || gender===""){
    return res.render("register", {
      errorMessage: "All fields required"
    })
  }
  if(phone.length <8|| phone.length >12){
    return res.render("register",{
      errorMessage:"phone number length should be between 8 to 12 digits"
    })
  }


  if (gender!=="male"&& gender !=="female"){
    return res.render("register",{
      errorMessage:"gender should be male or female"
    })
  }
  const dbEmail= await User.findOne({email:email});
  if (dbEmail===null){

    const hashedPass=await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName,
      phone:phone,
      email: email,
      password:hashedPass,
      gender:gender,
      role: "user"
    });
    if(user){
      console.log("account created")
      req.user = user;
  
     next();
    }
  }else{
    
    return res.render("register",{
      errorMessage: "user already exist, kindly login"
    });
  }

}

async function userLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email, role: "user" });
  const admin = await User.findOne({ email: email, role: "admin" });

  if (user || admin) {
    const currentUser = user || admin;
    // Compare the plain text password with the hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, currentUser.password);

    if (passwordMatch) {
      console.log(currentUser.role + " login successful");
      req.user = user;
      req.admin = admin;
      next();
    } else {
      console.log("Invalid password");
      return res.render("login", { errorMessage: "Invalid password" });
    }
  } else {
    console.log("User not found");
    return res.render("login", { errorMessage: "User not found" });
  }
}



module.exports = { userRegister, userLogin }

