'use strict'

const querystring = require('querystring')


module.exports = {

	/**
	 * 消息头(headers)部分
	 */

	get headers() {
		return this._headers
	},

	set headers(val) {
		if (typeof val === 'object') {
			// 将字段名逐个改为小写后存入
			Object.keys(val).forEach(key => {
				this._headers[key.toLowerCase()] = val[key]
			})
		} else {
			throw new Error('参数错误: headers 应该是一个对象')
		}
	},

	// headers 别名 header
	get header() {
		return this.headers
	},

	set header(val) {
		this.headers = val
	},

	getHeader(field) {
		return this._headers[field.toLowerCase()] || ''
	},

	setHeader(field, value) {
		field = field.toLowerCase()
		this._headers[field] = value
	},

	hasHeader(field) {
		return field.toLowerCase() in this._headers
	},

	removeHeader(field) {
		delete this._headers[field.toLowerCase()]
	},

	// getHeader 别名 get
	get(field) {
		return this.getHeader(field)
	},

	// setHeader 别名 set
	set(field, value) {
		return this.setHeader(field, value)
	},

	// hasHeader 别名 has
	has(field) {
		return this.hasHeader(field)
	},

	// removeHeader 别名 deleteHeader
	deleteHeader(field) {
		return this.removeHeader(field)
	},

	// removeHeader 别名 remove
	remove(field) {
		return this.removeHeader(field)
	},

	// pathname => '/path/to'    event中的 path 不包含 querystring 部分，实际上是 pathname
	// koa 中的 path 也不包含 querystring 部分，和 koa 保持一致
	get path() {
		return this.pathname
	},

	get schema() {
		return this.protocol
	},

	// querystring
	get querystring() {
		return querystring.stringify(this.query)
	},

	// search
	get search() {
		if (!querystring) {
			return ''
		} else {
			return '?' + this.querystring
		}
	},

	/**
	 * 直接赋值，不做代理的属性: 
	 * method
	 * pathname
	 * query
	 * params
	 * body
	 * bufBody
	 * ip
	 * host
	 * id
	 * protocol
	 * ua
	 */

	toJSON() {
		return {
			method: this.method,
			path: this.path,
			headers: this.headers,
			// url: this.url,
			query: this.query,
			params: this.params,
			body: this.body,
			ip: this.ip
		}
	}

}
