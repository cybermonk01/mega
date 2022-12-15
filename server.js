import mongoose from "mongoose";
import app from "./app.js";
import config from './config/index';

// one method is to connect to db as soon as the index file loads so we will connect here to db

// (async()=>{})() or ()() is used to execute the code as soon .

(async()=>{
try{

await mongoose.connect(config.MONGODB_URL)
console.log("DB connected");
app.on('error', (err)=>{
    console.log("EROOr: ", err);
    throw err;
})

app.listen(config.PORT, ()=>{
    console.log(`listening on port ${config.PORT}`);
})

}
catch(err){
    console.log("ERROR ", err);

}






})()


