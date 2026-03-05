if(process.env.NODE_ENV!="production"){
require('dotenv').config() }

const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const ejsMate=require("ejs-mate");
app.set("view engine","ejs");
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
const flash=require("connect-flash");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const override=require("method-override");
app.use(override("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")))
const expressError=require("./utils/expressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const cookieParser=require("cookie-parser");
// app.use(cookieParser("secretcode"));


// const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl:dbUrl,
    secret:process.env.SECRET,
    touchAfter:24*3600,
})
store.on("error",(err)=>{
    console.log("error occured in mongoUrl",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
     resave:false, 
     saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    } };

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
.then(res=>{
    console.log("Db is running");
})
.catch(err =>{
     console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"sigma_student"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })
// app.get("getSignedCookie",(req,res)=>{
//     res.cookie("made-in","india",{signed:true});
//     res.send("signed");
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.send("name","ankita");
// })
// app.get("/greet",(req,res)=>{
//     let {name}=req.cookies;
//     res.send(`hi,${name}`);
// })
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);

app.use((req,res,next)=>{
    next(new expressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("err.ejs",{err});
})
app.listen(8080,()=>{
    console.log("app is listening");
})