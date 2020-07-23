'use strict'

const querystring = require('querystring')
const net = require('net')


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

	// header 的几个方法
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


	// pathname
	get pathname() {
		return this.path
	},


	// protocol
	get protocol() {
		if (!this._protocol) {
			this.app.logger.warn('未在API网关配置参数，无法获取参数 request.protocol 。配置方式请参考文档说明，如不需要使用该参数，可忽略本条提醒。')
			return ''
		} else {
			return this._protocol
		}
	},

	set protocol(val) {
		this._protocol = val
	},


	// querystring
	get querystring() {
		return querystring.stringify(this.query)
	},


	// search
	get search() {
		if (!this.querystring) {
			return ''
		} else {
			return '?' + this.querystring
		}
	},


	// url
	get url() {
		return this.path + this.search
	},


	// host
	get host() {
		if (!this._host) {
			this.app.logger.warn('未在API网关配置参数，无法获取参数 request.host 。配置方式请参考文档说明，如不需要使用该参数，可忽略本条提醒。')
			return ''
		} else {
			return this._host
		}
	},

	set host(val) {
		this._host = val
	},

	get hostname() {
		return this.host
	},


	// origin
	get origin() {
		return this.protocol + '://' + this.host
	},


	// href
	get href() {
		return this.origin + this.url
	},


	// ip
	get ip() {
		if (this._ip) {
			return this._ip
		} else {
			this.app.logger.warn('未在API网关配置参数，无法获取参数 request.ip 。配置方式请参考文档说明，如不需要使用该参数，可忽略本条提醒。')
			return ''
		}
	},

	set ip(val) {
		if (!net.isIP(val)) {
			this.app.logger.error('你给 request.ip 赋值了 ' + val + ' ，这不是一个正确的IP地址')
		} else {
			this._ip = val
		}
	},


	// id
	get id() {
		if (this._id) {
			return this._id
		} else {
			this.app.logger.warn('未在API网关配置参数 id ，将直接从 context 中获取 requestId 属性')
			return this.app._originContext.requestId
		}
	},

	set id(val) {
		this._id = val
	},

	// ua => User-Agent
	get ua() {
		if (this._ua) {
			return this._ua
		} else {
			this.app.logger.warn('未在API网关配置参数 ua ，将直接从 headers 中获取 User-Agent 属性')
			return this.getHeader('User-Agent')
		}
	},

	set ua(val) {
		this._ua = val
	},


	/**
	 * 直接赋值，不做代理的属性: 
	 * method
	 * path
	 * query
	 * params
	 * body
	 * bufBody
	 */

	toJSON() {
		return {
			method: this.method,
			path: this.path,
			headers: this.headers,
			protocol: this.protocol,
			url: this.url,
			query: this.query,
			params: this.params,
			body: this.body,
			ip: this.ip,
		}
	}

}
