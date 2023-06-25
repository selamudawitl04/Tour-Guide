const { methods } = require('./models/addressModel')
const Person = require('./models/personModel')

module.exports =  async (req, res)=>{
    try {
        const persons = await Person.updateMany({type: 'lost'}, {height: 'other'})
        res.status(200).json({
            status:"success",
            data:{
               persons
            }
        }) 
        
    } catch (error) {
        res.status(400).json({
            status:"fail"
            
        }) 
    }
   
}