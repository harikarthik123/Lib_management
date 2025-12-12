const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json())
mongoose.connect("mongodb+srv://harikarthikvajravel12_db_user:harikarthik123@cluster0.w9fwj2q.mongodb.net/LibraryDB")
.then(()=>console.log("MONGO CONNECTED"))
.catch((err)=> console.log(err))

const Book = require('./models/Book');

//sample test
app.get('/', (req, res) => {
    res.send("hello");
});


//insert data

app.post('/insert',async(req,res)=>{
    const bookName = req.body.bookName;
    const author = req.body.author;
    const book = new Book({
        BookName : bookName,
        Author : author
    })

    try{
        await book.save();
        console.log("BOOK SAVED");
        res.json({ message: "Book added successfully", book });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Error adding book" });
    }
})

//view data


app.get('/read',async(req,res)=>{
    try{
        const books = await Book.find();
        res.json(books);
    
    }catch(err){
        console.log(err);
    }
})


//update

app.put('/update',async(req,res)=>{
    const newBookName = req.body.newBookName;
    const newAuthorName = req.body.newAuthorName;
    const bookId = req.body.bookId;

    try {
    await Book.findByIdAndUpdate(
        bookId,
        {
            BookName: newBookName,
            Author: newAuthorName
        },
        { new: true }  
    );
    console.log("BOOK UPDATED");
    res.json({ message: "Book updated successfully" });
} catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating book" });
}

})

//delete
app.delete('/delete/:id',async(req,res)=>{
    const bookId = req.params.id;
    try{
        await Book.findByIdAndDelete(bookId);
        console.log("BOOK DELETED");
        res.json({ message: "Book deleted successfully" });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Error deleting book" });
    }
    })

app.listen(port,()=>{
    console.log("BACKEND RUNNING...")
})