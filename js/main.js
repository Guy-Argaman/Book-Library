'use strict';
$(document).ready(function () {
    let myLibrary = [];
    let cardID;
    let titleValid = false;
    let pagesValid = false;
    class Book {
        constructor(
            title = 'Unknown',
            pages = 0,
            maxPages = 0,
            isRead = false,
            date = '',
            bookId = '',
        ) {
            this.title = title;
            this.pages = pages;
            this.maxPages = maxPages;
            this.isRead = isRead;
            this.date = date;
            this.bookId = bookId;
        }
    }
    $('.plus').on('click', function () {
        $('.overlay, .modal').fadeIn().css('display', 'flex');
    });
    $('.button-cancel').on('click', function () {
        $('.overlay, .modal').fadeOut(300);
    });
    $('.button-add').on('click', function () {
        addCard();
    });
    $(document).on('click', '.card button:not(.btn-edit):not(.btn-remove)', function () {
        let cardPagesEl = $(this)[0].classList.contains('add') ? $(this).next() : $(this).prev();
        let cardPagesNum = Number($(this).parents('.card').find('.card-pages').text());
        let cardMaxPagesNum = Number($(this).parents('.card').find('.card-max-pages').text());
        let currentNum = Number(cardPagesEl.text());
        if ($(this)[0].classList.contains('add')) {
            currentNum++;

        } else {
            currentNum--;
            if (currentNum < 0) { return }
        }
        if (cardPagesEl.hasClass('card-pages')) {
            if (currentNum >= cardMaxPagesNum) {
                $(this).parents('.card').find('.card-max-pages').text(currentNum);
            }
        } else {
            if (currentNum <= cardPagesNum) {
                $(this).parents('.card').find('.card-pages').text(currentNum);
            }
        }
        cardPagesEl.text(currentNum);
    });
    $(document).on('click', '.btn-decline', function () {
        $('.overlay, .message').fadeOut(300);
    });
    $(document).on('click', '.card .btn-remove', function () {
        cardID = $(this).parents('.card').data().id;
        $('.overlay, .message').fadeIn();
    });
    $('.btn-confirm').on('click', function () {
        $('.overlay, .message').fadeOut();
        let book = getBookByID(cardID);
        console.log(cardID);
        $(book.card).remove();
        // console.log(cardID);
        delete myLibrary[cardID];
        if (myLibrary[cardID] === undefined) {
            myLibrary.splice(cardID, 1);
        }
        // console.log(myLibrary[cardID].splice(cardID, 1));
        // for (let i = 0; i < myLibrary.length; i++) {
        //     if (card.find('.card-title').text() === myLibrary[i].title) {
        //         card.remove();
        //         myLibrary.splice(i, 1);
        //     }
        // }
        console.log(myLibrary, 'after');
    });

    function getBookByID(id) {
        let bookDetails = {
            book: '',
            card: cardID,
        };
        if (myLibrary[id]) {
            bookDetails.book = myLibrary[id];
            bookDetails.card = $(`.card[data-id="${id}"]`)[0];
        }
        console.log(bookDetails);
        return bookDetails;
    }
    function checkRepeats() {
        for (let i = 0; i < myLibrary.length; i++) {
            if ($('#modal-name').val() === myLibrary[i].title) {
                $('#modal-label').css('color', 'red').text('Book Exists');
                titleValid = false;
            }
        }
    }
    $('#modal-name').on('input', function () {
        $('#modal-label').css('color', '').text('Book Title');
        if ($('#modal-name').val() === '') {
            $('#modal-label').css('color', 'red').text('Insert Title');
            titleValid = false;
        }
        else {
            $('#modal-label').css('color', '');
            titleValid = true;
        }
        return titleValid;
    });
    $('.modal input[type="number"').on('input', function () {
        if (Number($('.modal input[type="number"]')[0].value) > Number($('.modal input[type="number"]')[1].value)) {
            $('#pages-label, #max-pages-label').css('color', 'red');
            pagesValid = false;
        } else {
            $('#pages-label, #max-pages-label').css('color', '');
            pagesValid = true;
        }
    });

    function addCard() {
        checkRepeats();
        $('#pages, #max-pages').val() === '' ? $('#pages-label, #max-pages-label').css('color', 'red') : '';
        if (!titleValid || !pagesValid) {
            return;
        }
        myLibrary.push(new Book($('#modal-name').val(), Number($('#pages').val()), Number($('#max-pages').val()), false, $('#date').val(), myLibrary.length));
        let newCard = createCard(myLibrary[myLibrary.length - 1]);
        $('.wrapper').append(newCard);
        $('.overlay, .modal').fadeOut(300).promise().done(function () {
            clearInputs();
        });
    }
    function clearInputs() {
        $('.modal input').val('');
    }

    function createCard(book) {
        let strHTML = `<div class="card" data-id="${book.bookId}">
    <div class="content">
    <h1 class="card-head">BOOK TITLE</h1>
    <div class="card-title">${book.title}</div>
    <h1 class="card-pages-head">PAGE</h1>
    <div class="card-date">${book.date}</div>
        <div class="card-btns-pages">
            <button class="add btn-add-pages">➕</button>
            <div class="card-pages">${book.pages}</div>
            <button class="btn-reduce-pages">➖</button>
        </div>
        <h1 class="card-max-pages-head">MAX PAGES</h1>
        <div class="card-btns-max-pages">
        <button class="add btn-add-max-pages">➕</button>
        <div class="card-max-pages">${book.maxPages}</div>
            <button class="btn-reduce-max-pages">➖</button>
        </div>
        <div class="btn-container">
            <button class="btn-edit">EDIT</button>
            <button class="btn-remove">REMOVE</button>
        </div>
    </div>`
        return strHTML;
    }
});