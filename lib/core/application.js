'use strict'

const EventEmitter = require('events')
const context = require('./context');
const request = require('./request');
const response = require('./response');
const compose = require('koa-compose')


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

		// 中间件，默认为空数组
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
		const fn = compose(this.middleware);

		const handleRequest = (req, res) => {
			const ctx = this.createContext(req, res)
			return this.handleRequest(ctx, fn)
		}

		return handleRequest
	}


	// 这个方法也是直接复制 Koa 的
	handleRequest(ctx, fnMiddleware) {
		const res = ctx.res
		res.statusCode = 404
		const onerror = err => ctx.onerror(err)
		const handleResponse = () => respond(ctx)
		onFinished(res, onerror)
		return fnMiddleware(ctx).then(handleResponse).catch(onerror)
	}

	// 这是个假 listen,单纯为了兼容 Koa, 在 listen 里面调用 callback
	listen() {
		this.callback()
	}

	// listen 别名 init
	get init(){
		return this.listen()
	}


	onerror(err) {
		if (404 === err.status || err.expose) return
		if (this.silent) return

		const msg = err.stack || err.toString()
		console.error(`\n${msg.replace(/^/gm, '  ')}\n`)
	}


}


module.exports = Application