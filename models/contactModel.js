const mongoose = require('mongoose')
const contactSchema = mongoose.Schema({
    person:{
        type: mongoose.Schema.ObjectId,
        ref:'Person',
        required: [true, 'A comment must have the person']
    },
    createdAt: {
        type: Date,
        default: Date.now() 
    },
    firstName: String,
    lastName: String,
    email: String,
    message: String
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports =  Contact;