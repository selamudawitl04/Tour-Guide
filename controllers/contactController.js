
const Contact = require('../models/contactModel')
const APIError = require('../utils/apiError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync  = require('../utils/catchAsync')

const utils = async()=>{
    const data = {
         person: '6433ee482ca3620e60f7e383'
    }

const res = await Contact.updateMany({person: '6411cf6bdf490a31c8807769'}, data)
     // const res = await Person.deleteMany()
     // const res = await Person.countDocuments({type: 'found'})
     console.log(res)
 }
//  utils()d


exports.createContact  = catchAsync(async (req, res) => {  
    console.log(req.body)
    const newContact = await Contact.create(req.body) 
     res.status(200).json({
         status:"success",
         data:{
            contact: newContact
         }
     })
})


exports.getAllContacts = catchAsync(async (req,res)=>{
    // console.log(req.query)
    // const features = new APIFeatures(Contact.find(),req.query)
    // .filter()
    // .sort()
    // .field()
    // .paginate()

    const contacts = await Contact.find();
    res.status(200).json({
        status:"success",
        data:{
           contacts
        }
    }) 
})
exports.getContact = catchAsync(async (req,res)=>{
    const query = Contact.findById(req.params.id);
    const contact = await query;
    if(!contact){
        return next( new APIError(`No contact fund with id = ${req.params.id}`,401))
    }
    res.status(200).json({
        status:"success",
        data:{
           contact
        }
    })
})
exports.deleteContact = catchAsync(async (req,res)=>{
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if(!contact){
        return next( new APIError(`No issues fund with id = ${req.params.id}`,401))
    }
    res.status(200).json({
        status:"success",
        data:{
           contact
        }
    })
})
exports.updateContact = catchAsync(async (req,res,next)=>{   
    const contact =  await Contact.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        runValidators:true
    })
    if(!contact){
        return next( new APIError(`No contact fund with id = ${req.params.id}`,401))
    }
    res.status(200).json({
        status:"sucess",
        data:{
            contact
        }    
    })    
})