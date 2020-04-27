'use strict'

/**
 * 判断待检测对象的数据类型
 * 
 * 'abc'            => 'string'
 *  123             => 'number'
 *  true            => 'boolean'
 * ['a','b']        => 'array'
 * {name:'mark'}    => 'object'
 * function(){}     => 'function'
 *  undefined       => 'undefined'
 *  null            => 'null'
 * Buffer.from(1)   => 'uint8array'
 * new Date()       => 'date'
 * ...
 * ...
 * 
 * @param {any} obj 
 * @returns {string}
 */

module.exports = function whatis(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}