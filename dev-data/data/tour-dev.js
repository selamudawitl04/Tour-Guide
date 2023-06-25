const fs = require('fs');
console.log(__dirname)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./../../config.env'});

const Tour = require('./../../models/tourModels');

mongoose.connect(process.env.DATABASE_LOCAL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(()=>{
    console.log('database connected successfuly')
})

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8')
const importData = async()=>{
    try{
        const newTour = await Tour.create(tours)
        console.log("The data is imported successfully");
    }catch(err){
        console.log(err.message);
    }

}
const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        console.log("The data is deleted successfully");
    }catch(err){
        console.log(err.message);
    }

}
console.log(process.argv[2]);

if(process.argv[2]=="--import") importData();
if(process.argv[2]=="--delete")  deleteData()

