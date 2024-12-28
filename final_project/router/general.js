const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

function does_user_exist(username) {
  let user = users.filter((user) => {
    return user.username === username;
  });

  if (user.length > 0) {
    return true;
  }
  return false;
}
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    //check whether user exists
    if (does_user_exist(username)) {
      return res
        .status(404)
        .send(`user ${username} already existed, please try another username`);
    } else {
      //if user does not exist, push it to users array as an object
      users.push({ username: username, password: password });
      return res.status(200).send(`user ${username} successfully created!`);
    }
  } else {
    return res.status(404).send(`username or password are not provided`);
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get("/getBooks", function (req, res) {
  axios
    .get("http://localhost:5000/")
    .then((response) => {
      console.log("this is axios callback with a promise");

      return res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch((err) => {
      console.error("Error fetching books:", err.message);
      return res.status(500).send("Error fetching books");
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //extract the isbn
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/isbn-axios/:isbn", (req, res) => {
  //extract isbn parameter
  const isbn = req.params.isbn;
  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log("this is axios callback with a promise for isbn fetch");

      return res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch((err) => {
      console.error(err);

      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //extract the author
  let author = req.params.author;
  let filterBooks = Object.values(books).filter((book) =>
    book.author.toLowerCase().trim().includes(author.toLowerCase().trim())
  );
  if (filterBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filterBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author-axios/:author", function (req, res) {
  //extract author parameter
  const author = req.params.author;
  axios
    .get(`http://localhost:5000/author/${author}`)
    .then((response) => {
      console.log("this is axios callback with a promise for author fetch");

      return res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).json({ message: "Book not found" });
    });
 
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //extract the title
  let title = req.params.title.toLowerCase().trim();
  // console.log(title);

  let filterBooks = Object.values(books).filter((book) => {
    // console.log(book.title.toLowerCase().trim());

    return book.title.trim().toLowerCase().includes(title);
  });
  if (filterBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filterBooks, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/title-axios/:title", function (req, res) {
  //extract title parameter
  const title = req.params.title;
  axios
    .get(`http://localhost:5000/title/${title}`)
    .then((response) => {
      console.log("this is axios callback with a promise for title fetch");

      return res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch((err) => {
      console.error(err);
      return res.status(404).json({ message: "Book not found" });
    });
 
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //extract the isbn
  let isbn = req.params.isbn;
  let book = books[isbn]["reviews"];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "book not found" });
  }
});

module.exports.general = public_users;
