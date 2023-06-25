
const mongoose = require('mongoose');
const addressSchema = new mongoose.Schema(
  {
    region: {
      type: String,
    },
    zone: {
      type: String,
    },
    town: {
      type: String
    },
  }
);
module.exports = addressSchema;
const crypto = require('crypto');
const bcrypt = require('bcryptjs')
// console.log(1234)

const sol = function(str){
  // const resetToken = crypto.randomBytes(5).toString('hex');
  // console.log(resetToken)
  const token = crypto  
    .createHash('sha256')
    .update(str)
    .digest('hex');
  console.log(token)
}

// 3578ac91d7eb2c39a5929de669f884ada1f7b344b65bf2819e4d6bd65d21572b
// sol('76b6f537c0')
