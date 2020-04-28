'use strict'

const alias = require('./../utils/alias')
const qs = require('querystring')



function Request(app) {
    this.app = app
    this.event = app.event
    this.context = app.context

    this.id = this.context.requestId
    this.headers = Object.create(null)

    alias(this, 'headers', 'header')
    alias(this, 'body', 'data')
    alias(this, 'rawBody', 'rawData')
    alias(this, 'query', 'queries')
    alias(this, 'query', 'param')
    alias(this, 'query', 'params')
    alias(this, 'query', 'queryParams')
    alias(this, 'query', 'queryParameters')
    alias(this, 'ip', 'clientIp')
    alias(this, 'ip', 'client_ip')
    alias(this, 'path', 'pathname')
    alias(this, 'pathParams', 'pathParameters')

    alias(this, 'getHeader', 'get')
    alias(this, 'setHeader', 'set')
    alias(this, 'removeHeader', 'remove')

    this.init()
}


Request.prototype.init = function () {
    if (this.getPlatform() === 'aliyun') {
        this.parseEventForAliyun()
    }

    this.makeHeaders()
    this.makeUrl()
    this.getProtocol()
    this.getHost()
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
    this.pathParams = parsedEvent.pathParameters

    // body & rawBody
    if (parsedEvent.isBase64Encoded) {
        this.rawBody = Buffer.from(parsedEvent.body, 'base64')
        this.body = this.rawBody.toString()
    } else {
        this.body = parsedEvent.body
        this.rawBody = Buffer.from(this.body)
    }
}


Request.prototype.getProtocol = function () {
    if (this.protocol) {
        return this.protocol
    } else {
        this.protocol = this.rawHeaders.protocol || this.rawHeaders.schema || this.rawHeaders.Http_Schema || this.rawHeaders.httpSchema
        return this.protocol
    }
}


Request.prototype.getHost = function () {
    if (this.host) {
        return this.host
    } else {
        this.host = this.rawHeaders.host || this.rawHeaders.domain || this.rawHeaders.Domain_Name || this.rawHeaders.domainName
        return this.host
    }

}


Request.prototype.makeHeaders = function () {
    const self = this
    const rawHeaders = self.rawHeaders
    Object.keys(rawHeaders).forEach(function (key) {
        if (rawHeaders[key]) {
            if (key === 'ip') {
                self.ip = rawHeaders.ip
            } else {
                self.headers[key.toLowerCase()] = rawHeaders[key]
            }
        }
    })
}


Request.prototype.makeUrl = function () {
    this.querystring = qs.stringify(this.query)
    this.url = this.path + '?' + this.querystring
}


Request.prototype.getHeader = function (field) {
    field = field.toLowerCase()
    if (field === 'referer' || field === 'referrer') {
        return this.headers.referer || this.headers.referrer || ''
    } else {
        return this.headers[field] || ''
    }
}


Request.prototype.setHeader = function (field, value) {
    field = field.toLowerCase()
    this.headers.field = value
}


Request.prototype.removeHeader = function (field) {
    field = field.toLowerCase()
    if (this.headers.field) {
        delete this.headers.field
    }
}



module.exports = Request