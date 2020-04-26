'use strict'

/**
 * 请求和响应中处理headers的方法统一写在这里
 * @param {object} instance request或response
 */
function Headers(instance) {
    instance.get = this.get
    instance.set = this.set
    instance.has = this.has
    instance.remove = this.remove
}


Headers.prototype.get = function (field) {
    const field = field.toLowerCase()
    if (field === 'referer' || field === 'referrer') {
        return this.referer || this.referrer || ''
    } else {
        return this[field] || ''
    }
}


Headers.prototype.set = function (field, value) {
    const field = field.toLowerCase()
    this[field] = value
}


Headers.prototype.has = function (field) {
    const field = field.toLowerCase()
    if (this[field]) {
        return true
    } else {
        return false
    }
}


Headers.prototype.remove = function (field) {
    const field = field.toLowerCase()
    if (this[field]) {
        delete this[field]
    }
}