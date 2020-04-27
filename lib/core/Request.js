'use strict'

const whatis = require('./../utils/whatis')
const isEmptyObject = require('./../utils/isEmptyObject')


function Request(app) {
    this.app = app
    this.event = app.event
    this.context = app.context

    this.id = this.context.requestId


    this.init()
}


Request.prototype.init = function () {
    if (this.getPlatform() === 'aliyun') {
        this.parseEventForAliyun()
    }
}


/**
 * 确定所处的云平台
 * 
 * 目前支持的云平台包含：
 * 阿里云 -> aliyun
 * 腾讯云 -> qcloud
 * 
 * 目前根据event是一个Buffer，判定为阿里云（与腾讯云的Object比较）
 */
Request.prototype.getPlatform = function () {
    if (this.platform) {
        return this.platform
    }

    if (Buffer.isBuffer(this.event)) {
        this.platform = 'aliyun'
        return this.platform
    }
}



Request.prototype.parseEventForAliyun = function () {
    const parsedEvent = JSON.parse(this.event.toString())

    // method
    this.method = parsedEvent.httpMethod

    // path
    this.path = parsedEvent.path

    // rawHeaders
    this.rawHeaders = parsedEvent.headers

    // query
    this.query = parsedEvent.queryParameters

    // pathParams
    this.pathParams = parsedEvent.pathParams

    // body & rawBody
    if (parsedEvent.isBase64Encoded) {
        this.rawBody = Buffer.from(parsedEvent.body, 'base64')
        this.body = this.rawBody.toString()
    } else {
        this.body = parsedEvent.body
        this.rawBody = Buffer.from(this.body)
    }
}


Request.prototype.makeHeaders = function () {
    const rawHeaders = this.rawHeaders
    this.headers = Object.create(null)
    Object.keys(rawHeaders).forEach(function (key) {
        if (rawHeaders[key]) {
            if (key === 'ip') {
                this.ip = rawHeaders.ip
            } else {
                this[headers][key.toLowerCase()] = rawHeaders[key]
            }
        }
    })
}


Request.prototype.getHeader = function (field) {
    const field = field.toLowerCase()
    if (field === 'referer' || field === 'referrer') {
        return this.headers.referer || this.headers.referrer || ''
    } else {
        return this.headers[field] || ''
    }
}

Request.prototype.setHeader = function (field, value) {
    const field = field.toLowerCase()
    this.headers.field = value
}

Request.prototype.removeHeader = function (field) {
    const field = field.toLowerCase()
    if (this.headers.field) {
        delete this.headers.field
    }
}



module.exports = Request