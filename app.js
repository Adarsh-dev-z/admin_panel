const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("express-handlebars")
const bodyParser = require("body-parser")
// require('dotenv').config();
const PORT = process.env.PORT || 3001;

const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const adminRouter= require("./routes/adminRouter");

app.use(session({
    secret:"the secret key",
    resave:false,
    saveUninitialized:false,
    cookie: { maxAge:6000000 }
}));

app.use(bodyParser.urlencoded({extended:true}))

app.engine("hbs", hbs.engine({
    extname:"hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname+ "/views/layouts"
}));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname,"public")));

app.use("/", userRouter);
app.use("/", homeRouter);
app.use("/", adminRouter);

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`);
    mongoose.connect("mongodb://localhost:27017/nm")
        .then(()=> console.log("connected to dataBase"));
});