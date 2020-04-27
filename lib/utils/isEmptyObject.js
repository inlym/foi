'use strict'

/**
 * 判断一个对象是否是空对象，即{}
 * @param {Object} obj
 * @returns {Boolean}
 */
function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}'
}

module.exports = isEmptyObject