'use strict'


const debug = require('debug')('response')
const aliyunApigwModule = require('../trigger/aliyun-apigw')


class Response{
	constructor(ctx){
		this.context = ctx
	}
}
