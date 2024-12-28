const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function does_user_exist(username){

  
  let user=users.filter((user)=>{return user.username===username});
  
  if(user.length>0){
    
    return true;
  }
  return false;
}
public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
  if(username && password){
    //check whether user exists
    if(does_user_exist(username)){
      return res.status(404).send(`user ${username} already existed, please try another username`);

    }else{
      //if user does not exist, push it to users array as an object
      users.push({"username":username,"password":password});
      return res.status(200).send(`user ${username} successfully created!`);
    }


  }else{
    return res.status(404).send(`username or password are not provided`)
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //extract the isbn
  let isbn=req.params.isbn;
  let book=books[isbn];
  if(book){
    return res.status(200).send(JSON.stringify(book,null,4));
  }else{
    return res.status(404).json({"message":"Book not found"});

    
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //extract the author
    let author=req.params.author;
    let filterBooks=Object.values(books).filter((book)=>book.author.toLowerCase().trim().includes(author.toLowerCase().trim()));
    if(filterBooks.length>0){
      return res.status(200).send(JSON.stringify(filterBooks,null,4));
    }else{
      return res.status(404).json({"message":"Book not found"});
  
      
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   //extract the title
   let title=req.params.title.toLowerCase().trim();
   console.log(title);
   
   let filterBooks=Object.values(books).filter((book)=>{
    console.log(book.title.toLowerCase().trim());
    
    return book.title.trim().toLowerCase().includes(title);
  });
   if(filterBooks.length>0){
     return res.status(200).send(JSON.stringify(filterBooks,null,4));
   }else{
     return res.status(404).json({"message":"Book not found"});
 
     
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //extract the isbn
  let isbn=req.params.isbn;
  let book=books[isbn]['reviews'];
  if(book){
    return res.status(200).send(JSON.stringify(book,null,4));


  }else{
    return res.status(404).json({"message":"book not found"});
  }

  

 
});

module.exports.general = public_users;
