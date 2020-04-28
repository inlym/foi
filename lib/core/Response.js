'use strict'

const { codeMap } = require('./constant')
const alias = require('./../utils/alias')



function Response(app) {
    this.app = app
    this.callback = app.callback
    this.isBase64Encoded = false
    this.headers = Object.create(null)

    alias(this,'statusCode','code')
    alias(this,'statusCode','status')
    alias(this,'statusMessage','message')
    alias(this,'statusMessage','statusText')
    alias(this,'headers','header')
    alias(this,'setBody','setData')
    alias(this,'body','data')
    alias(this,'send','end')

}


Response.prototype.getHeader = function (field) {
    return this.headers[field] || ''
}


Response.prototype.setHeader = function (field, value) {
    field = field.toLowerCase()
    this.headers[field] = value
}


Response.prototype.removeHeader = function (field) {
    field = field.toLowerCase()
    if (this.headers[field]) {
        delete this.headers[field]
    }
}


Response.prototype.setCode = function (code) {
    this.statusCode = code
}


Response.prototype.setMessage = function (message) {
    this.statusMessage = message
}


Response.prototype.setBody = function (body) {
    this.body = body
}


Response.prototype.wrapper = function () {
    return {
        isBase64Encoded: this.isBase64Encoded,
        statusCode: this.statusCode,
        headers: this.headers,
        body: this.body
    }
}


Response.prototype.send = function (data) {
    if (data) {
        this.body = data
    }

    if (!this.statusCode) {
        this.statusCode = 200
    }

    if (!this.statusMessage) {
        this.statusMessage = codeMap[this.statusCode.toString()] || 'Foi None'
    }

    this.callback(null, this.wrapper())
}



module.exports = Response