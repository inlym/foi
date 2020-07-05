'use strict'

const debug = require('debug')('context')
const Request = require('./request')
const Response = require('./response')


class Context {
	constructor(app){
		this.app = app

		this.request = new Request(this)
		this.response = new Response(this)
	}
}