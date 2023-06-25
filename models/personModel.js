
const mongoose = require('mongoose');
const addressSchema = require('./addressModel')
const personSchema = new mongoose.Schema(
  {
    type:{
      type: String,
      required: [true , 'Type is required'],
      enum:['lost', 'found']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'For each issues there must be one user']
    },
    firstName: {
      type: String,
    },
    otherName: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    grandFatherName: {
      type: String
    },
    motherName: {
      type: String
    },
    motherFatherName: {
      type: String
    },
    age: Number,
    sex: {
      type:String,
      required: [true, 'A person must have gender'],
      enum: ['M', 'F']
    },
    weight: {
      type: Number
    },
    height: {
      type: Number
    },
    date:{
      type: Date,
      required: [true, 'The issued date is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now() 
    },
    color: String,
    coverPhoto: String,
    signs: String,
    photoArray: [String],
    discription: String,
    address:{
      type: addressSchema,
      required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// personSchema.index({ tour: 1, user: 1 }, { unique: true });

personSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName email _id phoneNumber'
  })
  console.log('Dawit Selemon')
  next();
});

personSchema.virtual('contacts',{
  ref:'Contact',
  foreignField:'person',
  localField:'_id'
});

// personSchema.statics.calcAverageRatings = async function(tourId) {
//   const stats = await this.aggregate([
//     {
//       $match: { tour: tourId }
//     },
//     {
//       $group: {
//         _id: '$tour',
//         nRating: { $sum: 1 },
//         avgRating: { $avg: '$rating' }
//       }
//     }
//   ]);
//   // console.log(stats);
//   if (stats.length > 0) {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: stats[0].nRating,
//       ratingsAverage: stats[0].avgRating
//     });
//   } else {
//     await Tour.findByIdAndUpdate(tourId, {
//       ratingsQuantity: 0,
//       ratingsAverage: 4.5
//     });
//   }
// };

// personSchema.pre('save', async function(next) {
//   console.log('Is working', this.coverPhoto)
//   this.coverPhoto = `@/assets/cover-image/`+ this.firstName + this.fatherName + '.jpg';
//   next();
// });

// // findByIdAndUpdate
// // findByIdAndDelete
// personSchema.pre(/^findOneAnd/, async function(next) {
//   this.r = await this.findOne();
//   // console.log(this.r);
//   next();
// });

// personSchema.post(/^findOneAnd/, async function() {
//   // await this.findOne(); does NOT work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
