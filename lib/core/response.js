'use strict'

const encodeUrl = require('../helper/encodeurl')


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
			Object.keys(val).forEach(function (key) {
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


	/**
	 * 状态码(statusCode)部分
	 * Serverless 中不需要处理状态消息(statusMessage), API网关层会自动加上
	 */

	get statusCode() {
		return this._statusCode
	},

	set statusCode(code) {
		// 如果 code 不是整数则报错
		if (typeof code !== 'number' || code % 1 !== 0) throw new Error('参数错误: response 的 statusCode 必须是一个整数')

		this._statusCode = code
	},

	// statusCode 别名 status
	get status() {
		return this.statusCode
	},

	set status(code) {
		this.statusCode = code
	},

	status(code) {
		this.statusCode = code
	},


	/**
	 * body 部分
	 */
	get body() {
		return this._body
	},

	set body(val) {
		this._body = val

		// 备注：'Content-Type', 'Content-Length' 由 API 网关自动设置，不支持用户自定义


	},

	// 重定向
	redirect(url) {
		this.statusCode = 302
		this.setHeader('Location', encodeUrl(url))
	},

	toJSON() {
		return {
			statusCode: this.statusCode,
			headers: this.headers,
			body: this.body,
		}
	},

}