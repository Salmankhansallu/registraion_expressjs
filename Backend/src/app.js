require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieparser=require("cookie-parser");
require("./db/conn");
const Register = require("./model/registers")
 const staticpath = path.join(__dirname,"../public");
const templatepath = path.join(__dirname,"../templates");
const partialepath = path.join(__dirname,"../templates/partials");
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialepath);
 app.use(express.static(staticpath));
 app.use(express.json());
 app.use(express.urlencoded({extended:false}));
//  app.use(cookieparser);

//  console.log(process.env.SECRET_KEY);
app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/register",(req,res)=>{
    res.render("register");
})


app.post("/register",async (req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmpassword;
        if(password===cpassword){
            const registerstudent = new Register({
                fullname:req.body.fullname,
                phone:req.body.phone,
                password:password,
                confirmpassword:cpassword,
                email:req.body.email,
                address:req.body.address,
                gender:req.body.male

            })
            // console.log("success part is"+registerstudent);
            const token = await registerstudent.generateAuthToken();
            // console.log("token part is "+token);
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+30000),
                httpOnly:true
            });

            const registered = await registerstudent.save();
            // console.log("page part "+registered);
            res.status(201).render("login");

        }
        else{
            res.status(201).send("password not matched");
        }


    }catch(e){
        res.status(400).send(e);
        console.log("the error part page");

    }
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login", async (req,res)=>{
    try{
        const Email=req.body.email;
        const Password=req.body.password;
        const useremail=await Register.findOne({email:Email});
        
        const token = await useremail.generateAuthToken();
        // console.log("token part is "+token);
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+50000),
            httpOnly:true
        });
        // console.log(`this is cookie awesome ${req.cookies.jwt}`);
       // if(useremail.password===Password)
       if(ismatch==true)
       {
            res.status(201).render("index");
            //console.log("Logged in");
        }
        else{
            res.send("Invalid password...!");
        }
        


    }catch(e){
        res.status(400).send(e);
    }
})
// const securepass = async (password)=>{

//     const passwordhash = await bcrypt.hash(password,10);
//     console.log(passwordhash);
//     const passmatch = await bcrypt.compare("Salman",passwordhash);
//     console.log(passmatch);
// }
// securepass("salman");

const createtoken=async ()=>{
    const token = await jwt.sign({_id:"61801c2114eefe0f5b0327a1"},process.env.SECRET_KEY,{
        expiresIn:"2 seconds"
    });
    console.log(token);
    const userver = jwt.verify(token,process.env.SECRET_KEY);
    console.log(userver);
}


//createtoken();


const port = process.env.PORT || 9000;
app.listen(port,(req,res)=>{
    console.log(`listen to the port number ${port}`);
})