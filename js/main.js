'use strict';
let myLibrary = [];
let myCards = [];
// Gives ID's to the books
let gNextId = 0;
// Removes or adds the ability to add books
let toggleAdd = true;
// Removes or adds the ability to show message
let toggleShow = true;
// Disabling Right Click
document.addEventListener('contextmenu', event => event.preventDefault());

class Book {
    constructor(
        title = 'Unknown',
        pages = '0',
        maxPages = '0',
        isRead = 'false',
        bookId = gNextId++
    ) {
        this.title = title;
        this.pages = pages;
        this.maxPages = maxPages;
        this.isRead = isRead;
        this.bookId = bookId;
    }
}

// let bookOne = new Book('Harry Potter', 'J.K Micha', 10, 20, true)

// sidenav 
let header = document.querySelector('.sidenav header');
header.innerText = '<<';

// functions called
exitModal();

function adjustCursor() {
    let modal = document.querySelector('.book-container');
    let msg = document.querySelector('.msg-container');
    let body = document.querySelector('body');
    if (modal.classList.contains('opacity') || msg.style.visibility === 'visible') {
        body.style.pointerEvents = 'none';
        modal.style.pointerEvents = 'all';
        msg.style.pointerEvents = 'all';
    } else {
        body.style.pointerEvents = 'all';
    }
}

function showModal() {
    let modal = document.querySelector('.book-container');
    let msg = document.querySelector('.msg-container');
    let elTitle = document.querySelector('.title');
    let sidenav = document.querySelector('.sidenav');
    let wrapper = document.querySelector('.wrapper');
    if (msg.style.visibility === 'visible') {
        return;
    }
    modal.classList.remove('blur');
    sidenav.classList.add('blur');
    elTitle.classList.add('blur');
    wrapper.classList.add('blur');
    modal.classList.add('opacity');
    adjustCursor();
}

function exitModal() {
    let msgBtnNo = document.querySelector('.btn-no');
    let btnCancel = document.querySelector('.btn-cancel');
    let addBook = document.querySelector('.btn-add');
    window.onclick = function (event) {
        if (event.target === addBook && addBook.innerText !== '') {
            return;
        }
        if (event.target == msgBtnNo || event.target == btnCancel) {
            removeBlur();
        }
    }
}

function removeBlur() {
    let modal = document.querySelector('.book-container');
    let sidenav = document.querySelector('.sidenav');
    let msg = document.querySelector('.msg-container');
    let elTitle = document.querySelector('.title');
    let wrapper = document.querySelector('.wrapper');
    elTitle.classList.remove('blur');
    modal.classList.remove('opacity');
    sidenav.classList.remove('blur');
    wrapper.classList.remove('blur');
    msg.style.visibility = 'hidden';
    msg.style.opacity = '0';
    adjustCursor();
}

function addBlur() {
    let msg = document.querySelector('.msg-container');
    let modal = document.querySelector('.book-container');
    let sidenav = document.querySelector('.sidenav');
    let elTitle = document.querySelector('.title');
    let wrapper = document.querySelector('.wrapper');
    elTitle.classList.add('blur');
    sidenav.classList.add('blur');
    wrapper.classList.add('blur');
    msg.style.visibility = 'visible';
    msg.style.opacity = '1';
    adjustCursor();
}

function removeCard(btn) {
    let modal = document.querySelector('.book-container');
    if (modal.classList.contains('opacity')) {
        return;
    }
    addBlur();
    // let newDiv = document.createElement('div');
    // let btnParent = btn.parentNode;
    // btnParent.appendChild(newDiv);
    // let newContent = document.createTextNode('If you wish to delete please press again');
    // newDiv.classList.add('delete-msg');
    // console.log(btnParent);
    // newDiv.appendChild(newContent);
    // btn.addEventListener('click', () => {
    //     let bookName = btn.parentNode.bookName;
    //     console.log(bookName);
    //     let index = btn.parentNode.parentNode.parentNode;
    //     index.remove();
    // });
    // btn.removeEventListener('click');
}

function removeCardConfirm() {


}

function editCard() {

}

function addPages() {
    let cardPages = document.querySelector('.card-pages');
    let cardMaxPages = document.querySelector('.card-max-pages');

    if (Number(cardMaxPages.innerText) <= Number(cardPages.innerText)) {
        let newCardPages = Number(cardPages.innerText) + 1;
        cardMaxPages.innerText = newCardPages;
    }
    Number(cardPages.innerText++);
}

function reducePages() {
    let cardPages = document.querySelector('.card-pages');
    if (Number(cardPages.innerText) <= 0) {
        return;
    }
    Number(cardPages.innerText--);
}

function addMaxPages() {
    let cardMaxPages = document.querySelector('.card-max-pages');
    Number(cardMaxPages.innerText++);
}

function reduceMaxPages() {
    let cardPages = document.querySelector('.card-pages');
    let cardMaxPages = document.querySelector('.card-max-pages');
    if (cardMaxPages.innerText <= 0) {
        return;
    }
    if (Number(cardMaxPages.innerText) <= Number(cardPages.innerText)) {
        Number(cardPages.innerText--);
    }
    Number(cardMaxPages.innerText--);
}

function warnUser() {
    let titleInput = document.querySelector('#book-name').value;
    let pagesInput = document.querySelector('#pages').value;
    let maxPagesInput = document.querySelector('#max-pages').value;
    let pagesLabel = document.querySelector('#pages-label');
    let maxPagesLabel = document.querySelector('#max-pages-label');
    let titleLabel = document.querySelector('#book-label');
    if (titleInput === '') {
        maxPagesLabel.style.fontSize = '15px';
        titleLabel.innerText = 'A title must be inserted';
        titleLabel.style.color = 'red';
    }
    else {
        titleLabel.innerText = 'Book Title';
        titleLabel.style.color = 'grey';
    }
    if (Number(maxPagesInput) < Number(pagesInput) || Number(maxPagesInput) < 0) {
        maxPagesLabel.innerText = 'Invalid Number'
        maxPagesLabel.style.color = 'red';
    } else {
        maxPagesLabel.innerText = 'Total Pages';
        maxPagesLabel.style.color = 'pink';
    }
    if (Number(pagesInput) > Number(maxPagesInput) || Number(pagesInput) < 0) {
        pagesLabel.innerText = 'Invalid Number'
        pagesLabel.style.color = 'red';
    } else {
        pagesLabel.innerText = 'Number of Pages';
        pagesLabel.style.color = 'pink';
    }
}

function addCard() {
    let modal = document.querySelector('.book-container');
    let titleInput = document.querySelector('#book-name').value;
    let pagesInput = document.querySelector('#pages').value;
    let maxPagesInput = document.querySelector('#max-pages').value;
    warnUser();
    if (titleInput === '' || Number(pagesInput) > Number(maxPagesInput) || Number(pagesInput) < 0 || Number(maxPagesInput) < 0) {
        return;
    }
    myLibrary.push(new Book(titleInput, pagesInput, maxPagesInput));
    console.log(myLibrary);

    let wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML += createCard(myLibrary[myLibrary.length - 1]);
    let newCard = document.querySelectorAll(`#book-${myLibrary.length - 1}`);
    myCards.push(newCard[0]);
    modal.classList.remove('opacity');
    removeBlur();
    resetInputs();
}

function createCard(book) {
    let dateInput = document.querySelector('#date').value;
    let strHTML = `<div class="card" id="book-${book.bookId}">
    <div class="content">
        <div>
            <h1 class="card-head">BOOK TITLE</h1>
            <h2 class="card-title">${book.title}</h2>
        </div>
        <div class="card-btns-pages">
            <h1 class="card-pages-head">PAGE</h1>
            <h2 class="card-pages">${book.pages}</h2>
            <button class="btn-add-pages" onclick="addPages()">➕</button>
            <button class="btn-remove-pages" onclick="reducePages()">➖</button>

        </div>
        <div class="card-btns-max-pages">
            <h1 class="card-max-pages-head">MAX PAGES</h1>
            <h2 class="card-max-pages">${book.maxPages}</h2>
            <button class="btn-add-max-pages" onclick="addMaxPages()">➕</button>
            <button class="btn-remove-max-pages" onclick="reduceMaxPages()">➖</button>
        </div>
        <div>
            <h1 class="card-date-head"></h1>
            <h2 class="card-date">${dateInput}</h2>
        </div>
        <div class="btn-container">
            <button class="btn-edit" onclick="editCard(this)">EDIT</button>
            <button class="btn-remove" onclick="removeCard(this)">REMOVE</button>
        </div>
    </div>`
    return strHTML;
}

function resetInputs() {
    let titleInput = document.querySelector('#book-name');
    let pagesInput = document.querySelector('#pages');
    let maxPagesInput = document.querySelector('#max-pages');
    let dateInput = document.querySelector('#date');
    let pagesLabel = document.querySelector('#pages-label');
    let maxPagesLabel = document.querySelector('#max-pages-label');
    let titleLabel = document.querySelector('#book-label');
    pagesLabel.style.color = '';
    maxPagesLabel.style.color = '';
    titleLabel.style.color = '';
    titleInput.value = '';
    pagesInput.value = '';
    maxPagesInput.value = '';
    dateInput.value = '';
}

// PUT BOOK ID IN THE BUTTON IT SELF AND COMPARE WITH AN IF TO FIND THE CORRECT DIV