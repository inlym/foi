'use strict'


/**
 * 定义对象属性的别名值，别名的使用和源属性完全一致
 * @param {object} obj 作用对象
 * @param {string} origin 源属性名
 * @param {string} alias 别名值
 * 
 * 使用案例：
 * ```javascript
 * let person = {
 *     name: 'inlym',
 *     description: 'I am a good boy.'
 * }
 * alias(person, 'description', 'desc')
 * console.log(person.desc)    // 'I am a good boy.'
 * ```
 * 
 */

function alias(obj, origin, alias) {
    Object.defineProperty(obj, alias, {
        get: function () {
            return obj[origin]
        },
        set: function (val) {
            obj[origin] = val
        }
    })

}

module.exports = alias