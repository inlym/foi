'use strict'

const delegate = require('delegates');

const aliyunApigwModule = require('../trigger/aliyun-apigw')


const context = {

}




/**
 * 属性代理，通过这种方式直接用 ctx 对象访问 request 和 response 的属性
 */
delegate(context, 'request')
	// .method('acceptsLanguages')
	// .method('acceptsEncodings')
	// .method('acceptsCharsets')
	// .method('accepts')
	.method('get')
	// .method('is')
	// .access('querystring')
	// .access('idempotent')
	// .access('socket')
	// .access('search')
	.access('method')
	.access('query')
	.access('path')
	.access('url')
	// .access('accept')
	.getter('origin')
	.getter('href')
	// .getter('subdomains')
	.getter('protocol')
	.getter('host')
	.getter('hostname')
	.getter('URL')
	.getter('header')
	.getter('headers')
	// .getter('secure')
	// .getter('stale')
	// .getter('fresh')
	// .getter('ips')
	.getter('ip')


delegate(context, 'response')
	// .method('attachment')
	// .method('redirect')
	.method('remove')
	// .method('vary')
	.method('has')
	.method('set')
	// .method('append')
	// .method('flushHeaders')
	.access('status')
	.access('message')
	.access('body')
	// .access('length')
	// .access('type')
	// .access('lastModified')
	// .access('etag')
	// .getter('headerSent')
	// .getter('writable')





module.exports = context