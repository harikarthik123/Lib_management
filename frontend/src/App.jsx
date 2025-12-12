import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:3000'

function App() {
  const [books, setBooks] = useState([])
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [editingBook, setEditingBook] = useState(null)
  const [editBookName, setEditBookName] = useState('')
  const [editAuthor, setEditAuthor] = useState('')

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/read`)
      setBooks(response.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Add a new book
  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!bookName || !author) {
      alert('Please fill in all fields')
      return
    }

    try {
      await axios.post(`${API_URL}/insert`, {
        bookName,
        author
      })
      setBookName('')
      setAuthor('')
      fetchBooks()
    } catch (error) {
      console.error('Error adding book:', error)
      alert('Error adding book')
    }
  }

  // Start editing a book
  const startEdit = (book) => {
    setEditingBook(book._id)
    setEditBookName(book.BookName)
    setEditAuthor(book.Author)
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingBook(null)
    setEditBookName('')
    setEditAuthor('')
  }

  // Update a book
  const handleUpdateBook = async (bookId) => {
    if (!editBookName || !editAuthor) {
      alert('Please fill in all fields')
      return
    }

    try {
      await axios.put(`${API_URL}/update`, {
        bookId,
        newBookName: editBookName,
        newAuthorName: editAuthor
      })
      setEditingBook(null)
      setEditBookName('')
      setEditAuthor('')
      fetchBooks()
    } catch (error) {
      console.error('Error updating book:', error)
      alert('Error updating book')
    }
  }

  // Delete a book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/delete/${bookId}`)
      fetchBooks()
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Error deleting book')
    }
  }

  return (
    <div className="app">
      <h1>📚 Library Management System</h1>

      <div className="container">
        {/* Add Book Form */}
        <div className="form-section">
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button type="submit">Add Book</button>
          </form>
        </div>

        {/* Books List */}
        <div className="books-section">
          <h2>Books List ({books.length})</h2>
          {books.length === 0 ? (
            <p className="no-books">No books in the library yet. Add one above!</p>
          ) : (
            <div className="books-list">
              {books.map((book) => (
                <div key={book._id} className="book-card">
                  {editingBook === book._id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editBookName}
                        onChange={(e) => setEditBookName(e.target.value)}
                        placeholder="Book Name"
                      />
                      <input
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        placeholder="Author"
                      />
                      <div className="edit-buttons">
                        <button onClick={() => handleUpdateBook(book._id)} className="save-btn">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="book-info">
                        <h3>{book.BookName}</h3>
                        <p>by {book.Author}</p>
                      </div>
                      <div className="book-actions">
                        <button onClick={() => startEdit(book)} className="edit-btn">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteBook(book._id)} className="delete-btn">
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

