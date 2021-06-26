'use strict';
let myLibrary = [];
let myCards = [];
// Toggles a warning for the user's inputs
let toggleWarn = false;
// Card Deletion or Modification(edit)
let cardToModify;
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
        isRead = false,
        bookId = gNextId++,
    ) {
        this.title = title;
        this.pages = pages;
        this.maxPages = maxPages;
        this.isRead = isRead;
        this.bookId = bookId;
    }
}

// sidenav 
let header = document.querySelector('.sidenav header');
header.innerText = '<<';

function adjustCursor() {
    let modal = document.querySelector('.book-container');
    let msg = document.querySelector('.msg-container');
    let body = document.querySelector('body');
    let editModal = document.querySelector('.edit-container')
    if (editModal.classList.contains('opacity') || modal.classList.contains('opacity') || msg.classList.contains('opacity')) {
        body.style.pointerEvents = 'none';
        modal.style.pointerEvents = 'all';
        editModal.style.pointerEvents = 'all';
        msg.style.pointerEvents = 'all';
    } else {
        body.style.pointerEvents = 'all';
    }
}

function showModal() {
    let modal = document.querySelector('.book-container');
    addBlur();
    modal.classList.add('opacity');
    adjustCursor();
}

function exitModal(editBtn) {
    let msgBtnNo = document.querySelector('.btn-no');
    let btnCancel = document.querySelector('.btn-cancel');
    let btnConfirm = document.querySelector('.btn-yes');
    window.onclick = function (event) {
        if (event.target == editBtn || event.target == msgBtnNo || event.target == btnCancel || event.target == btnConfirm) {
            removeBlur();
            resetEditModalInputs();
        }
    }
}

function removeBlur() {
    let modal = document.querySelector('.book-container');
    let sidenav = document.querySelector('.sidenav');
    let msg = document.querySelector('.msg-container');
    let elTitle = document.querySelector('.title');
    let wrapper = document.querySelector('.wrapper');
    let editModal = document.querySelector('.edit-container');
    elTitle.classList.remove('blur');
    modal.classList.remove('opacity');
    msg.classList.remove('opacity');
    editModal.classList.remove('opacity');
    sidenav.classList.remove('blur');
    wrapper.classList.remove('blur');
    adjustCursor();
}

function addBlur() {
    let sidenav = document.querySelector('.sidenav');
    let elTitle = document.querySelector('.title');
    let wrapper = document.querySelector('.wrapper');
    elTitle.classList.add('blur');
    sidenav.classList.add('blur');
    wrapper.classList.add('blur');
    adjustCursor();
}

function removeCard(btn) {
    let msg = document.querySelector('.msg-container');
    msg.classList.add('opacity');
    addBlur();
    cardToModify = btn.parentNode.parentNode.parentNode;
}

function removeCardConfirm() {
    cardToModify.remove();
    let bookName = cardToModify.querySelector('.card-title').innerText;
    for (let i = 0; i < myLibrary.length; i++) {
        if (bookName === myLibrary[i].title) {
            myLibrary.splice(i, 1);
        }
    }
    updateSideNav();
    console.log(myLibrary);
}

function saveEdit() {
    let editTitle = document.querySelector('#edit-name').value;
    let editPages = document.querySelector('#edit-pages').value;
    let editMaxPages = document.querySelector('#edit-max-pages').value;
    let editDate = document.querySelector('#edit-date').value;
    let bookName = cardToModify.querySelector('.card-title');
    let cardPages = cardToModify.querySelector('.card-pages');
    let maxCardPages = cardToModify.querySelector('.card-max-pages');
    let cardDate = cardToModify.querySelector('.card-date');
    warnUserEdit();
    if (toggleWarn) {
        if (editPages === '' || editMaxPages === '' || editDate === '') {
            return;
        }
        return;
    }
    for (let i = 0; i < myLibrary.length; i++) {
        if (bookName.innerText === myLibrary[i].title) {
            // Change Book Title (both in the constructor and card)
            myLibrary[i].title = editTitle;
            bookName.innerText = editTitle;
            // Change Book Pages (both in the constructor and card)
            myLibrary[i].pages = Number(editPages);
            cardPages.innerText = Number(editPages);
            // Change Book Total Pages (both in the constructor and card)
            myLibrary[i].maxPages = Number(editMaxPages);
            maxCardPages.innerText = Number(editMaxPages);
            // Change Book Date (both in the card)
            cardDate.innerText = editDate;
        }
    }
    updateSideNav();
    resetEditModalInputs();
    removeBlur();
}

function warnUserEdit() {
    let editTitle = document.querySelector('#edit-name').value;
    let editPages = document.querySelector('#edit-pages').value;
    let editMaxPages = document.querySelector('#edit-max-pages').value;
    let editBookLabel = document.querySelector('#edit-book-label');
    let editPagesLabel = document.querySelector('#edit-pages-label');
    let editMaxPagesLabel = document.querySelector('#edit-max-pages-label');
    let chosenCardTitle = cardToModify.querySelector('.card-title').innerText;
    for (let i = 0; i < myLibrary.length; i++) {
        if (editTitle === chosenCardTitle) {
            console.log(chosenCardTitle, editTitle);
            break;
        }
        if (editTitle === myLibrary[i].title) {
            editBookLabel.innerText = 'Book Exists';
            editBookLabel.style.color = 'darkred';
            toggleWarn = true;
            return;
        }
    }
    if (editTitle === '') {
        toggleWarn = true;
    }
    else {
        toggleWarn = false;
    }
    if (Number(editMaxPages) < Number(editPages) || Number(editMaxPages) < 0) {
        editMaxPagesLabel.innerText = 'Invalid Number'
        editMaxPagesLabel.style.color = 'darkred';
        toggleWarn = true;
    } else {
        editMaxPagesLabel.innerText = 'Total Pages';
        editMaxPagesLabel.style.color = '';
    }
    if (Number(editPages) > Number(editMaxPages) || Number(editPages) < 0) {
        editPagesLabel.innerText = 'Invalid Number'
        editPagesLabel.style.color = 'darkred';
        toggleWarn = true;
    } else {
        editPagesLabel.innerText = 'Current Page';
        editPagesLabel.style.color = '';
    }
}

function showEdit(btn) {
    // Capture edit elements ( user inputs to edit the card )
    let editModal = document.querySelector('.edit-container');
    let editTitle = document.querySelector('#edit-name');
    let editPages = document.querySelector('#edit-pages');
    let editMaxPages = document.querySelector('#edit-max-pages');
    let editDate = document.querySelector('#edit-date');
    // Transition class
    editModal.classList.add('opacity');
    // Capture the card you want to edit by pressing the button
    cardToModify = btn.parentNode.parentNode.parentNode;
    // Capture specific card elements to modify
    let cardTitle = cardToModify.querySelector('.card-title').innerText;
    let cardPages = cardToModify.querySelector('.card-pages').innerText;
    let cardMaxPages = cardToModify.querySelector('.card-max-pages').innerText;
    let cardDate = cardToModify.querySelector('.card-date').innerText;
    // Book edit inputs/placeholders are the same as the card's
    editTitle.value = cardTitle;
    editPages.value = cardPages;
    editMaxPages.value = cardMaxPages;
    editDate.value = cardDate;
    addBlur();
    updateSideNav();
}

function unfinishedBook() {
    let cardHead = cardToModify.querySelector('.card-head');
    let cardPagesHead = cardToModify.querySelector('.card-pages-head');
    let cardMaxPagesHead = cardToModify.querySelector('.card-max-pages-head');
    cardToModify.style.borderColor = '';
    cardToModify.style.backgroundColor = '';
    cardHead.style.backgroundColor = '';
    cardPagesHead.style.backgroundColor = '';
    cardMaxPagesHead.style.backgroundColor = '';
    cardToModify.style.transform = ''
}

function finishedBook() {
    let cardTitle = cardToModify.querySelector('.card-title');
    let cardPages = cardToModify.querySelector('.card-pages');
    let cardMaxPages = cardToModify.querySelector('.card-max-pages');
    let cardHead = cardToModify.querySelector('.card-head');
    let cardPagesHead = cardToModify.querySelector('.card-pages-head');
    let cardMaxPagesHead = cardToModify.querySelector('.card-max-pages-head');
    if (Number(cardPages.innerText) === 0 && Number(cardMaxPages.innerText) === 0) {
        unfinishedBook();
        return;
    }
    for (let i = 0; i < myLibrary.length; i++) {
        // If the name of the card is the same as the name of the book constructor, change read status.
        if (cardTitle.innerText === myLibrary[i].title && Number(cardPages.innerText) === Number(cardMaxPages.innerText)) {
            myLibrary[i].isRead = true;
            if (myLibrary[i].isRead) {
                cardToModify.style.backgroundColor = '#468a2e';
                cardToModify.style.borderColor = 'green';
                cardToModify.style.transform = 'rotateZ(5deg)';
                cardHead.style.backgroundColor = 'black';
                cardPagesHead.style.backgroundColor = 'black';
                cardMaxPagesHead.style.backgroundColor = 'black';
            }
        }
        if (cardTitle.innerText === myLibrary[i].title && Number(cardPages.innerText) !== Number(cardMaxPages.innerText)) {
            myLibrary[i].isRead = false;
            unfinishedBook();
        }
        console.log(myLibrary);
    }
    updateSideNav();
}

function addPages(btn) {
    cardToModify = btn.parentNode.parentNode.parentNode;
    let cardPages = cardToModify.querySelector('.card-pages');
    let cardMaxPages = cardToModify.querySelector('.card-max-pages');
    let cardTitle = cardToModify.querySelector('.card-title');
    Number(cardPages.innerText++);
    for (let i = 0; i < myLibrary.length; i++) {
        // If the name of the card is the same as the name of the book constructor, change pages num.
        if (cardTitle.innerText === myLibrary[i].title) {
            myLibrary[i].pages = Number(cardPages.innerText);
            myLibrary[i].maxPages = Number(cardMaxPages.innerText);
            // Card max pages will be the same as pages num, if they're equal or smaller.
            if (Number(cardMaxPages.innerText) <= Number(cardPages.innerText)) {
                myLibrary[i].maxPages = myLibrary[i].pages;
                cardMaxPages.innerText = cardPages.innerText;
            }
        }
    }
    finishedBook();
}

function reducePages(btn) {
    cardToModify = btn.parentNode.parentNode.parentNode;
    let cardPages = cardToModify.querySelector('.card-pages');
    let cardTitle = cardToModify.querySelector('.card-title');
    Number(cardPages.innerText--);
    for (let i = 0; i < myLibrary.length; i++) {
        // If the name of the card is the same as the name of the book constructor, change pages num.
        if (cardTitle.innerText === myLibrary[i].title) {
            myLibrary[i].pages = Number(cardPages.innerText);
            // Cannot go below 0, and if you try, it will be 0.
            if (Number(cardPages.innerText) <= 0) {
                cardPages.innerText = 0;
                myLibrary[i].pages = 0;
            }
        }
    }
    finishedBook();
}

function addMaxPages(btn) {
    cardToModify = btn.parentNode.parentNode.parentNode;
    let cardMaxPages = cardToModify.querySelector('.card-max-pages');
    let cardTitle = cardToModify.querySelector('.card-title');
    Number(cardMaxPages.innerText++);
    for (let i = 0; i < myLibrary.length; i++) {
        // If the name of the card is the same as the name of the book constructor, change max pages num.
        if (cardTitle.innerText === myLibrary[i].title) {
            myLibrary[i].maxPages = Number(cardMaxPages.innerText);
        }
    }
    finishedBook();
}

function reduceMaxPages(btn) {
    cardToModify = btn.parentNode.parentNode.parentNode;
    let cardPages = cardToModify.querySelector('.card-pages');
    let cardMaxPages = cardToModify.querySelector('.card-max-pages');
    let cardTitle = cardToModify.querySelector('.card-title');
    Number(cardMaxPages.innerText--);
    for (let i = 0; i < myLibrary.length; i++) {
        // If the name of the card is the same as the name of the book constructor, change max pages num.
        if (cardTitle.innerText === myLibrary[i].title) {
            myLibrary[i].maxPages = Number(cardMaxPages.innerText);
        }
        if (Number(cardMaxPages.innerText) <= 0) {
            cardMaxPages.innerText = 0;
            myLibrary[i].maxPages = 0;
        }
        // Card max pages will be the same as pages num, if they're equal or smaller.
        if (Number(cardPages.innerText) >= Number(cardMaxPages.innerText)) {
            myLibrary[i].pages = myLibrary[i].maxPages;
            cardPages.innerText = cardMaxPages.innerText;
        }
    }
    finishedBook();
}

function warnUser() {
    let titleInput = document.querySelector('#book-name').value;
    let pagesInput = document.querySelector('#pages').value;
    let maxPagesInput = document.querySelector('#max-pages').value;
    let pagesLabel = document.querySelector('#pages-label');
    let maxPagesLabel = document.querySelector('#max-pages-label');
    let titleLabel = document.querySelector('#book-label');
    for (let i = 0; i < myLibrary.length; i++) {
        if (titleInput === myLibrary[i].title) {
            titleLabel.innerText = 'Book Exists';
            titleLabel.style.color = 'red';
            toggleWarn = true;
            return;
        }
    }
    if (titleInput === '') {
        titleLabel.innerText = 'A title must be inserted';
        titleLabel.style.color = 'red';
        toggleWarn = true;
    }
    else {
        titleLabel.innerText = 'Book Title';
        titleLabel.style.color = 'pink';
        toggleWarn = false;
    }
    if (Number(maxPagesInput) < Number(pagesInput) || Number(maxPagesInput) < 0) {
        maxPagesLabel.innerText = 'Invalid Number'
        maxPagesLabel.style.color = 'red';
        toggleWarn = true;
    } else {
        maxPagesLabel.innerText = 'Total Pages';
        maxPagesLabel.style.color = '';
    }
    if (Number(pagesInput) > Number(maxPagesInput) || Number(pagesInput) < 0) {
        pagesLabel.innerText = 'Invalid Number'
        pagesLabel.style.color = 'red';
        toggleWarn = true;
    } else {
        pagesLabel.innerText = 'Current Page';
        pagesLabel.style.color = '';
    }
}

function updateSideNav() {
    let booksNum = document.querySelector('#item1');
    let completedBooks = document.querySelector('#item2');
    let pagesSum = document.querySelector('#item3');
    let booksPagesSum = 0;
    let booksCount = 0;
    booksNum.innerText = `Books: ${myLibrary.length}`;
    for (let i = 0; i < myLibrary.length; i++) {
        booksPagesSum += myLibrary[i].maxPages;
        if (myLibrary[i].pages === myLibrary[i].maxPages && myLibrary[i].pages !== 0 && myLibrary[i].maxPages !== 0) {
            booksCount++;
        }
    }
    pagesSum.innerText = `Total Pages: ${booksPagesSum}`;
    completedBooks.innerText = `Completed Books: ${booksCount}`;
}

function addCard() {
    let modal = document.querySelector('.book-container');
    let titleInput = document.querySelector('#book-name').value;
    let pagesInput = document.querySelector('#pages').value;
    let maxPagesInput = document.querySelector('#max-pages').value;
    warnUser();
    if (toggleWarn) {
        return;
    }
    myLibrary.push(new Book(titleInput, Number(pagesInput), Number(maxPagesInput)));
    let wrapper = document.querySelector('.wrapper');
    wrapper.innerHTML += createCard(myLibrary[myLibrary.length - 1]);
    let newCard = document.querySelectorAll(`#book-${myLibrary.length - 1}`);
    myCards.push(newCard[0]);
    modal.classList.remove('opacity');
    removeBlur();
    updateSideNav();
    console.log(myLibrary);
    resetInputs();
}

function createCard(book) {
    let dateInput = document.querySelector('#date').value;
    let strHTML = `<div class="card" id="book-${book.bookId}">
    <div class="content">
    <h1 class="card-head">BOOK TITLE</h1>
    <div class="card-title">${book.title}</div>
    <h1 class="card-pages-head">PAGE</h1>
    <div class="card-date">${dateInput}</div>
        <div class="card-btns-pages">
            <button class="btn-add-pages" onclick="addPages(this)">➕</button>
            <div class="card-pages">${book.pages}</div>
            <button class="btn-remove-pages" onclick="reducePages(this)">➖</button>
        </div>
        <h1 class="card-max-pages-head">MAX PAGES</h1>
        <div class="card-btns-max-pages">
        <button class="btn-add-max-pages" onclick="addMaxPages(this)">➕</button>
        <div class="card-max-pages">${book.maxPages}</div>
            <button class="btn-remove-max-pages" onclick="reduceMaxPages(this)">➖</button>
        </div>
        <div class="btn-container">
            <button class="btn-edit" onclick="showEdit(this)">EDIT</button>
            <button class="btn-remove" onclick="removeCard(this)">REMOVE</button>
        </div>
    </div>`
    return strHTML;
}

function resetInputs() {
    // ADD BOOK MODAL RESET
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

function resetEditModalInputs() {
    //    EDIT MODAL RESET
    let editTitle = document.querySelector('#edit-name');
    let editPages = document.querySelector('#edit-pages');
    let editMaxPages = document.querySelector('#edit-max-pages');
    let editBookLabel = document.querySelector('#edit-book-label');
    let editPagesLabel = document.querySelector('#edit-pages-label');
    let editMaxPagesLabel = document.querySelector('#edit-max-pages-label');
    let editDate = document.querySelector('#edit-date');
    editTitle.value = '';
    editPages.value = '';
    editMaxPages.value = '';
    editBookLabel.innerText = 'New Title';
    editBookLabel.style.color = '';
    editPagesLabel.style.color = '';
    editMaxPagesLabel.style.color = '';
    editDate.value = '';
}

function removeKeys(event) {
    return event.charCode >= 48 && event.charCode <= 57;
}