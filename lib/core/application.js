'use strict'

const EventEmitter = require('events')
const debug = require('debug')('application')
const Context = require('./context')


class Application extends EventEmitter {
	constructor(options) {
		super()

		// 初始化参数错误情况，抛出错误，直接中断
		if (typeof options !== 'object' || !options.event || !options.context || !options.callback){
			throw new Error('参数错误：options参数错误，请参考文档使用说明。文档地址：https://www.npmjs.com/package/foi')
		}
		
		this._originEvent = options.event
		this._originContext = options.context
		this._originCallback = options.callback

		this.trigger = options.trigger

		this.context = new Context(this)
		
	}

	init(){

	}

	onError(error){

	}
}


module.exports = Application