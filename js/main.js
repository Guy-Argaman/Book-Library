'use strict';
$(document).ready(function () {
    let myLibrary = [];
    let cardID = '';
    class Book {
        constructor(
            title = 'Unknown',
            pages = 0,
            maxPages = 0,
            date = '',
            bookId = '',
        ) {
            this.title = title;
            this.pages = pages;
            this.maxPages = maxPages;
            this.date = date;
            this.bookId = bookId;
        }
    }
    $('.plus').on('click', function () {
        $('.overlay, .modal').fadeIn(300).css('display', 'flex');
    });
    $('.btn-cancel').on('click', function () {
        $('.overlay, .modal-edit,.modal').fadeOut(300);
    });
    $('.btn-add').on('click', function () {
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
        cardID = $(this).parent().closest('.card').attr('data-id');
        $('.overlay, .message').fadeIn();
    });
    $('.btn-confirm').on('click', function () {
        $('.overlay, .message').fadeOut();
        $(myLibrary[cardID].cardEl).remove();
        myLibrary.splice(cardID, 1);
        assignIDs();
    });
    $(document).on('click', '.btn-decline', function () {
        $('.overlay, .message').fadeOut(300);
    });
    $(document).on('click', '.card .btn-edit', function () {
        cardID = parseInt($(this).parent().closest('.card').attr('data-id'));
        $('.modal-edit .modal-name').val(myLibrary[cardID].title);
        $('.modal-edit .pages').val(myLibrary[cardID].pages);
        $('.modal-edit .max-pages').val(myLibrary[cardID].maxPages);
        $('.overlay, .modal-edit').fadeIn(300).css('display', 'flex');
    });
    $('.btn-save').on('click', function () {
        if (!checkRepeats() && myLibrary[cardID].title !== $('.modal-edit .modal-name').val()) return;
        let newBookTitle = $('.modal-edit .modal-name').val();
        let newBookPages = $('.modal-edit .pages').val();
        let newBookMaxPages = $('.modal-edit .max-pages').val();
        myLibrary[cardID].title = newBookTitle;
        myLibrary[cardID].pages = newBookPages;
        myLibrary[cardID].maxPages = newBookMaxPages;
        $(myLibrary[cardID].cardEl).find('.card-title').text(newBookTitle);
        $(myLibrary[cardID].cardEl).find('.card-pages').text(newBookPages);
        $(myLibrary[cardID].cardEl).find('.card-max-pages').text(newBookMaxPages);
        $('.overlay, .modal-edit').fadeOut(300);
    });
    $(document).on('click', '.btn-decline', function () {
        $('.overlay,.message').fadeOut(300);
    });

    function assignIDs() {
        let newId = '';
        for (let i = 0; i < myLibrary.length; i++) {
            newId = i;
            $(myLibrary[i].cardEl).attr('data-id', i);
        }
        return newId;
    }

    function checkRepeats() {
        let modal = $('.modal').is(':visible') ? $('.modal') : $('.modal-edit');
        if (modal.find('.modal-name').val() === '') {
            $('.modal-title').addClass('invalid').text('Insert Title');
            return false;
        }
        for (let i = 0; i < myLibrary.length; i++) {
            if (modal.find('.modal-name').val() === myLibrary[i].title) {
                $('.modal-title').addClass('invalid').text('Book Exists');
                return false;
            }
        }
        $('.modal-title').removeClass('invalid').text('Book Title');
        return true;
    }

    function checkFormValid() {
        if (Number($('.modal .pages').val()) > Number($('.modal .max-pages').val())) {
            $('.pages-label, .max-pages-label').addClass('invalid');
            return false;
        }
        $('.pages-label,.max-pages-label').removeClass('invalid');
        return true;
    }

    function addCard() {
        if (!checkRepeats()) return;
        if ($('.pages, .max-pages').val() === '') {
            $('.pages-label, .max-pages-label').addClass('invalid');
            return;
        }
        if (!checkFormValid()) return;
        myLibrary.push(new Book($('.modal-name').val(), Number($('.pages').val()), Number($('.max-pages').val()), $('.date').val()));
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
    <div class="card-title book-value">${book.title}</div>
    <h1 class="card-pages-head">PAGE</h1>
    <div class="card-date book-value">${book.date}</div>
        <div class="card-btns-pages">
            <button class="add btn-add-pages">➕</button>
            <div class="card-pages book-value">${book.pages}</div>
            <button class="btn-reduce-pages">➖</button>
        </div>
        <h1 class="card-max-pages-head">MAX PAGES</h1>
        <div class="card-btns-max-pages">
        <button class="add btn-add-max-pages">➕</button>
        <div class="card-max-pages book-value">${book.maxPages}</div>
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