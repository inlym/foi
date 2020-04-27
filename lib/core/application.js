'use strict'

const EventEmitter = require('events')
const Request = require('./request')
const Response = require('./response')


function Application(event, context, callback) {
    this.event = event
    this.context = context
    this.callback = callback
    this.request = new Request(this)
    this.response = new Response(this)

    this.req = this.request
    this.res = this.response

    this.on('error', function (error) {
        this.onError(error)
    })
}

Application.prototype = Object.create(EventEmitter.prototype)


Application.prototype.onError = function (error) {
    this.callback(error)
}


module.exports = Application