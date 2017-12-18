/**
 * @file 此文件组织游戏逻辑
 */

'use strict';

import widgets from './widgets';

const
    overPanel = widgets.overPanel,
    scorePanel = widgets.scorePanel,
    functionPanel = widgets.functionPanel,
    mainPanel = widgets.mainPanel,
    deck = mainPanel.deck;


/**
 * 每打开一张图片就是一个游戏循环
 * @param card {Card} 被打开的卡片实例
 */
function openCard(card) {
    // 在每一局游戏中，当打开第一张卡片时，启动计时器
    if (scorePanel.timer === null) {
        scorePanel.startTimer();
    }

    if (!card.$card.hasClass('open')) {
        // 打开卡片
        card.open();

        deck.currentCardsPair.push(card);
        let cardsPair = deck.currentCardsPair;

        if (cardsPair.length === 2) {
            // 重置当前卡片对状态
            deck.currentCardsPair = [];

            // 处理卡片匹配，处理匹配之前，预留一段时间以展示卡片打开的动画效果。
            // 立即执行一个匿名函数，闭包中作用域链中引用此匿名函数的活动对象即可，
            // 否则，闭包作用域链中便会引用整个循环函数的活动对象
            (function (cardsPair) {
                setTimeout(function () {
                    dealWithCardsPair(cardsPair);
                }, 200);
            })(cardsPair);

            // 更新已用步数
            scorePanel.movesValue++;
            scorePanel.updateMoves();

            // 更新 star 数量
            if (scorePanel.movesValue > 13 && scorePanel.movesValue <= 21) {
                scorePanel.starsNumber = 2;
            } else if (scorePanel.movesValue > 21) {
                scorePanel.starsNumber = 1;
            }
            scorePanel.updateStars();
        }
    }
}

/**
 * 处理卡片匹配结果
 * @param cardsPair {Card[]}
 */
function dealWithCardsPair(cardsPair) {
    cardsPair.forEach(card => {
        card.completeOpen();
    });

    if (cardsPair[0].suit === cardsPair[1].suit) {
        cardsPair.forEach(card => {
            card.showMatchResult(true);
        });

        // 如果卡片已经全部打开，则游戏结束
        if (++deck.numberOfOpenedCardsPairs === 8) {
            setTimeout(gameOver, 800);
        }
    } else {
        cardsPair.forEach(card => {
            card.showMatchResult(false);
        });
        setTimeout(() => {
            cardsPair.forEach(card => {
                card.reset();
            });
        }, 800);
    }
}

/**
 * 展示游戏结果
 */
function gameOver() {
    // 停止计时
    scorePanel.stopTimer();

    // 同步得分
    overPanel.starsNumber = scorePanel.starsNumber;
    overPanel.movesValue = scorePanel.movesValue;
    overPanel.timesValue = scorePanel.timesValue;

    // 展示结果
    overPanel.show();
}

/**
 * 注册玩家事件
 */
function registerEvents() {
    deck.cards.forEach(card => {
        card.bindClickEvent(openCard);
    });
    functionPanel.$restart.bind('click', reset);
    overPanel.$playAgain.bind('click', reset);
}

/**
 * 重置游戏
 */
function reset() {
    scorePanel.reset();
    functionPanel.reset();
    overPanel.reset();
    mainPanel.reset();
}

/**
 * 初始化游戏
 */
function init() {
    reset();
    registerEvents();
}

export const app = {init};
export default app;
