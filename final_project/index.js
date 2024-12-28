const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
let users=[];
function authenticate_user(uname,password){
    let validatedUser=users.filter((user)=>{
        return (user.username===uname && user.password===password);
    })
    return validatedUser.length>0;

}
app.use("/customer/auth/*", function auth(req,res,next){
    // let username=req.body.username;
    // let password=req.body.password;
    // //if username,pass missing
    // if(username==''||password==''){
    //     return res.status(402).send({"message":"Error logging in, please try again!"});
    // }
    // if(authenticate_user(username,password)){
    //     //if user authenticated, then generate jwt access token
    //     let accessToken=jwt.sign({data:password},'access',{ expiredIn:60*60});

    // }else{
    //     return res.status(208).json({ message: "Invalid Login. Check username and password" });

    // }
    
    //check if user is logged in and has valid access token
    if(req.session.authorization){
        //extract token
        let accessToken=req.session.authorization['accessToken'];
        //verify the access token
        jwt.verify(accessToken,"access",(err,user)=>{
            if(err){
                //if the verification process failed
                return res.status(403).json({ message: "User not authenticated" });

            }else{
                //if success
                req.user=user;
                //proceed to next middleware
                next();

            }
        })

    }else{
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
