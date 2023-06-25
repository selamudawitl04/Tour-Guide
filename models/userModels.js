const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please tell us your first name!']
  },
  lastName: {
    type: String,
    required: [true, 'Please tell us your last name!']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please tell us your phone number!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: [true, "There is account in this email please login, If you forgot password reset it"],
    lowercase: true
    //validate: [validator.isEmail, 'Please provide a valid email']
  },
  // role: {
  //   type: String,
  //   enum: ['user', 'guide', 'lead-guide', 'admin'],
  //   default: 'user'
  // },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordVerifyCode:{
    type:String
  },
  passwordVerifyExpires:{
    type: Date
  },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, 'Please confirm your password'],
  //   validate: {
  //     // This only works on CREATE and SAVE!!!
  //     validator: function(el) {
  //       return el === this.password;
  //     }, 
  //     message: 'Passwords are not the same!'
  //   }
  // },
 
  passwordChangedAt:Date,
  passwordResetToken:{
    type: String
  },
  passwordResetExpires:{
    type: Date,
  },

  // active: {
  //   type: Boolean,
  //   default: true,
  //   select: false
  // }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Delete passwordConfirm field
  next();
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordVerifyCode') || !this.passwordVerifyCode) return next();
  // Hash the password with cost of 12
  this.passwordVerifyCode = await bcrypt.hash(this.passwordVerifyCode, 12)
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// userSchema.pre(/^find/, function(next) {
//   // this points to the current query
//   this.find({ active: { $ne: false } });
//   next();
// });

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
 
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.correctVerifyCode = async function(
  candidateCode,
  userVerifyCode
) {
  console.log(candidateCode, userVerifyCode)
  return await bcrypt.compare(candidateCode, userVerifyCode);
};

userSchema.methods.isVerfiyCodeExpired = function(time) {
  const verifyCodedTime = parseInt(this.passwordVerifyExpires / 1000)
  return time < verifyCodedTime
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto  
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log(this.passwordResetToken);
  // console.log(this.passwordResetExpires);
  return resetToken;
};
userSchema.methods.createPasswordVerifyCode = function() {
  this.passwordVerifyCode = getRndInteger(10000, 99999)+''
  this.passwordVerifyExpires = Date.now() + 10 * 60 * 1000;
  return this.passwordVerifyCode;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
