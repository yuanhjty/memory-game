/**
 * @file
 * 此文件中定义通用工具函数
 */

'use strict'

/**
 * Shuffle function from http://stackoverflow.com/a/2450976
 * @param array {array}
 */
function shuffle (array) {
  let currentIndex = array.length, temporaryValue, randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
}

/**
 * 更新 stars 显示状态
 * @param $stars {jQuery}
 * @param starsNumber {number}
 */
function updateStars ($stars, starsNumber) {
  for (let i = 0; i < $stars.length; i++) {
    if (i < starsNumber) {
      $($stars[i]).removeClass('lost')
    } else {
      $($stars[i]).addClass('lost')
    }
  }
}

export const utils = {shuffle, updateStars}
export default utils
