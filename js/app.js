// Generic Functions

// 引用自 JavaScript DOM编程艺术(第2版) Jeremy Keith、effrey Sambells著
/**
 * @description  扩充 window.onload 事件的回调函数
 * @param {function} func - 要增加的函数
 */
function addLoadEvent(func) {
    let oldonload = window.onload;
    if (typeof oldonload !== 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

/**
 * @param {object} element
 * @param {string} className
 */
function addClass(element, className) {
    let classValue = element.getAttribute('class');
    if (classValue.indexOf(className) === -1) {
        classValue = classValue ? classValue + ' ' + className : className;
        element.setAttribute('class', classValue);
    }
}

/**
 * @param {object} element
 * @param {string} className
 */
function removeClass(element, className) {
    let classValue = element.getAttribute('class');
    let index = classValue.indexOf(className);
    if (index !== -1) {
        let deleteCount = classValue[index + className.length] === ' ' ?
            className.length + 1 : className.length;
        classValue = classValue.slice(0, index) + classValue.slice(index + deleteCount);
        element.setAttribute('class', classValue.trim());
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
/**
 * @param {object} array - 数组对象
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}

// Global Objects of Dom Elements to operate
let cards = function () {
    let cardsDeck = document.getElementsByClassName('deck')[0];
    return {
        NAME_PREF: 'fa fa-',
        contents: [
            'diamond', 'anchor', 'bolt', 'bicycle',
            'bolt', 'bicycle', 'anchor', 'diamond',
            'paper-plane-o', 'cube', 'leaf', 'cube',
            'bomb', 'leaf', 'bomb', 'paper-plane-o',
        ],
        elements: cardsDeck.getElementsByTagName('li'),
        firstOfCurrentPair: null,
        matchPairsNumber: 0
    };
}();

let scorePanel = function () {
    let scorePanel = document.getElementsByClassName('score-panel')[0];
    let starsDeck = scorePanel.getElementsByClassName('stars')[0];
    return {
        stars: starsDeck.getElementsByTagName('i'),
        moves: scorePanel.getElementsByClassName('moves')[0],
        times: scorePanel.getElementsByClassName('times')[0],
        movesValue: 0,
        timesValue: 0,
        timer: null,
        restart: scorePanel.getElementsByClassName('restart')[0]
    };
}();

let finalScore = function () {
    let finalScore = document.getElementsByClassName('final-score')[0];
    let starsDeck = finalScore.getElementsByClassName('stars')[0];
    return {
        panel: finalScore,
        stars: starsDeck.getElementsByTagName('i'),
        moves: finalScore.getElementsByClassName('final-moves')[0],
        times: finalScore.getElementsByClassName('final-times')[0],
        playAgain: finalScore.getElementsByClassName('play-again')[0]
    };
}();

// Game Logical Functions
/**
 * @param {object} element
 * @param {string} cardName
 */
function setCard(element, cardName) {
    let card = element.getElementsByTagName('i')[0];
    card.setAttribute('class', cardName);
}

/**
 * @description 组织游戏逻辑
 */
function openCard() {
    // 在每一局游戏中，当打开第一张卡片时，启动计时器
    if (scorePanel.timer === null) {
        scorePanel.timer = setInterval(function () {
            scorePanel.timesValue += 1;
            scorePanel.times.firstChild.nodeValue = scorePanel.timesValue.toString(10);
        }, 1000);
    }

    if (this.getAttribute('class') === 'card') {
        addClass(this, 'open animated flipInY');
        if (cards.firstOfCurrentPair === null) {
            cards.firstOfCurrentPair = this;
        } else {
            // Deal with current card pair.
            (function (firstCard, secondCard) {
                setTimeout(function () {
                    dealWithCardPair(firstCard, secondCard);
                }, 300);
            })(cards.firstOfCurrentPair, this);

            // Update moves of the score panel.
            scorePanel.movesValue += 1;
            scorePanel.moves.firstChild.nodeValue = scorePanel.movesValue.toString(10);

            // Update stars of the score panel.
            if (scorePanel.movesValue > 13 && scorePanel.movesValue <= 21) {
                addClass(scorePanel.stars[2], 'lost-stars');
            } else if (scorePanel.movesValue > 21) {
                addClass(scorePanel.stars[1], 'lost-stars');
            }

            // Reset current card pair.
            cards.firstOfCurrentPair = null;
        }
    }
}

/**
 * @param {object} firstCard
 * @param {object} secondCard
 */
function dealWithCardPair(firstCard, secondCard) {
    removeClass(firstCard, 'animated flipInY');
    removeClass(secondCard, 'animated flipInY');

    let firstCardContent = firstCard.getElementsByTagName('i')[0].getAttribute('class');
    let secondCardContent = secondCard.getElementsByTagName('i')[0].getAttribute('class');

    if (firstCardContent === secondCardContent) {
        addClass(firstCard, 'match animated bounce');
        addClass(secondCard, 'match animated bounce');
        cards.matchPairsNumber += 1;
        if (cards.matchPairsNumber === 8) {
            setTimeout(gameOver, 200);
        }
    } else {
        addClass(firstCard, 'not-match animated shake');
        addClass(secondCard, 'not-match animated shake');
        setTimeout(function () {
            firstCard.setAttribute('class', 'card');
            secondCard.setAttribute('class', 'card');
        }, 400);
    }
}

/**
 * @description 展示游戏结果
 */
function gameOver() {
    // Stop timing.
    if (scorePanel.timer !== null) {
        clearInterval(scorePanel.timer);
        scorePanel.timer = null;
    }

    // Update stars of final score.
    if (scorePanel.movesValue > 13 && scorePanel.movesValue <= 21) {
        addClass(finalScore.stars[2], 'lost-stars');
    } else if (scorePanel.movesValue > 21) {
        addClass(finalScore.stars[2], 'lost-stars');
        addClass(finalScore.stars[1], 'lost-stars');
    }

    // Update moves and times of final score.
    finalScore.moves.firstChild.nodeValue = scorePanel.movesValue.toString(10);
    finalScore.times.firstChild.nodeValue = scorePanel.timesValue.toString(10);

    // Show final score.
    addClass(finalScore.panel, 'show animated bounceInDown');
}

// Initialization Functions
/**
 * @description 为相关DOM元素绑定回调函数
 */
function setEvents() {
    scorePanel.restart.onclick = init;
    finalScore.playAgain.onclick = init;
    for (let i = 0; i < cards.elements.length; i++) {
        cards.elements[i].onclick = openCard;
    }
}

/**
 * @description 初始化记分板DOM元素
 */
function initScorePanel() {
    for (let i = 0; i < scorePanel.stars.length; i++) {
        scorePanel.stars[i].setAttribute('class', 'fa fa-star');
    }

    scorePanel.movesValue = 0;
    scorePanel.timesValue = 0;
    scorePanel.moves.firstChild.nodeValue = '0';
    scorePanel.times.firstChild.nodeValue = '0';

    if (scorePanel.timer !== null) {
        clearInterval(scorePanel.timer);
        scorePanel.timer = null;
    }
}

/**
 * @description 洗牌并初始化卡片DOM元素
 */
function initCards() {
    shuffle(cards.contents);
    let cardElement, cardName;
    for (let i = 0; i < cards.elements.length; i++) {
        cardElement = cards.elements[i];
        cardName = cards.NAME_PREF + cards.contents[i];
        setCard(cardElement, cardName);
        cardElement.setAttribute('class', 'card');
    }
    cards.firstOfCurrentPair = null;
    cards.matchPairsNumber = 0;
}

/**
 * @description 初始化得分板DOM元素
 */
function initFinalScore() {
    finalScore.panel.setAttribute('class', 'final-score');
    removeClass(finalScore.panel, 'show');
    for (let i = 0; i < finalScore.stars.length; i++) {
        finalScore.stars[i].setAttribute('class', 'fa fa-star fa-4x');
    }
}

/**
 * @description 初始化全部DOM元素
 */
function init() {
    initScorePanel();
    initCards();
    initFinalScore();
}

addLoadEvent(init);
addLoadEvent(setEvents);
