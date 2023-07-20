
const dotenv=require('dotenv');

dotenv.config({path:'./config.env'});
const mongoose=require('mongoose');

process.on('uncaughtException',(err)=>{
    console.log(err.name , err.message) 
    console.log('Unhandled exception occurred! Shutting down')
      process.exit(1); //1 for uncaught exception
})

const app=require('./app');

//console.log(app.get('env'));
//console.log(process.env);
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
   //console.log(conn);
   console.log("DB Connection successful")
}).catch((err)=>{
    console.log(err," Error Occurred");
})

const port=process.env.PORT || 3000;
const server=app.listen(port,()=>{
    console.log("Server started...")
})

process.on('unhandledRejection',(err)=>{
  console.log(err.name , err.message) 
  console.log('Unhandled exception occurred! Shutting down')
 
  server.close(()=>{
    process.exit(1);
  }); //1 for uncaught exception
})