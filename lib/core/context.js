'use strict'


const Request = require('./request')
const Response = require('./response')
const aliyunApigwModule = require('../trigger/aliyun-apigw')



class Context {
	constructor(app){
		this.app = app

		this.request = new Request(this)
		this.response = new Response(this)
	}
}