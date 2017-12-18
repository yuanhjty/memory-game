/**
 * @file
 * 此文件定义了游戏界面的组件，通过这些组件可以访问需要操作的 DOM 元素的 jQuery 对象
 */

'use strict';

import utils from './utils.js';

/**
 * 卡片类，封装一个 jQuery 对象
 */
class Card {
    /**
     * @constructor
     * @param $card {jQuery}
     */
    constructor($card) {
        this.$card = $card;
    }

    /**
     * 重置卡片状态
     */
    reset() {
        this.$card.attr('class', 'card animated');
    }

    /**
     * 设置花色
     * @param suit {string}
     */
    set suit(suit) {
        $('i', this.$card).attr('class', suit);
    }

    /**
     * 获得花色
     * @returns {string}
     */
    get suit() {
        return $('i', this.$card).attr('class');
    }

    /**
     * 打开卡片
     */
    open() {
        this.$card.addClass('open flipInY');
    }

    /**
     * 完成打开过程
     */
    completeOpen() {
        this.$card.removeClass('flipInY');
    }

    /**
     * 用不同的动画效果展示卡片匹配结果
     * @param matched {boolean} 传入 true 展示匹配成功动画，传入 false 展示匹配失败动画
     */
    showMatchResult(matched) {
        let show = matched ? 'match bounce' : 'not-match shake';
        this.$card.removeClass('flipInY').addClass(show);
    }

    /**
     * 为 Card 对象的 click 事件绑定回调函数
     * @param callback {function(Card)} 回调函数，接受一个 Card 实例
     */
    bindClickEvent(callback) {
        this.$card.bind('click', () => {
            callback(this);
        });
    }
}

/**
 * 主面板
 * @type {{deck}}
 */
const mainPanel = (function () {
    let cards = [];
    $('.main-panel ul.deck li.card').each(function() {
        cards.push(new Card($(this)));
    });

    /**
     * 一副卡片
     * @type {{cards: Array, suits: string[], currentCardsPair: Array, numberOfOpenedCardsPairs: number, shuffle(): void, reset(): void, init(): void}}
     */
    let deck = {
        cards: cards,
        suits: [
            'fa fa-diamond', 'fa fa-bicycle', 'fa fa-anchor', 'fa fa-bolt',
            'fa fa-diamond', 'fa fa-bicycle', 'fa fa-anchor', 'fa fa-bolt',
            'fa fa-paper-plane-o', 'fa fa-cube', 'fa fa-bomb', 'fa fa-leaf',
            'fa fa-paper-plane-o', 'fa fa-cube', 'fa fa-bomb', 'fa fa-leaf'
        ],
        currentCardsPair: [],
        numberOfOpenedCardsPairs: 0,

        /**
         * 洗牌（重置状态，打乱花色）
         */
        shuffle() {
            let cards = this.cards,
                suits = this.suits;

            utils.shuffle(suits);

            for (let i = 0; i < cards.length; i++) {
                this.cards[i].suit = (suits[i]);
            }
        },

        /**
         * 重置整副牌状态
         */
        reset() {
            this.cards.forEach(card => {
                card.reset();
            });
            this.shuffle();
            this.currentCardsPair = [];
            this.numberOfOpenedCardsPairs = 0;
        },

        /**
         * 初始化整副牌
         */
        init() {
            this.reset();
        }
    };

    return {
        deck,

        /**
         * 重置主面板
         */
        reset() {
            this.deck.reset();
        },

        /**
         * 初始化主面板
         */
        init() {
            this.deck.init();
        }
    };
})();

/**
 * 计分板
 * @type {{$stars, $moves, $times, timer}}
 */
const scorePanel = function () {
    let $scorePanel = $('.score-panel');
    return {
        $stars: $('ul.stars li', $scorePanel),
        $moves: $('.moves-value', $scorePanel),
        $times: $('.times-value', $scorePanel),
        starsNumber: 3,
        movesValue: 0,
        timesValue: 0,
        timer: null,

        /**
         * 启动计时器
         */
        startTimer() {
            this.timer = setInterval(() => {
                this.timesValue++;
                this.updateTimes();
            }, 1000);
        },

        /**
         * 停止计时器
         */
        stopTimer() {
            if (this.timer !== null) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },

        /**
         * 更新 $stars 显示
         */
        updateStars() {
            utils.updateStars(this.$stars, this.starsNumber);
        },

        /**
         * 更新 $moves 显示
         */
        updateMoves() {
            this.$moves.text(this.movesValue);
        },

        /**
         * 更新 $times 显示
         */
        updateTimes() {
            this.$times.text(this.timesValue);
        },

        /**
         * 重置计分板
         */
        reset() {
            this.stopTimer();

            this.starsNumber = 3;
            this.movesValue = 0;
            this.timesValue = 0;

            this.updateStars();
            this.updateMoves();
            this.updateTimes();
        },

        /**
         * 初始化计分板
         */
        init() {
            this.reset();
        }
    };
}();

/**
 * 功能面板，包含了 "restart" 功能按钮
 * @type {{$restart: *|jQuery|HTMLElement}}
 */
const functionPanel = {
    $restart: $('.function-panel .restart'),

    /**
     * 重置功能面板
     */
    reset() {
    },

    /**
     * 初始化功能面板
     */
    init() {
        this.reset();
    }
};

/**
 * 游戏结束面板
 * @type {{$self, $stars, $moves, $times, $playAgain}}
 */
const overPanel = function () {
    let $overPanel = $('.over-panel');
    return {
        $self: $overPanel,
        $stars: $('ul.stars li', $overPanel),
        $moves: $('.final-moves-value', $overPanel),
        $times: $('.final-times-value', $overPanel),
        $playAgain: $('.play-again', $overPanel),
        starsNumber: 3,
        movesValue: 0,
        timesValue: 0,

        /**
         * 显示结束面板
         */
        show() {
            utils.updateStars(this.$stars, this.starsNumber);
            this.$moves.text(this.movesValue);
            this.$times.text(this.timesValue);
            this.$self.addClass('show');
        },

        /**
         * 重置结束面板
         */
        reset() {
            this.$self.removeClass('show');
        },

        /**
         * 初始化结束面板
         */
        init() {
            this.reset();
        }
    };
}();

export const widgets = {scorePanel, functionPanel, mainPanel, overPanel};
export default widgets;
