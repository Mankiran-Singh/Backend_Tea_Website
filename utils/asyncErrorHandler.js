module.exports=(func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(err=>next(err)); //this anonymous func will be called by express
    }
}