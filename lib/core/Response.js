'use strict'

const { codeMap } = require('./constant')



function Response(app) {
    this.app = app
    this.callback = app.callback
    this.isBase64Encoded = false
    this.headers = Object.create(null)
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
        this.statusMessage = codeMap[this.statusCode.toString()]
    }

    this.callback(null, this.wrapper())
}


