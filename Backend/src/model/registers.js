const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 const studentschema = new mongoose.Schema({
     fullname:{
         type:String,
         required:true
     },
     phone:{
         type:Number,
         required:true,
         unique:true
     },
     password:{
         type:String,
         required:true
     },
     confirmpassword:{
         type:String,
         required:true
     },
     email:{
         type:String,
         required:true,
         unique:true
     },
     address:{
         type:String,
         required:true
     },
     gender:{
        type:String,
        required:true
     },
     tokens:[{
         token:{
             type:String,
             required:true
         }
     }]

 })
 //generating token
 studentschema.methods.generateAuthToken=async function(){
     try{
         const token =  jwt.sign({_id:this._id.toString()},"mynameissalmankhanmaliktigermalik");
        this.tokens=this.tokens.concat({token:token});
         //console.log(token);
         await this.save();
         return token;

     }catch(e){
         res.send("the error part is "+e);
        //  console.log("the error part is "+e);

     }
 }

 //converting password into hash
 studentschema.pre("save",async function(next){
     if(this.isModified("password")){
        //  console.log(`the current password is ${this.password}`);
         this.password = await bcrypt.hash(this.password,10);
        //  console.log(`the hash password is ${this.password}`);
         this.confirmpassword=await bcrypt.hash(this.password,10);
     }
     next();

 })
 const Studentreg = new mongoose.model("Studentreg",studentschema);
 module.exports=Studentreg;