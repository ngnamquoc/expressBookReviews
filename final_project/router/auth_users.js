const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  let validatedUser=users.filter((user)=>{
    return (user.username===username && user.password===password);
})
return validatedUser.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //extract username and pass
  const username=req.body.username;
  const password=req.body.password;
  //check if any data is missing to authenticate
  if(!username || !password){
    return res.status(404).json({"message":"missing username or password"});
  }
  //authenticate user
  if(authenticatedUser(username,password)){
    //create access token
    let accessToken=jwt.sign({data:password},'access',{expiresIn:60*60});
    //store accesstoken and username in req session
    req.session.authorization={
      username,accessToken
    }
    return res.status(200).send(`user ${username} successfully logged in`);


  }else{
    return res.status(208).json({"message":"Wrong username or password"});


  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //extract isbn
  let isbn=req.params.isbn;
  // console.log(isbn);

  //extract review from request query
  let userReview=req.query.review;
  // console.log(userReview);
  
  //extract the username from session
  let username=req.session.authorization['username'];
  // console.log(username);

  //check if any required data is missing
  if(!isbn||!userReview||!username){
    return res.status(404).json({"message":"failed to add/update the review"})
  }
  //check if the current user already posted a review for the book or want to add a new one
  let existedReview=books[isbn]['reviews'][username];
  if(existedReview){
    //modify the review
    books[isbn]['reviews'][username]=userReview;
    console.log(books[isbn]['reviews']);

    return res.status(200).send(`Successfully updated the review of the book ${books[isbn]['title']} of username ${username}`);

  }else{
    //add new review
    books[isbn]['reviews'][username]=userReview; 
    console.log(books[isbn]['reviews']);

    return res.status(200).send(`Successfully addedd the review of the book ${books[isbn]['title']} of username ${username}`);
 
  }

});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
   //extract isbn
   let isbn=req.params.isbn;
   // console.log(isbn);
   
   //extract the username from session
   let username=req.session.authorization['username'];
   // console.log(username);

  //check if the current user already posted a review for the book 
  let existedReview=books[isbn]['reviews'][username];
  
  if(existedReview){
    delete books[isbn]['reviews'][username];
    res.status(200).send(`Successfully deleted the review of the book ${books[isbn]['title']} of username ${username}`);

  }else{
    res.status(404).json({"message":"No review to delete"})
  }



})



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
