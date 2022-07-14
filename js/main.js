'use strict';
$(document).ready(function () {
    let myLibrary = [];
    let titleValid = false;
    let pagesValid = false;
    let cardID = '';
    class Book {
        constructor(
            title = 'Unknown',
            pages = 0,
            maxPages = 0,
            isRead = false,
            date = '',
            bookId = 0,
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
    $(document).on('click', '.card .btn-remove', function () {
        cardID = $(this).parent().closest('.card').data().id;
        $('.overlay, .message').fadeIn();
    });
    $('.btn-confirm').on('click', function () {
        $('.overlay, .message').fadeOut();
        $(myLibrary[cardID].cardEl).remove();
        myLibrary.splice(cardID, 1);
        assignIDs();
    });
    $(document).on('click', '.btn-decline', function () {
        cardID = '';
        $('.overlay,.message').fadeOut(300);
    });

    function assignIDs() {
        let newId = '';
        for (let i = 0; i < myLibrary.length; i++) {
            myLibrary[i].bookId = i;
            newId = i;
            $(myLibrary[i].cardEl).attr('data-id', i);
        }
        return newId;
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
        myLibrary.push(new Book($('#modal-name').val(), Number($('#pages').val()), Number($('#max-pages').val()), false, $('#date').val()));
        let newCard = createCard(myLibrary[myLibrary.length - 1]);
        $('.wrapper').append(newCard);
        assignCardToBook(myLibrary[myLibrary.length - 1]);
        $('.overlay, .modal').fadeOut(300).promise().done(function () {
            clearInputs();
        });
        assignIDs();
    }

    function assignCardToBook(currentBook) {
        $('.card-title').each(function () {
            if ($(this).text() === currentBook.title) {
                let card = $(this).parent().closest('.card')[0];
                currentBook.cardEl = card;
            }
        });
        return { book: currentBook, cardEl: currentBook.cardEl, };
    }

    function clearInputs() {
        $('.modal input').val('');
    }
    function createCard(book) {
        let strHTML = `<div class="card" data-id="">
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