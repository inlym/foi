'use strict'



module.exports = {
	/**
	 * request part
	 */
	get header() {
		return this.request.header
	},

	get headers() {
		return this.request.headers
	},

	get method() {
		return this.request.method
	},

	set method(val) {
		this.request.method = val
	},

	get url() {
		return this.request.url
	},

	set url(val) {
		this.request.url = val
	},

	get origin() {
		return this.request.origin
	},

	get href() {
		return this.request.href
	},

	get path() {
		return this.request.path
	},

	set path(val) {
		this.request.path = val
	},

	get query() {
		return this.request.query
	},

	set query(val) {
		this.request.query = val
	},

	get querystring() {
		return this.request.querystring
	},

	set querystring(val) {
		this.request.querystring = val
	},

	get host() {
		return this.request.host
	},

	get hostname() {
		return this.request.hostname
	},

	get protocol() {
		return this.request.protocol
	},

	get ip() {
		return this.request.ip
	},

	set ip(val) {
		this.request.ip = val
	},

	get params() {
		return this.request.params
	},

	set params(val) {
		this.request.params = val
	},

	get(field) {
		return this.request.get(field)
	},


	/**
	 * response part
	 */
	get body() {
		return this.response.body
	},

	set body(val) {
		this.response.body = val
	},

	get status() {
		return this.response.status
	},

	set status(code) {
		this.response.status = code
	},

	set(field, value) {
		return this.response.set(field, value)
	},

	toJSON() {
		return {
			request: this.request,
			response: this.response,
		}
	},

}