'use strict'

const EventEmitter = require('events')
const Context = require('./context')
const Request = require('./request')
const Response = require('./response')
const compose = require('../helper/compose')


class Application extends EventEmitter {
	constructor(options) {
		super()

		// 初始化参数错误情况，抛出错误，直接中断
		// options 对象需要包含 event,context,callback 三个属性植入 app 对象中
		if (typeof options !== 'object' || !options.event || !options.context || !options.callback) {
			throw new Error('参数错误：options参数错误，请参考文档使用说明。文档地址：https://www.npmjs.com/package/foi')
		}

		// 保存 Serverless 的原始三元素 event,context,callback 为私有属性
		this._originEvent = options.event
		this._originContext = options.context
		this._originCallback = options.callback

		/**
		 * 触发器，目前支持：
		 * 1. 阿里云，函数计算，API网关 —— aliyun-apigw
		 * 2. 阿里云，函数计算，HTTP函数 —— aliyun-http (to do ...)
		 */
		this.trigger = options.trigger

		// 注意：这里的 context 对应 Koa 中的 context ，非 Serverless 的 context
		this.context = new Context(this)
		this.request = new Request(this)
		this.response = new Response(this)

		// 中间件，默认为空数组
		this.middleware = []
	}

	use(fn) {
		if (typeof fn !== 'function') throw new Error('参数错误：app.use()中的参数必须是函数')
		this.middleware.push(fn)
		return this
	}

	createContext(req, res) {
		const context = Object.create(this.context)
		const request = Object.create(this.request)
		const response = Object.create(this.response)

		context.request = request
		context.response = response

		request.response = response
		response.request = request

		context.app = request.app = response.app = this
		context.req = request.req = response.req = req
		context.res = request.res = response.res = res

		context.state = {}

		return context
	}

	init() {
		const fn = compose(this.middleware)

		this.on('error', this.onError)

		return function (req, res, respond) {
			const onError = function (err) {
				ctx.onError(err)
			}
			const ctx = this.createContext(req, res)
			return fn(ctx)
				.then(() => {
					return respond(ctx)
				})
				.catch(onError)
		}
	}

	onError(error) {
		debug(error)

		// to do ...
	}

}


module.exports = Application