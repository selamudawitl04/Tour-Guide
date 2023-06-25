module.exports  =  (tours) =>{
    return (req,res)=>{
        res.status(200).json({
            status:"sucess",
            
            data:{
                tours
            }
        })
    }
} 