
const Tour = require('../models/tourModels');
const Person = require('../models/PersonModel')
const APIError = require('../utils/apiError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync  = require('../utils/catchAsync');
const fs = require('fs')


const multer = require('multer')
const upload = multer();

const cloudinary = require("cloudinary").v2;
var base64Img = require('base64-img');

// Request Handler

cloudinary.config({
  cloud_name: "selamu-dawit",
  api_key: "349479795881572",
  api_secret: "_PCvEGOJlFmS6wMA6z1JZ93b53o",
});

const utils = async()=>{
   const data = {
        type: 'found'
   }
    const res = await Person.updateOne({firstName: 'Abidisa'}, data)
    // const res = await Person.deleteMany()

    // const res = await Person.countDocuments({type: 'found'})
    
    console.log(res)
}
// utils()
// app.post('/api/v1/persons', upload.single('file'), (req, res) => {
//     // req.file contains the uploaded file
//     // req.body contains other fields sent along with the file
//     const name = req.body.name;
//     const email = req.body.email;
//     console.log(name, email, req.file);
//     // do something with the file and other fields
//     res.json({ success: true });
//   });

// exports.createPerson  = (upload.single('file'), async (req, res) => {  
//     console.log(req.body)
//     // const newPerson = await Person.create(req.body);
//      res.status(200).json({
//          status:"success",
//          data:{
//             person: "Selmau Dawit"
//          }
//      })
// })

const util = ()=>{
    
}

async function uploadImage(base64Data) {
    try {
      const response = await cloudinary.uploader.upload(base64Data, { 
        folder: 'persons' ,
        timeout: 120000,
        unique_filename: true,
        discard_original_filename: true
        });
      console.log(response.secure_url)
      return response.url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  }

exports.createPerson  = catchAsync(async (req, res) => { 
    // console.log(req.body) 

    uploadImage(req.body.data).then((val)=>{
        // console.log(9090, val)
    }).catch(err=>{
        console('There is error', err)
    })
    // const persons = await Person.updateMany({type: 'lost'}, {height: 'other'}) 
     res.status(200).json({
         status:"success",
         data:{
            person: "No person"
         }
     })
})


exports.getAllPersons = catchAsync(async (req,res)=>{
    const features = new APIFeatures(Person, Person.find(),req.query)
    .filter()
    .sort()
    .field()
    .paginate()
    const persons = await features.query;
    console.log('Length is :', persons.length)
    res.status(200).json({
        status:"success",
        data:{
            length: features.length,
            size: persons.length,
            persons
        }
    }) 
})
exports.getPerson = catchAsync(async (req,res)=>{
    const query = Person.findById(req.params.id).populate('contacts');
    const person = await query;
    if(!person){
        return next( new APIError(`No issues fund with id = ${req.params.id}`,401))
    }
    res.status(200).json({
        status:"success",
        data:{
           person
        }
    })
})
exports.deletePerson = catchAsync(async (req,res)=>{
    const person = await Person.findByIdAndDelete(req.params.id)
    if(!person){
        return next( new APIError(`No issues fund with id = ${req.params.id}`,401))
    }
    res.status(200).json({
        status:"success",
        data:{
           person
        }
    })
})
exports.updatePerson = catchAsync(async (req,res,next)=>{   
    const person =  await Person.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        runValidators:true
    })
    if(!person){
        return next( new APIError(`No person fund with id = ${req.params.id}`,401))
    }
    res.status(200).json({
        status:"sucess",
        data:{
            person
        }    
    })    
})