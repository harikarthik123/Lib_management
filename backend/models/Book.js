const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    BookName:{
        type:String,
        required:true
    },
    Author:{
        type:String,
        required:true
    },
    })

const Book = mongoose.model('Book',BookSchema);

module.exports = Book;
