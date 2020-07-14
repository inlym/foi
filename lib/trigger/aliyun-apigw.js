'use strict'


function parseOriginEvent(ctx) {
	const originEvent = ctx.app._originEvent
	const request = ctx.request
	const parsedEvent = JSON.parse(originEvent.toString())

	// method
	request.method = parsedEvent.httpMethod

	// path
	request.path = parsedEvent.path

	// _untreatedHeaders
	request._untreatedHeaders = parsedEvent.headers

	resuest.headers = parsedEvent.headers

	// query
	request.query = parsedEvent.queryParameters

	// params
	request.params = parsedEvent.pathParameters

	// body & rawBody
	if (parsedEvent.isBase64Encoded) {
		request.rawBody = Buffer.from(parsedEvent.body, 'base64')
		request.body = request.rawBody.toString()
	} else {
		request.body = parsedEvent.body
		request.rawBody = Buffer.from(request.body)
	}

}


function respond(ctx) {
	const body = ctx.response.body
	const statusCode = ctx.response.statusCode
	const isBase64Encoded = ctx.response.isBase64Encoded || false
	const headers = ctx.response.headers
	const callback = ctx.app._originCallback
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