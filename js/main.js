'use strict';
let myLibrary = [];
// Toggles a warning for the user's inputs
let toggleWarning = false;
// Card Deletion or Modification(edit)
let cardToModify;
// Gives ID's to the books
let gNextId = 0;
// Disabling Right Click
document.addEventListener('contextmenu', event => event.preventDefault());
// Initializing some values to a specific value
let editBookLabel = document.querySelector('#edit-book-label');
editBookLabel.innerText = 'Current Title';
editBookLabel.style.color = '#828824';
// sidenav 
let header = document.querySelector('.sidenav header');
header.innerText = '<<';

class Book {
    constructor(
        title = 'Unknown',
        pages = '0',
        maxPages = '0',
        isRead = false,
        date = '',
        bookId = gNextId++,
    ) {
        this.title = title;
        this.pages = pages;
        this.maxPages = maxPages;
        this.isRead = isRead;
        this.date = date;
        this.bookId = bookId;
    }
}

function adjustCursor() {
    let modal = document.querySelector('.book-container');
    let msg = document.querySelector('.msg-container');
    let msgLocal = document.querySelector('.msg-local-container');
    let body = document.querySelector('body');
    let editModal = document.querySelector('.edit-container')
    if (msgLocal.classList.contains('opacity') || editModal.classList.contains('opacity') || modal.classList.contains('opacity') || msg.classList.contains('opacity')) {
        body.style.pointerEvents = 'none';
        modal.style.pointerEvents = 'all';
        msgLocal.style.pointerEvents = 'all';
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
    let btnCancelLocal = document.querySelector('.btn-local-no');
    let btnConfirm = document.querySelector('.btn-yes');
    let btnConfirmLocal = document.querySelector('.btn-local-yes');
    window.onclick = function (event) {
        if (event.target == btnConfirmLocal || event.target == btnCancelLocal || event.target == editBtn || event.target == msgBtnNo || event.target == btnCancel || event.target == btnConfirm) {
            removeBlur();
            resetEditModalInputs();
        }
    }
}

function removeBlur() {
    let modal = document.querySelector('.book-container');
    let sidenav = document.querySelector('.sidenav');
    let msg = document.querySelector('.msg-container');
    let msgLocal = document.querySelector('.msg-local-container');
    let elTitle = document.querySelector('.title');
    let wrapper = document.querySelector('.wrapper');
    let editModal = document.querySelector('.edit-container');
    elTitle.classList.remove('blur');
    modal.classList.remove('opacity');
    msg.classList.remove('opacity');
    msgLocal.classList.remove('opacity');
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
    updateStorageDetails();
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
    // Removes unnecessary spaces
    editTitle = editTitle.trim();
    if (toggleWarning) {
        if (editPages === '' || editMaxPages === '' || editDate === '') {
            return;
        }
        return;
    }
    for (let i = 0; i < myLibrary.length; i++) {
        if (bookName.innerText === myLibrary[i].title) {
            // Removes unnecessary spaces
            editTitle = editTitle.trim();
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
            myLibrary[i].date = editDate;
            cardDate.innerText = editDate;
        }
    }
    updateSideNav();
    resetEditModalInputs();
    finishedBook();
    removeBlur();
    removeSpaces();
    updateStorageDetails();
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
            editBookLabel.innerText = 'Current Title';
            editBookLabel.style.color = '#828824';
            toggleWarning = false;
            break;
        }
        if (editTitle === myLibrary[i].title) {
            editBookLabel.innerText = 'Book Exists';
            editBookLabel.style.color = 'darkred';
            toggleWarning = true;
            break;
        }
        if (editTitle !== myLibrary[i].title) {
            editBookLabel.innerText = 'New Title';
            editBookLabel.style.color = '';
            toggleWarning = false;
        }
    }
    if (editTitle === '') {
        toggleWarning = true;
    }
    if (Number(editMaxPages) < Number(editPages) || Number(editMaxPages) < 0) {
        editMaxPagesLabel.innerText = 'Invalid Number'
        editMaxPagesLabel.style.color = 'darkred';
        toggleWarning = true;
    } else {
        editMaxPagesLabel.innerText = 'Total Pages';
        editMaxPagesLabel.style.color = '';
    }
    if (Number(editPages) > Number(editMaxPages) || Number(editPages) < 0) {
        editPagesLabel.innerText = 'Invalid Number'
        editPagesLabel.style.color = 'darkred';
        toggleWarning = true;
    } else {
        editPagesLabel.innerText = 'Current Page';
        editPagesLabel.style.color = '';
    }
    finishedBook();
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
    updateStorageDetails()
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
    }
    updateSideNav();
    updateStorageDetails();
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
    updateStorageDetails();
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
    updateStorageDetails();
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
    updateStorageDetails();
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
    updateStorageDetails();
}

function warnUser() {
    let titleInput = document.querySelector('#book-name').value;
    let pagesInput = document.querySelector('#pages').value;
    let maxPagesInput = document.querySelector('#max-pages').value;
    let pagesLabel = document.querySelector('#pages-label');
    let maxPagesLabel = document.querySelector('#max-pages-label');
    let titleLabel = document.querySelector('#book-label');
    titleInput = titleInput.trim();
    for (let i = 0; i < myLibrary.length; i++) {
        if (titleInput === myLibrary[i].title) {
            titleLabel.innerText = 'Book Exists';
            titleLabel.style.color = 'red';
            toggleWarning = true;
            return;
        }
    }
    if (titleInput === '') {
        titleLabel.innerText = 'A title must be inserted';
        titleLabel.style.color = 'red';
        toggleWarning = true;
    }
    else {
        titleLabel.innerText = 'Book Title';
        titleLabel.style.color = '';
        toggleWarning = false;
    }
    if (Number(maxPagesInput) < Number(pagesInput) || Number(maxPagesInput) < 0) {
        maxPagesLabel.innerText = 'Invalid Number'
        maxPagesLabel.style.color = 'red';
        toggleWarning = true;
    } else {
        maxPagesLabel.innerText = 'Total Pages';
        maxPagesLabel.style.color = '';
    }
    if (Number(pagesInput) > Number(maxPagesInput) || Number(pagesInput) < 0) {
        pagesLabel.innerText = 'Invalid Number'
        pagesLabel.style.color = 'red';
        toggleWarning = true;
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
    let completedBooksCount = 0;
    booksNum.innerText = `Books: ${myLibrary.length}`;
    for (let i = 0; i < myLibrary.length; i++) {
        booksPagesSum += myLibrary[i].maxPages;
        if (myLibrary[i].isRead) {
            completedBooksCount++;
        }
    }
    pagesSum.innerText = `Total Pages: ${booksPagesSum}`;
    completedBooks.innerText = `Completed Books: ${completedBooksCount}`;
}

function addCard() {
    let modal = document.querySelector('.book-container');
    let titleInput = document.querySelector('#book-name').value;
    let pagesInput = document.querySelector('#pages').value;
    let maxPagesInput = document.querySelector('#max-pages').value;
    let dateInput = document.querySelector('#date').value;
    if (toggleWarning) {
        return;
    }
    // Removes unnecessary spaces
    titleInput = titleInput.trim();
    myLibrary.push(new Book(titleInput, Number(pagesInput), Number(maxPagesInput), false, dateInput));
    let wrapper = document.querySelector('.wrapper');
    let newCard = createCard(myLibrary[myLibrary.length - 1]);
    wrapper.innerHTML += newCard;
    modal.classList.remove('opacity');
    removeBlur();
    updateSideNav();
    removeSpaces();
    resetInputs();
    updateStorageDetails();
}

function createCard(book) {
    let strHTML = `<div class="card" id="book-${book.bookId}">
    <div class="content">
    <h1 class="card-head">BOOK TITLE</h1>
    <div class="card-title">${book.title}</div>
    <h1 class="card-pages-head">PAGE</h1>
    <div class="card-date">${book.date}</div>
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
    editBookLabel.innerText = 'Current Title';
    editBookLabel.style.color = '#828824';
    editPagesLabel.style.color = '';
    editMaxPagesLabel.style.color = '';
    editDate.value = '';
}

function removeSpaces() {
    if (myLibrary.length === 0) {
        return;
    }
    // REMOVES UNNECESSARY SPACES
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title.includes(' ')) {
            myLibrary[i].title = myLibrary[i].title.replace(/  +/g, ' ');
        }
    }
}

function updateBookStatus() {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].isRead) {
            let card = document.querySelectorAll('.card');
            let cardHead = document.querySelectorAll('.card-head');
            let cardPagesHead = document.querySelectorAll('.card-pages-head');
            let cardMaxPagesHead = document.querySelectorAll('.card-max-pages-head');
            card[i].style.backgroundColor = '#468a2e';
            card[i].style.borderColor = 'green';
            card[i].style.transform = 'rotateZ(5deg)';
            cardHead[i].style.backgroundColor = 'black';
            cardPagesHead[i].style.backgroundColor = 'black';
            cardMaxPagesHead[i].style.backgroundColor = 'black';
        }
    }
}

// Local Storage
function populateStorage() {
    let wrapper = document.querySelector('.wrapper');
    if (localStorage.length === 0) {
        return;
    }
    let library = JSON.parse(localStorage.getItem('library'));
    for (let i = 0; i < library.length; i++) {
        myLibrary.push(library[i]);
        wrapper.innerHTML += createCard(library[i]);
    }
    updateBookStatus();
    updateSideNav();
}

function updateStorageDetails() {
    localStorage.setItem('library', JSON.stringify(myLibrary));
}

function showMsgConfirm() {
    let msgLocal = document.querySelector('.msg-local-container');
    addBlur();
    msgLocal.classList.add('opacity');
    adjustCursor();
}

function removeMsgConfrim() {
    let body = document.querySelector('body');
    body.style.pointerEvents = 'none';
    let btnConfirmLocal = document.querySelector('.btn-local-yes');
    let msgLocal = document.querySelector('.msg-local-container');
    let sidenav = document.querySelector('.sidenav');
    let elTitle = document.querySelector('.title');
    let wrapper = document.querySelector('.wrapper');
    window.onclick = function (event) {
        if (event.target == btnConfirmLocal) {
            msgLocal.classList.remove('opacity');
            sidenav.classList.remove('blur');
            elTitle.classList.remove('blur');
            wrapper.classList.remove('blur');
        }
    }
}

function deleteLocal() {
    let btnLocal = document.querySelector('#btn-storage');
    let title = document.querySelector('.title');
    let titleText = document.querySelector('.title span');
    // Title animation start
    title.style.backgroundColor = 'red';
    // Button press animation start
    btnLocal.style.backgroundColor = 'red';
    btnLocal.style.transform = 'translateX(-550px)';
    btnLocal.innerText = 'Deleting Local Storage...';
    // Text within title animation start
    titleText.style.color = 'black';
    titleText.style.transform = 'translateX(550px)';
    // Unset the animation on a timer
    setTimeout(() => {
        title.style.backgroundColor = '';
        btnLocal.style.transform = '';
        titleText.style.transform = '';
        btnLocal.style.backgroundColor = '';
        titleText.style.color = '';
        btnLocal.innerText = 'CLEAR STORAGE';
        btnLocal.style.transform = ''
    }, 2000);
    // Reload after animation finishes and clear the storage
    setTimeout(() => {
        window.location.reload();
    }, 3500);
    localStorage.clear();
}