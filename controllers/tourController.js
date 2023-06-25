const fs = require('fs');
const { Error } = require('mongoose');

const Tour = require('../models/tourModels');
const APIError = require('./../utils/apiError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync  = require('./../utils/catchAsync')

exports.getTopTours = (req,res,next)=>{
   
    req.query.limit = "9";
    req.query.fields = "name price difficulty ratingsAverage";
    req.query.sort = '-ratingAverage';
    next();
}

exports.getMonthlyTour = async(req,res)=>{
   try{
         const year = 1*req.params.year;
    
         const tours = await Tour.aggregate([ {
            
            $unwind:"$startDates"
        },
        {
            $match: {
                startDates:{
                    $gte:new Date(`${year}-01-01`),
                    $lte:new Date(`${year}-12-31`)
                }
                
            }
        }
       
    ])
    res.status(200).json({
        status:"success",
        data:{
           tours
        }
    })
   }
   catch(err){
        res.status(404).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.getTourStatus = async(req,res)=>{
    try{
        
        const stat = await Tour.aggregate([
            {
                $match:{ratingsAverage:{$gte:4.0}}
            },
            {
                $group:{
                    _id:difficulty,
                    numTour: { $sum:1},
                    numRating: { $sum: "$ratingsQuantity"},
                    avgRating: { $avg: "$ratingsAverage"},
                    avgPrice: { $avg: "$price"},
                    minPrice: { $min: "$price"},
                    maxPrice: { $max: "$price"}
    
                }
            }
       ])
     res.status(200).json({
        status:"success",
        data:{
           tour: stat
        }
    })
    }
    catch(err){
         res.status(404).json({
             status:"fail",
             message:err.message
         })
     }
 }

 
exports.createTour  = catchAsync(async (req, res) => {
    
       const newTour = await Tour.create(req.body);
        res.status(200).json({
            status:"success",
            data:{
               tour: newTour
            }
        })

})

exports.getAllTours = catchAsync(async(req,res)=>{
        const features = new APIFeatures(Tour.find(),req.query)
        .filter()
        .sort()
        .field()
        .paginate()
        const tours = await features.query;
        res.status(200).json({
            status:"sucess",
            result:tours.length,
            data:{
                tours
            }    
        })
})
exports.getTour = catchAsync(async(req, res,next) => {

       const query  =  Tour.findById(req.params.id).populate("reviews");
       const tour  = await query;
       if(!tour){
        return next(new APIError(`No Tour fund with id = ${req.params.id}`,404))
       }


        res.status(200).json({
            status:"sucess",
            data:{
                tour
            }    
        })
    
})
    

exports.updateTour = catchAsync(async (req,res,next)=>{

        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,
            {
            new:true,
            runValidators:true
        })

        if(!tour){
            return next( new APIError(`No Tour fund with id = ${req.params.id}`,404))
        }
        res.status(200).json({
            status:"sucess",
            data:{
                tour 
            }    
        })
     
})
exports.deleteTour = catchAsync(async(req,res,next)=>{
    
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if(!tour){
            return next( new APIError(`No Tour fund with id = ${req.params.id}`,404))
        }
        res.status(200).json({
            status:"sucess",
            data:{
                tour 
            } 
        })
})
