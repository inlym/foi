'use strict'

const EventEmitter = require('events')
const compose = require('../helper/compose')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const aliyunApigwModule = require('../trigger/aliyun-apigw')
const logger = require('../helper/logger')


module.exports = class Application extends EventEmitter {
	constructor(options) {
		super()

		// 初始化参数错误情况，抛出错误，直接中断
		// [aliyun-apigw] 触发器的 options 对象需要包含 event,context,callback 三个属性植入到 app 对象中
		// [to do ...] 增加新的触发器后，这段逻辑要变
		if (typeof options !== 'object' || !options.event || !options.context || !options.callback) {
			throw new Error('参数错误：options参数错误，请参考文档使用说明。文档地址：https://www.npmjs.com/package/foi')
		}


		// 保存 Serverless 的原始三元素 event,context,callback
		// [to do ...] 增加新的触发器后，这段逻辑要变, [aliyun-http]触发器的元素为 request, response
		this._originEvent = options.event
		this._originContext = options.context
		this._originCallback = options.callback

		/**
		 * 触发器，目前支持：
		 * 1. 阿里云，函数计算，API网关 —— aliyun-apigw
		 * 2. 阿里云，函数计算，HTTP函数 —— aliyun-http (to do ...)
		 */
		this.trigger = options.trigger || 'aliyun-apigw'

		// 注意：这里的 context 对应 Koa 中的 context ，非 Serverless 的 context
		this.context = Object.create(context)
		this.request = Object.create(request)
		this.response = Object.create(response)

		// 中间件，默认为空数组，使用 app.use() 往里面 push 元素
		this.middleware = []

		// 日志记录模块
		this.logger = Object.create(logger)

		// 是否关闭日志功能，默认为否，即开启日志
		this.logger.slient = options.slient || false

		/**
		 * 环境默认为 development 
		 * 开发环境 => development
		 * 生产环境 => production
		 */
		this.env = options.env || process.env.NODE_ENV || 'development'

		// 先执行这个方法建立关联
		this.createContext()

		// 指定触发器模块，目前只有 [aliyun-apigw]
		if (this.trigger === 'aliyun-apigw') {
			// 指定后续调用的触发器模块，影响解析参数和发送请求的方法
			this.triggerModule = aliyunApigwModule
		} else {
			// 如果填了错误的触发器名称，直接报错
			throw new Error('参数错误: 你指定的触发器不存在或暂不支持!')
		}

		// 注册错误事件监听器
		this.on('error', err => {
			this.onerror(err)
		})

	}


	use(fn) {
		if (typeof fn !== 'function') throw new Error('参数错误：app.use()中的参数必须是函数')
		this.middleware.push(fn)
		return this
	}


	/**
	 * 这一段的用途是建立能够互相关联的关系，和原生 Koa 略有区别，主要是为了兼容以下情况:
	 * 1. 在 Serverless 环境中，每 1 个请求都会创建一个新的 app 实例，使用 1 个 ctx
	 * 2. 在原生 Koa 中，所有请求共用 1 个 app 实例，每 1 个请求会使用 1 个 ctx
	 * 
	 * 实际上，完全可以做到兼容，但是调用层会变得异常麻烦(需要将主体代码写在 handler 之外)，这么做得不偿失
	 */
	createContext() {
		const context = this.context
		const request = this.request
		const response = this.response

		context.app = request.app = response.app = this

		request.context = response.context = context
		context.request = response.request = request
		context.response = request.response = response

		// 区别于原生 Koa, 这里的 request 和 req 是同一个东西，这么做只是为了兼容 Koa 的插件
		context.req = request.req = response.req = request

		// 区别于原生 Koa, 这里的 response 和 res 是同一个东西，这么做只是为了兼容 Koa 的插件
		context.res = request.res = response.res = response

		// context 的别名 ctx
		request.ctx = response.ctx = context

		// 用户自定义使用的命名空间，用于传递参数
		context.state = Object.create(null)

		// 初始化 request 的 _headers 为空对象
		request._headers = Object.create(null)

		// 初始化 response 的 _headers 为空对象
		response._headers = Object.create(null)

		// return context
	}


	/**
	 * serverless 环境中不存在创建服务器的流程，即不需要调用 [http.createServer] 方法，原有的 callback 在回调中调用
	 * 这里的 callback 只是为了模拟 Koa 的回调逻辑，保持生命周期相同
	 */
	callback() {
		const ctx = this.context
		const fn = compose(this.middleware)

		fn(ctx)
			.then(() => {
				return this.respond()
			})
			.catch(err => {
				this.onerror(err)
			})
	}


	// 这是个假 listen, 也是为了兼容 Koa, 使得开发直接将普通服务器架构迁移 Serverless 架构时不需要改动代码
	listen() {
		return this.init()
	}


	init() {
		// 解析 event 参数并赋值给 request 对象
		const originEvent = this._originEvent

		this.logger.log(' event => ' + JSON.stringify(JSON.parse(originEvent.toString())))

		const parsedEvent = this.triggerModule.parse(originEvent)

		Object.assign(this.request, parsedEvent)

		this.logger.log(' request => ' + JSON.stringify(this.request))

		this.callback()
	}


	onerror(err) {
		this.triggerModule.onerror(this, err)
	}

	respond(value) {
		const ctx = this.context
		if (value) {
			ctx.body = value
		}
		this.logger.log(' response => ' + JSON.stringify(this.response))
		this.triggerModule.respond(this)
	}
}
