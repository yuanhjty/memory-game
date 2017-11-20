function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof oldonload !== 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

var cards = [
    'diamond', 'anchor', 'bolt', 'bicycle',
    'bolt', 'bicycle', 'anchor', 'diamond',
    'paper-plane-o', 'cube', 'leaf', 'cube',
    'bomb', 'leaf', 'bomb', 'paper-plane-o',
];

const CARD_NAME_PREF = 'fa fa-';

var cardsDeck = document.getElementsByClassName('deck')[0];
var cardElements = cardsDeck.getElementsByTagName('li');

var scorePanel = document.getElementsByClassName('score-panel')[0];
var stars = scorePanel.getElementsByClassName('stars')[0];
var starFonts = stars.getElementsByTagName('i');
var movesElement = scorePanel.getElementsByClassName('moves')[0];
var timesElements = scorePanel.getElementsByClassName('times')[0];

var movesValue = 0;
var timesValue = 0;
var timer = null;
var currentCardPair = [];
var matchNumber = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}


function setCard(cardElement, cardName) {
    var cardFont = cardElement.getElementsByTagName('i')[0];
    cardFont.setAttribute('class', cardName);
}

function addClass(element, className) {
    var classValue = element.getAttribute('class');
    classValue = classValue ? classValue + ' ' + className : className;
    element.setAttribute('class', classValue);
}

function openCard() {
    if (timer === null) {
        timer = setInterval(function () {
            timesValue += 1;
            timesElements.firstChild.nodeValue = timesValue.toString(10);
        }, 1000);
    }

    if (this.getAttribute('class') === 'card') {
        addClass(this, 'open show animated flipInY');
        currentCardPair.push(this);

        if (currentCardPair.length === 2) {
            var firstCard = currentCardPair[0];
            var secondCard = currentCardPair[1];
            var firstFont = firstCard.getElementsByTagName('i')[0];
            var secondFont = secondCard.getElementsByTagName('i')[0];
            var firstFontClass = firstFont.getAttribute('class');
            var secondFontClass = secondFont.getAttribute('class');
            currentCardPair.splice(0, 2);
            movesValue += 1;
            movesElement.firstChild.nodeValue = movesValue.toString(10);
            updateStars(starFonts);

            setTimeout(function () {
                if (firstFontClass === secondFontClass) {
                    firstCard.setAttribute('class', 'card match animated bounce');
                    secondCard.setAttribute('class', 'card match animated bounce');
                    matchNumber += 1;
                    if (matchNumber === 8) {
                        setTimeout(gameOver, 200);
                    }
                } else {
                    firstCard.setAttribute('class', 'card open show not-match animated shake');
                    secondCard.setAttribute('class', 'card pen show not-match animated shake');
                    setTimeout(function () {
                        firstCard.setAttribute('class', 'card');
                        secondCard.setAttribute('class', 'card');
                    }, 400);
                }
            }, 300);
        }
    }
}

function updateStars(starFonts) {
    if (movesValue > 13 && movesValue <= 21) {
        addClass(starFonts[2], 'lost-stars');
    } else if (movesValue > 21) {
        addClass(starFonts[2], 'lost-stars');
        addClass(starFonts[1], 'lost-stars');
    }
}

function gameOver() {
    clearInterval(timer);
    timer = null;

    var overMessage = document.getElementsByClassName('over-message')[0];
    var overStars = overMessage.getElementsByClassName('stars')[0];
    var overStarFonts = overStars.getElementsByTagName('i');
    updateStars(overStarFonts);

    var overMoves = overMessage.getElementsByClassName('over-moves')[0];
    overMoves.firstChild.nodeValue = movesValue.toString(10);

    var overTimes = overMessage.getElementsByClassName('over-times')[0];
    overTimes.firstChild.nodeValue = timesValue.toString(10);

    overMessage.setAttribute('class', 'over-message show-over-message animated bounceInDown');
}

function bindClickEvent() {
    var btnRestart = document.getElementsByClassName('restart')[0];
    btnRestart.onclick = init;

    for (var i = 0; i < cardElements.length; i++) {
        cardElements[i].onclick = openCard;
    }

    var tryAgain = document.getElementsByClassName('try-again')[0];
    tryAgain.onclick = init;
}

function initOverMessage() {
    var overMessage = document.getElementsByClassName('over-message')[0];
    var overStars = overMessage.getElementsByClassName('stars')[0];
    var overStarFonts = overStars.getElementsByTagName('i');
    for (var i = 0; i < overStarFonts.length; i++) {
        overStarFonts[i].setAttribute('class', 'fa fa-star fa-4x');
    }
    overMessage.setAttribute('class', 'over-message hide-over-message')
}

function initCardsDeck() {
    shuffle(cards);
    var cardElement, cardName;
    for (var i = 0; i < cardElements.length; i++) {
        cardElement = cardElements[i];
        cardName = CARD_NAME_PREF + cards[i];
        setCard(cardElements[i], cardName);
        cardElement.setAttribute('class', 'card');
    }
}

function initScorePanel() {
    for (var i = 0; i < starFonts.length; i++) {
        starFonts[i].setAttribute('class', 'fa fa-star');
    }

    movesValue = 0;
    timesValue = 0;
    movesElement.firstChild.nodeValue = movesValue.toString(10);
    timesElements.firstChild.nodeValue = timesValue.toString(10);

    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

function init() {
    initScorePanel();
    initCardsDeck();
    initOverMessage();
    matchNumber = 0;
    currentCardPair.splice(0);
}

addLoadEvent(init);
addLoadEvent(bindClickEvent);
