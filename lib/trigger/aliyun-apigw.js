'use strict'


function parse(event) {
	const parsedEvent = JSON.parse(event.toString())
	const obj = Object.create(null)

	// method => 'POST'
	obj.method = parsedEvent.httpMethod

	// path => '/path/to'    不包含 query 部分(实际上是 pathname )
	obj.path = parsedEvent.path

	obj._headers = parsedEvent.headers

	// query
	obj.query = parsedEvent.queryParameters

	// params, 路径参数
	obj.params = parsedEvent.pathParameters

	// body
	if (parsedEvent.isBase64Encoded) {
		obj.bufBody = Buffer.from(parsedEvent.body, 'base64')
		obj.body = obj.rawBody.toString()  // string
	} else {
		obj.body = parsedEvent.body
		obj.bufBody = Buffer.from(obj.body)
	}

	// to do ...
	// 处理 API网关层加入 headers 的参数
	const ipAlias = ['ip', 'CaClientIp', 'clientIp', 'clinet_ip','clinetip','ClientIp']
	const hostAlias = []
	const idAlias = []
	const protocolAlias = []

	Object.keys(obj._headers).forEach(function (key) {
		if (ipAlias.includes(key)){
			obj._ip = obj._headers[key]
			delete obj._headers[key]
		}
	})



	return obj
}


function respond(app) {
	const response = app.response
	const body = response.body
	const statusCode = response.statusCode || 200
	const isBase64Encoded = response.isBase64Encoded || false
	const headers = response.headers
	const callback = app._originCallback
	callback(null, {
		isBase64Encoded,
		headers,
		body,
		statusCode,
	})
}


function onerror(app, err) {
	const callback = app._originCallback
	callback(err)
}


module.exports = {
	parse,
	respond,
	onerror
}