$(document).ready(function () {
    let myLibrary = [];
    let titleValid = false;
    let pagesValid = false;
    let gNextId = 0;
    class Book {
        constructor(
            title = 'Unknown',
            pages = 0,
            maxPages = 0,
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
    $('.plus').on('click', function () {
        $('.overlay, .modal').fadeIn().css('display', 'flex');
    });
    $('.button-cancel').on('click', function () {
        $('.overlay, .modal').fadeOut(300);
    });
    $('.button-add').on('click', function () {
        addCard();
    });
    $(document).on('click', '.card button', function () {
        let cardPages = $(this)[0].classList.contains('add') ? $(this).next() : $(this).prev();
        let currentNum = Number(cardPages.text());
        if ($(this)[0].classList.contains('add')) {
            currentNum++;
        } else {
            currentNum--;
        }
        console.log($(this).find('card-max-pages'));
        if (currentNum >= $(this).find('card-max-pages')) {
            $('.card-max-pages', this).text(currentNum);
        }
        cardPages.text(currentNum);
    });

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
        $('.overlay, .modal').fadeOut(300).promise().done(function () {
            clearInputs();
        });
    }
    function clearInputs() {
        $('.modal input').val('');
    }
    function createCard(book) {
        let strHTML = `<div class="card" id="book-${book.bookId}">
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
            <button class="btn-remove" onclick="removeCard(this)">REMOVE</button>
        </div>
    </div>`
        return strHTML;
    }
});