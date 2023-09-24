const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
const cookieSession=require('cookie-session')
const passportSetup=require('./passport')
const authRouter=require('./Routes/authRouter');
const socialLoginRouter=require('./Routes/socialLoginRouter')
const productsRouter=require('./Routes/productsRouter');
const reviewsRouter=require('./Routes/reviewsRouter');
const CustomError = require('./utils/customError');
const globalErrorHandler=require('./Controllers/errorController')
const  passport = require('passport');
const expressSession=require('express-session');

let app=express();

app.use(express.json());

// app.use(
//     cookieSession({
//         name:'session',
//         keys:['cyberwolve'],
//         maxAge:24*60*60*100
//     })
// )

// app.use(expressSession({
//     resave: false,
//     saveUninitialized: true.valueOf,
//     secret: 'SECRET'
//   }));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(cors({
//     origin: "http://localhost:4200",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials:true
// }))

// passportSetup.googleLogin;

// passportSetup.facebookLogin;

// passportSetup.microsoftLogin;

// passport.serializeUser((user, done) => {
// 	done(null, user);
// });

// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });

app.use(cors());

app.use('/auth',socialLoginRouter)

app.use('/user',authRouter);

app.use('/products',productsRouter);

app.use('/products',reviewsRouter);

app.all('*',(req,res,next)=>{
        const err=new CustomError(`can't find ${req.originalUrl} on the server!`,404)
        next(err); //express will forget about other middlewares and put this middleware in middleware stack(global error handling) 
    });
    
app.use(globalErrorHandler)  

 module.exports=app;