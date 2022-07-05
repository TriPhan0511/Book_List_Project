// DUMMY DATA
// const item = [
//   { title: 'Book One', author: 'Alex', isbn: '1' },
//   { title: 'Book Two', author: 'Brad', isbn: '2' },
//   { title: 'Book Three', author: 'Camelia', isbn: '3' },
//   { title: 'Book Four', author: 'Danny', isbn: '4' },
//   { title: 'Book Five', author: 'Fred', isbn: '5' },
// ];
// localStorage.setItem('books', JSON.stringify(item));

// Book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class
class UI {
  // Show message
  showMessage(message, errorClass, elementID = 'book-form') {
    const para = document.createElement('p');
    para.className = errorClass;
    para.appendChild(document.createTextNode(message));
    document.querySelector(`#${elementID}`).insertAdjacentElement('beforebegin', para);

    // Remove error message after 2 seconds
    setTimeout(function () {
      para.remove();
    }, 2000);
  }

  // Add book to list
  addBookToList(book, tableBody, rowClassName = 'book-item', deleteItemClassName = 'delete') {
    const tableRow = document.createElement('tr');
    tableRow.classList.add(rowClassName);
    Object.getOwnPropertyNames(book).forEach((prop) => {
      const tableData = document.createElement('td');
      tableData.appendChild(document.createTextNode(book[prop]));
      tableRow.appendChild(tableData);
    });
    const lastTableData = document.createElement('td');
    const link = document.createElement('a');
    link.setAttribute('href', '#');
    link.classList.add(deleteItemClassName);
    link.appendChild(document.createTextNode('X'));
    lastTableData.appendChild(link);
    tableRow.appendChild(lastTableData);
    tableBody.appendChild(tableRow);
  }

  // Clear fields
  clearFields(...fields) {
    fields.forEach((field) => {
      field.value = '';
    });
  }

  // Delete book
  deleteBook(target) {
    if (target && target.parentElement && target.parentElement.parentElement) {
      target.parentElement.parentElement.remove();
    }
  }

  // Clear all books
  clearBooks(rowClassName = 'book-item', formId = 'book-form') {
    const books = document.querySelectorAll(`.${rowClassName}`);
    if (books.length !== 0) {
      books.forEach((item) => {
        item.remove();
      });

      this.showMessage('Books Cleared!', 'success', formId);
    }
  }

  // Load books from local storage into table
  loadBooksIntoList(books, tableBody) {
    if (books) {
      books.forEach((book) => {
        this.addBookToList(book, tableBody);
      });
    }
  }

  // Add book to local storage
  addBookToLocalStorage(book) {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  // Clear books from local storage
  clearBooksFromLocalStorage() {
    localStorage.removeItem('books');
  }

  // Delete book from local storage
  deleteBookFromLocalStorage(book) {
    const books = JSON.parse(localStorage.getItem('books'));
    console.log(books); // TESTING
    if (books !== null) {
      books.forEach((currentBook, index) => {
        if (currentBook.isbn === book.isbn) {
          books.splice(index, 1);
        }
      });

      localStorage.setItem('books', JSON.stringify(books));
    }
  }

  // Get book
  getBook(target) {
    const fourthTableData = target.parentElement;
    const thirdTableData = fourthTableData.previousElementSibling;
    const isbn = thirdTableData.textContent;
    const secondTableData = thirdTableData.previousElementSibling;
    const author = secondTableData.textContent;
    const firstTableData = secondTableData.previousElementSibling;
    const title = firstTableData.textContent;
    return new Book(title, author, isbn);
  }
}
// ---------------------------------------------------------------------------------------------------------------

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  const books = JSON.parse(localStorage.getItem('books'));
  const list = document.querySelector('#book-list');
  const ui = new UI();
  ui.loadBooksIntoList(books, list);
});

// Event listener for add book
document.querySelector('#book-form').addEventListener('submit', function (e) {
  // Instatiate a UI object
  const ui = new UI();

  // Form inputs
  const title = document.querySelector('#title');
  const author = document.querySelector('#author');
  const isbn = document.querySelector('#isbn');

  // Validate
  if (title.value === '' || author.value === '' || isbn.value === '') {
    ui.showMessage('Please fill in all fields', 'error', e.target.id);
  } else {
    // Add book to list
    const book = new Book(title.value, author.value, isbn.value);
    const list = document.querySelector('#book-list');
    ui.addBookToList(book, list);

    // Add book to local storage
    ui.addBookToLocalStorage(book);

    // Show message
    ui.showMessage('Book Added!', 'success', e.target.id);

    // Clear input fields
    ui.clearFields(title, author, isbn);
    // Set focus for title field
    title.focus();
  }

  e.preventDefault();
});

// Event listener for delete book
document.querySelector('#book-list').addEventListener('click', function (e) {
  if (e.target.classList.contains('delete')) {
    const ui = new UI();
    ui.deleteBook(e.target);
    ui.showMessage('Book Deleted!', 'success', 'book-form');

    // Delete book from local storage
    const book = ui.getBook(e.target);
    ui.deleteBookFromLocalStorage(book);
  }

  e.preventDefault();
});

// Event listener for clear all books
document.querySelector('#clear-books').addEventListener('click', function () {
  const ui = new UI();
  ui.clearBooks();
  ui.clearBooksFromLocalStorage();
});
