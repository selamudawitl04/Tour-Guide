
const { Error } = require('mongoose');
const User = require('./../models/userModels');
//const { Teacher } = require('../models/model');
const APIError = require('./../utils/apiError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync  = require('./../utils/catchAsync')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };


exports.getAllUsers = catchAsync(async(req,res)=>{
        // if(req.user.role==="admin"){

        // }
        // else if(req.user.role==="user"){

        // }
        // const features = new APIFeatures(Tour.find(),req.query)
        // .filter()
        // .sort()
        // .field()
        // .paginate()
        // const tours = await features.query;
        const users = await User.find();
        res.status(200).json({
            status:"sucess",
            result:users.length,
            data:{
                users
            }    
        })

})
exports.getUser = catchAsync(async(req, res,next) => {
        
       const query  =  User.findById(req.params.id);
       const user = await query;
    
       if(!user){
        return next(new APIError(`No user fund with id = ${req.params.id}`,404))
       }

        res.status(200).json({
            status:"sucess",
            data:{
                user
            }    
        })
    
})
    

exports.updateUser = catchAsync(async (req,res,next)=>{    
        const user = await User.findByIdAndUpdate(req.params.id,req.body,
            {
            new:true,
            runValidators:true
        })

        if(!user){
            return next( new APIError(`No user fund with id = ${req.params.id}`,401))
        }
        res.status(200).json({
            status:"sucess",
            data:{
                user
            }    
        })    
})
exports.deleteUser = catchAsync(async(req,res,next)=>{
    
          // if(req.user.role==="admin"){

        // }
        // else if(req.user.role==="user"){

        // }
        const user = await User.findByIdAndDelete(req.params.id);
        if(!tour){
            return next( new APIError(`No student fund with id = ${req.params.id}`,404))
        }
        res.status(200).json({
            status:"sucess",
            data:{
                user
            } 
        })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new APIError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'firstName',"lastName", 'email');
    if (req.file) filteredBody.photo = req.file.filename;
  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });
  
  exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
  
  exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    });
  };
