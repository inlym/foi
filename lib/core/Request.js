'use strict'

function Request(ap) {
    this.ap = ap
    this.event = ap.event
}



/**
 * 确定所处的云平台
 * 
 * 目前支持的云平台包含：
 * 阿里云 -> aliyun
 * 腾讯云 -> qcloud
 * 
 * 目前根据event是一个Buffer，判定为阿里云
 */
Request.prototype.detPlatform = function () {
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

    // headers
    this.headers = parsedEvent.headers

    // queryParams
    this.query = parsedEvent.queryParameters

    // pathParams
    this.pathParams = parsedEvent.pathParams

    // body & rawData
    if (parsedEvent.isBase64Encoded) {
        this.rawData = Buffer.from(parsedEvent.body, 'base64')
        this.body = this.rawData.toString()
    } else {
        this.body = parsedEvent.body
        this.rawData = Buffer.from(this.body)
    }


}