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

	get url() {
		return this.request.url
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

	get pathname(){
		return this.request.pathname
	},

	get query() {
		return this.request.query
	},

	get querystring() {
		return this.request.querystring
	},

	get search(){
		return this.request.search
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

	get params() {
		return this.request.params
	},

	get(field) {
		return this.request.get(field)
	},

	get ip() {
		return this.request.ip
	},

	get id() {
		return this.request.id
	},

	get ua() {
		return this.request.ua
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