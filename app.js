class Book {
  constructor(title, author, pages, isbn, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isbn = isbn;
    this.read = read;
  }
}

class UI {
  static addElement(book) {
    const results = document.querySelector(".results");
    const card = document.createElement("div");
    console.log(book.read + " heere");
    card.classList = "card results-item";
    card.dataset.id = `${book.isbn}`;
    const content = `<div class="card-header">
                        <button
                            type="button"
                            class="close-card"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>    
                    <div class="card-body">        
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">By: ${book.author}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">Pages: ${book.pages}</h6>
                        <h6 class="card-subtitle mb-2 text-muted">ISBN: ${book.isbn}</h6>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" id="read">
                            <label class="form-check-label" for="read">Read?</label>
                      </div>
                    </div>`;
    card.innerHTML = content;
    results.appendChild(card);
    if (book.read) {
      card.classList.add("read");
      const addedCard = document.querySelector(`div[data-id="${book.isbn}"]`);
      addedCard.querySelector(".form-check-input").checked = true;
    }
  }

  static clearForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#pages").value = "";
    document.querySelector("#isbn").value = "";
    document.querySelector("#read").checked = false;
  }

  static hideModal() {
    $("#exampleModal").modal("hide");
  }

  static loadBooks() {
    let books = JSON.parse(localStorage.getItem("books"));
    if (books) {
      books.forEach((element) => {
        this.addElement(element);
      });
    }
  }

  static removeBook(element) {
    element.parentElement.parentElement.remove();
  }

  static addReadColor(element, readFlag) {
    readFlag
      ? element.parentElement.parentElement.parentElement.classList.add("read")
      : element.parentElement.parentElement.parentElement.classList.remove(
          "read"
        );
  }

  static bookCounter() {
    let totalBooks;
    let readBooks;
    let unreadBooks;    
    let books = JSON.parse(localStorage.getItem("books"));
    totalBooks = books.length;
    readBooks = books.filter((book) => book.read === true).length;
    unreadBooks = totalBooks - readBooks;
    console.log('total ' + totalBooks + 'read ' + readBooks + 'unread ' + unreadBooks);

    const totalBooksElement = document.querySelector('td[data-id="total"]');
    const readBooksElement = document.querySelector('td[data-id="read"]');
    const unreadBooksElement = document.querySelector('td[data-id="unread"]');
    totalBooksElement.textContent = totalBooks;
    readBooksElement.textContent = readBooks;
    unreadBooksElement.textContent = unreadBooks;
  }
}

class Storage {
  static getBooks() {
    let books;
    if (!localStorage.getItem("books")) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let existentBooks = this.getBooks();
    existentBooks.push(book);
    localStorage.setItem("books", JSON.stringify(existentBooks));
  }

  static removeBook(id) {
    let books = this.getBooks();
    books.forEach((element, index) => {
      if (element.isbn === id) {
        console.log("inside");
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }

  static updateReadStatus(id, status) {
    let books = this.getBooks();
    books.forEach((element, index) => {
      if (element.isbn === id) {
        element.read = status;
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

document.addEventListener("DOMContentLoaded", () => {
    UI.loadBooks();
    UI.bookCounter();
});

const form = document.querySelector("#book-form");
const resultGrid = document.querySelector(".results");

form.addEventListener("submit", (e) => {
  console.log("onsubmit");
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const isbn = document.querySelector("#isbn").value;
  const read = document.querySelector("#read").checked;
  console.log(read);
  const book = new Book(title, author, pages, isbn, read);
  UI.addElement(book);  
  UI.clearForm();
  UI.hideModal();
  Storage.addBook(book);
  UI.bookCounter();
});

resultGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-card")) {
    const id = e.target.parentElement.parentElement.dataset.id;
    UI.removeBook(e.target);
    Storage.removeBook(id);
    UI.bookCounter();
  }

  if (e.target.classList.contains("form-check-input")) {
    const id = e.target.parentElement.parentElement.parentElement.dataset.id;
    console.log("here " + e.target.checked + id);
    UI.addReadColor(e.target, e.target.checked);
    Storage.updateReadStatus(id, e.target.checked);
    UI.bookCounter();
  }
});
