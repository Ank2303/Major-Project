const mongoose = require('mongoose');
const initData=require("./data.js")
const listing=require("../models/listing.js");
const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(res=>{
    console.log("Db is running");
})
.catch(err =>{
     console.log(err);
});

async function main() {
  await mongoose.connect(Mongo_url);
}
const init=async ()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner:"699a96a3a647769e0e51b3f1"}))
    await listing.insertMany(initData.data);
    console.log("initialisation is successful");
}
init();