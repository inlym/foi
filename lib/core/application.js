'use strict'

const EventEmitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const compose = require('koa-compose')
const aliyunApigwModule = require('../trigger/aliyun-apigw.js')


class Application extends EventEmitter {
	constructor(options) {
		super()

		// 初始化参数错误情况，抛出错误，直接中断
		// [aliyun-apigw]触发器的 options 对象需要包含 event,context,callback 三个属性植入到 app 对象中
		if (typeof options !== 'object' || !options.event || !options.context || !options.callback) {
			throw new Error('参数错误：options参数错误，请参考文档使用说明。文档地址：https://www.npmjs.com/package/foi')
		}

		// 保存 Serverless 的原始三元素 event,context,callback
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
		this.context = Object.create(context)
		this.request = Object.create(request)
		this.response = Object.create(response)

		// 中间件，默认为空数组，使用 app.use() 往里面 push 元素
		this.middleware = []

		/**
		 * 环境默认为 development 
		 * 开发环境 => development
		 * 生产环境 => production
		 */
		this.env = options.env || process.env.NODE_ENV || 'development'

	}


	use(fn) {
		if (typeof fn !== 'function') throw new Error('参数错误：app.use()中的参数必须是函数')
		this.middleware.push(fn)
		return this
	}


	/**
	 * 这一段直接复制 koa 的
	 */
	createContext(req, res) {
		const context = Object.create(this.context)
		const request = context.request = Object.create(this.request)
		const response = context.response = Object.create(this.response)
		context.app = request.app = response.app = this
		context.req = request.req = response.req = req
		context.res = request.res = response.res = res
		request.ctx = response.ctx = context
		request.response = response
		response.request = request
		// context.originalUrl = request.originalUrl = req.url
		context.state = {}
		return context
	}


	/**
	 * serverless 环境中不存在创建服务器的流程，即不需要调用 [http.createServer] 方法，原有的 callback 在回调中调用，这里需要特殊处理
	 */
	callback() {
		const fn = compose(this.middleware)
		this.on('error', this.onerror)
		const self = this

		// return function () {
		// 	const ctx = this.createContext(self.request, self.response)
		// 	return fn(ctx)
		// 		.then(function () {
		// 			return self.respond()
		// 		})
		// 		.catch(function (err) {
		// 			ctx.onerror(err)
		// 		})


		fn(this.ctx)
			.then(function () {
				return self.respond()
			})
			.catch(function (err) {
				ctx.onerror(err)
			})
	}


	// 这是个假 listen, 单纯为了兼容 Koa, 是开发直接将普通服务器架构迁移 Serverless 架构时不需要改动代码
	listen() {
		return this.init()
	}


	init() {
		const ctx = this.createContext(this.request, this.response)
		aliyunApigwModule.parseOriginEvent.call(ctx)
		this.callback()
	}


	onerror(err) {
		if (404 === err.status || err.expose) return
		if (this.silent) return

		const msg = err.stack || err.toString()
		console.error(`\n${msg.replace(/^/gm, '  ')}\n`)
	}

	respond(value) {
		const ctx = this.ctx
		if (value) {
			ctx.body = value
		}
		aliyunApigwModule.respond(ctx)
	}
}


module.exports = Application