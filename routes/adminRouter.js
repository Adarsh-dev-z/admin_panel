const express=require("express");
const router= express.Router();
const User= require("../models/userSchema")
const bcrypt = require('bcrypt');



router.get("/admin", async(req, res)=>{
    if (req.session.admin){
        const users= await User.find({role:"user"}).lean();
        res.render("admin", {user:users});
    }else{
        res.redirect("/");
    }
});


router.get("/admin/delete-user/:id", async (req, res)=>{
    const userId =req.params.id;
    const deletedUser= await User.deleteOne({_id:userId});
    if (deletedUser){
        res.redirect("/admin");
    }else{
        res.send("failed to delete user")
    }
});

router.get("/admin/editUser/:id", async (req, res)=>{
    const userId= req.params.id;
    const user= await User.findOne({_id: userId}).lean();
    res.render("editUser", {data:user});
});

router.post("/admin/editUser/:id", async (req, res)=>{
    const stringId = req.params.id;
    const userId=new Object(stringId);
    const fullName= req.body.fullName;
    const phone = req.body.phone;
    const email =req.body.email;
    const gender = req.body.gender;
    const updateUser = await User.findOneAndUpdate({_id:userId},{$set:{
        fullName:fullName,
        phone:phone,
        email:email,
        gender:gender
    },
},{new:true});
if(updateUser){
    res.redirect("/admin");
}
});

router.get("/admin/addUser", function(req, res){
    res.render("addUser")
});

router.post("/admin/addUser", async function(req, res){
    const fullName=req.body.fullName;
    const phone=req.body.phone;
    const email= req.body.email;
    const password= req.body.password;
    const gender= req.body.gender;
    const role="user"

    const hashedPass=await bcrypt.hash(password,10);

    
    const Email= await User.findOne({email:email});
    if (Email===null){
        const user = await User.create({
            fullName:fullName,
            phone:phone,
            email:email,
            password:hashedPass,
            gender:gender,
            role:role
        });
        user.save();
        if (user){
            console.log("user created");
            req.user=user;
            res.redirect("/admin")
        }
    }else{
        res.render("admin",{
            errorMessage:"user already exist"
        });
    }
});

router.get("/admin/search", (req, res)=>{
    res.redirect("/admin")
})

router.post("/admin/search", async function(req, res){
    const word = req.body.keyword;
    const users= await User.find({fullName:{$regex:`^${word}`,$options:'i'}}).lean();
    res.render("admin", {user:users})
})



module.exports= router