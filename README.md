
# foi
基于 Serverless 架构的 Node.js Web 开发框架，提供和 Koa 一致的 API，可跨云平台使用。


> GitHub：[https://github.com/inlym/foi](https://github.com/inlym/foi)

> 欢迎 star



## 简介
foi 是一款基于 Serverless 架构的 Node.js Web 开发框架，提供和知名框架 Koa 一致的 API，可跨云平台使用。严格意义上来说，foi 并不是一个完整的框架，只是提供了一个方便开发 Serverless 应用的中间件。foi 主要做了以下两项工作：

1. 统一对接各大云平台的 Serverless 实现
1. 将封装好的 API 以 Koa 框架风格的 API 输出供开发者使用



用以下的架构图表示 foi 的功能：
![](https://img.inlym.com/6787f581fa804c24889ae31876ddd59f.jpg)




## 优点
### 跨多云平台
各云平台（阿里云、腾讯云、华为云、AWS等）对于 Serverless 的实现存在一定的差异，使用上也存在很大的差异，foi 针对各云平台的 API  做了兼容，使开发者在使用时无需阅读各云平台的开发文档，直接以 Koa 的 API 开发即可。foi 使得一份代码能够在所有云平台的 Serverless 架构服务上部署和运行。


### 低迁移成本
从 Koa 框架迁移至 foi 框架，只需要更改 2 行代码即可使用。这里面 foi 框架做了大量的底层工作，兼容 Koa 的 API。（详情点击查看 从 Koa 迁移 foi ）


另外，绝大多数的 Koa 中间件都可以在 foi 中使用。（由于 Serverless 架构限制，部分中间件无法使用。）


### 低学习成本
由于对开发者提供了与 Koa 一致的 API，因此开发无需额外花费时间学习 foi 本身，只需要根据文档说明对 foi 进行安装和使用即可，与 Koa 的差异仅在于初始化的 2 行代码。






## 安装
foi 的安装非常简单，你可以直接使用 npm 进行安装：
```bash
npm install foi
```


如果访问速度较慢，建议使用 cnpm 安装：（如需查看 cnpm 的安装方式，请 点击 ）
```bash
cnpm install foi
```




## 使用
### hello world
以下是一个输出响应（response）的主体为 'hello world' 的典型使用方式：
```javascript
'use strict'
const Foi = require('foi')

// Serverless 架构结构体
module.exports.handler = function (event, context, callback) {
	// 初始化 app
	const app = new Foi({ event, context, callback })

	// 主体部分使用 app.use, 和 Koa 一致的 API
	app.use(ctx => {
		ctx.body = 'hello world'
	})

	// 假的 listen, 兼容 Koa, 建议使用 app.init()
	app.listen()
}
```


你可以看出，在使用上，和 Koa 几乎没有任何区分，Koa 中在 app.use( ) 中使用的代码，均能在 foi 中运行。

### 初始化选项

初始化的标准格式是：
```javascript
const app = new Foi(options)    // options 是一个对象
```


针对不同的云平台和触发器，对应的 options 参数略有不同，其中包含了一些公共参数，和一些触发器的私有参数。


#### 公共参数
```javascript
const options = {
	slient: false,    // 是否禁止打印 foi 框架日志，默认 false，可选
	trigger: 'aliyun-apigw',    // 触发器，阿里云API网关触发器为'aliyun-apigw'
}
```


#### 阿里云 - API网关
```javascript
const options = {
	evnet: event,
	context: context,
	callback: callback,    // Serverless 传入的三要素，注意这里的属性值要和定义的变量名一致
}
```



## 配置

由于框架限制，部分参数需要在云平台进行配置才可以获取到。请按照你使用的触发器进行配置。


#### 阿里云 - API网关
（1）路径参数 - params
通过以下方式配置后，你可以使用 ctx.params 获取路径参数对象
![](https://img.inlym.com/7e8dc3657385440599f2cd384d232d29.jpg)

（2）其他参数 - ip, host, protocol
要获取 ip, host, protocol 参数，请在API网关处进行如下配置，否则会获取不到对应参数。
![](https://img.inlym.com/560a1831f2274b019ae96a3022f9ad36.jpg)




## 从 Koa 迁移 foi
### 迁移方式
从以上的使用方式看出，最核心的 app.use( ) 不需要改动。我们先来看一个最普通的 Koa 框架应用：
```javascript
'use strict'

const Koa = require('koa')

const app = new Koa()

app.use(ctx=>{
	ctx.body = 'hello world'
})

app.listen(80)
```
只要改动2处，就可以迁移至 foi ：
（1）变更引用模块
```javascript
const Koa = require('koa')
```
变更为
```javascript
const Foi = require('foi')
```


（2）变更初始化方式
```javascript
const app = new Koa()
```
变更为
```javascript
const app = new Foi({event, context, callback})
```


总共只需改动以上 2 行代码，以下部分为 Serverless 附加的代码：
```javascript
module.exports.handler = function(event, context, callback){

}
```




### 中间件兼容情况
foi 兼容 Koa 框架的绝大多数中间件，但以下2类中间件不支持：


1. 中间件承载的功能已经封装在 foi 框架里面了，例如 koa-bodyparser 中间件，可以直接通过 ctx.request.body  获取 body 请求的 body 内容。
1. 基于“流”的中间件，更准确地讲，foi 不支持基于 Koa 的 req 和 res 对象的绝大多数中间件。（在 foi 实现中，屏蔽的原生的 req 和 res，虽然仍然能够使用 req 和 res，但这只是作为 request 和 response 的别名）



## 框架 foi 和 midway比较
midway 是阿里云自研的 Node.js Web 开发框架，能够实现 foi 的所有功能。两者的差异非常大，举一个例子，如果说 foi 类比于 jQuery 的话，可以将 midway 类比为 Angular + Typescript + Webpack + Node.js + NPM。


foi 仅作为一个非浸入式开发的工具库，而 midway 提供了用于 Serverless 开发的一整套工具链。


以下是 foi 和 midway 的对比：

|  | foi | midway |
| :---: | :---: | :---: |
| 统一对接各云平台接口 | 支持 | 支持 |
| 提供和 Koa 一致的 API | 支持 | 支持 |
| 学习成本 | 非常低 | 非常高 |
| 自动化部署 | 不支持 | 支持 |
| 开发工具链 | 无 | 丰富 |



## 支持情况
各云平台触发器的支持情况：

| 云平台 | 触发器 | 触发器名称 | 支持情况 |
| :---: | :---: | :---: | :---: |
| 阿里云 | API网关触发器 | aliyun-apigw | 已支持 |
| 阿里云 | HTTP触发器 | aliyun-http | 开发中 |
| 腾讯云 | API网关触发器 | qcloud-apigw | 开发中 |
| 华为云 | API网关触发器 | huawei-apigw | 开发中 |
| 百度智能云 | API网关触发器 | baidu-apigw | 开发中 |
| AWS | API网关触发器 | aws-apigw | 开发中 |

