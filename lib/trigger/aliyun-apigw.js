'use strict'


function parseOriginEvent(event) {
	const parsedEvent = JSON.parse(event.toString())
	const obj = Object.create(null)

	// method
	obj.method = parsedEvent.httpMethod

	// path
	obj.path = parsedEvent.path

	// _untreatedHeaders
	obj._untreatedHeaders = parsedEvent.headers

	obj.headers = parsedEvent.headers

	// query
	obj.query = parsedEvent.queryParameters

	// params
	obj.params = parsedEvent.pathParameters

	// body & rawBody
	if (parsedEvent.isBase64Encoded) {
		obj.rawBody = Buffer.from(parsedEvent.body, 'base64')
		obj.body = obj.rawBody.toString()
	} else {
		obj.body = parsedEvent.body
		obj.rawBody = Buffer.from(obj.body)
	}

	return obj
}


function respond(app) {
	const ctx = app.context
	const body = ctx.response.body
	const statusCode = ctx.response.statusCode || 200
	const isBase64Encoded = ctx.response.isBase64Encoded || false
	const headers = ctx.response.headers
	const callback = app._originCallback
	callback(null, {
		isBase64Encoded,
		headers,
		body,
		statusCode,
	})
}


module.exports = {
	parseOriginEvent,
	respond
}