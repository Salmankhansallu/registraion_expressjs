const mongoose = require("mongoose")
mongoose.connect(process.env.mongodb,{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then(() => {
    console.log("connection successful...!");
}).catch((e)=>{
    console.log("connection failed...!");

})