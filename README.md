#  foi 
基于Serverless架构API网关触发器Web开发框架，让你轻松处理请求和发送响应，可跨平台使用。





## 简介

**foi** 是一款小巧易用的基于Serverless架构API网关触发器的Web开发框架，通过使用 **foi** ，你可以更优雅地开发Serverless应用。虽然各个云计算平台（例如阿里云、腾讯云等）对Serverless都有不同的实现，体现在各入口参数的不同，你不必因此担心，**foi** 将帮助你抹平各云计算平台FaaS服务之间的差异，让你的一套代码，可以到处运行。





## 优点

* 完美支持Serverless服务的API网关触发器的相关事件，简单易用

* 相比原生写法，使用 **foi** 后，能够大大减少开发工作量

* 兼容从Koa框架迁移Serverless服务，只需要改动几行代码就可以适配






 ## 支持平台

目前 **foi** 已支持以下云计算平台的Serverless服务：

|   云平台   |  服务名称  |        服务英文名         | 服务英文缩写 |                          地址                          | appio支持 |
| :--------: | :--------: | :-----------------------: | :----------: | :----------------------------------------------------: | :-------: |
|   阿里云   |  函数计算  |     Function Compute      |      FC      |           https://www.aliyun.com/product/fc            |  已支持   |
|   腾讯云   |   云函数   | Serverless Cloud Function |     SCF      |         https://cloud.tencent.com/product/scf          |  开发中   |
|   华为云   | 函数工作流 |      Function Graph       |      FG      | https://www.huaweicloud.com/product/functiongraph.html |  开发中   |
| 百度智能云 |  函数计算  |  Cloud Function Compute   |     CFC      |        https://cloud.baidu.com/product/cfc.html        |  开发中   |
|    AWS     |   Lambda   |          Lambda           |      AL      |            https://aws.amazon.com/cn/lambda            |  开发中   |





## 安装

使用npm安装：

```shell
npm install foi
```

如果访问速度较慢，建议使用cnpm安装：（如需查看cnpm的安装方式，请[点击](https://developer.aliyun.com/mirror/NPM) ）

```shell
cnpm install foi
```





## 使用

### 引用

使用前，首先进行引用：

```javascript
const Foi = require('foi')
```



### 初始化

#### 方式一（推荐）

直接使用解构语法获取 **request** 和 **response** 对象：

```js
const { request, response } = new Foi(event, context, callback)
```

同时也支持以下别名方式（建议使用别名，更简短）：

```js
const { req, res } = new Foi(event, context, callback)
```



#### 方式二

直接获取 **app** 对象，以属性的方式使用 **request** 和 **response** 对象：

```javascript
const app = new foi(event, context, callback)
app.request    // request对象
app.response   // response对象
```

同理，方式二也支持 **req** 和 **res** 别名。

```javascript
const app = new foi(event, context, callback)
app.req    // request对象
app.res    // response对象
```



### 使用方式

你可以像使用普通对象那样使用 **request** 对象和 **response** 对象，例如可以使用 *request.method* 获取请求方法，使用 *response.body='abc'* 设置响应主体，等等。最终使用 *response.send()* 发送响应。

```javascript
request.method         // 获取请求方法
response.body='abc'    // 设置响应主体为abc
response.send()        // 发送响应
```

完整的属性和方法请查看以下的请求对象（request）和响应对象（response）。





## 请求对象（request）

### 属性

 **request** 对象用于接收API网关的入参。包含以下参数：

|   参数名    | 数据类型 |       含义说明        |                             示例                             |
| :---------: | :------: | :-------------------: | :----------------------------------------------------------: |
|   method    |  string  |       请求方法        |                            'GET'                             |
|   headers   |  object  |        请求头         | {"user-agent":"Mozilla/5.0","accept-language":"zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7"} |
|  protocol   |  string  |       HTTP协议        |                            'HTTP'                            |
|    host     |  string  |       请求域名        |                       'api.inlym.com'                        |
|     url     |  string  |        请求url        |                 '/path/to?name=mark&age=19'                  |
|    path     |  string  |       请求路径        |                          '/path/to'                          |
| pathParams  |  object  |     请求路径参数      |                       {"post_id":123}                        |
|    query    |  object  |     请求查询对象      |                   {"name":"mark","age":19}                   |
| querystring |  string  |    请求查询字符串     |                      'name=mark&age=19'                      |
|    body     |  string  |       请求主体        |                            'abc'                             |
|     ip      |  string  |  请求客户端的IP地址   |                          '1.2.3.4'                           |
|     id      |  string  | 请求id，由API网关提供 |            'FDB8CDF8-8DD8-425E-8944-FD9A675B9E0E'            |

备注：
* 为正常使用，以下参数需要在API网关设置，设置方式见下述 使用须知：
	1. protocol
	2. host
	3. ip
* query、pathParams等参数按需设置透传或映射。
* 为保证兼容性，所有的header头将转换成小写字符。
* 严格来讲，这里的url实际上应是path，为保持兼容性，因此使用url来表示。
* 严格来讲，这里的path实际上应是pathname，为保持兼容性，因此使用path来表示。



以下属性不常用，但也提供了支持：

| 参数名  | 数据类型 |                含义说明                |          示例          |
| :-----: | :------: | :------------------------------------: | :--------------------: |
| rawBody |  buffer  | buffer形式的请求主体，常用于图片类请求 | Buffer(3) [97, 98, 99] |



以下属性不建议使用，可用于调试：

|   参数名   | 数据类型 |                含义说明                 |                             示例                             |
| :--------: | :------: | :-------------------------------------: | :----------------------------------------------------------: |
| rawHeaders |  object  | 由API网关传入，未做任何处理的原始请求头 | {"User-Agent":"Mozilla/5.0","Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7"} |



### 方法

#### req.getHeader(field)

获取请求头字段field（不区分大小写）

```javascript
req.getHeader('Content-Type')    // 'image/png'
```



#### req.setHeader(field, value)

设置请求头字段field的值为value

```javascript
req.setHeader('Content-Type') = 'image/png'
```



#### req.removeHeader(field)
移除请求头字段field
```javascript
req.removeHeader('Content-Type')
```



### 别名支持

考虑到部分开发者的使用习惯，同时支持以下别名，使用别名和参数名具有完全一致的效果，您无须考虑使用别名引起的兼容性问题。

属性别名：

|   参数名   |                         别名                         |
| :--------: | :--------------------------------------------------: |
|  headers   |                        header                        |
|    body    |                         data                         |
|  rawBody   |                       rawData                        |
|   query    | queries, param, params, queryParams, queryParameters |
|     ip     |                 clientIp, client_ip                  |
|    path    |                       pathname                       |
| pathParams |                    pathParameters                    |



方法别名：

|    参数名    |  别名  |
| :----------: | :----: |
|  getHeader   |  get   |
|  setHeader   |  set   |
| removeHeader | remove |





## 响应对象（response）

### 属性

### 方法





#### 设置响应状态码

可以通过以下2种方式设置响应的状态码，如果您未指定状态码，将默认设定为 200 。



方式一：使用 setCode 方法设置响应的状态码（推荐）

```js
response.setCode(200)
```



方式二：直接对 statusCode 赋值设置响应的状态码

```js
response.statusCode = 200
```



#### 设置响应状态消息

可以通过以下2种方式设置响应的状态消息，如果您未指定状态消息，将自动按照HTTP协议规范自动填充。



方式一：使用 setMessage 方法设置响应的状态消息（推荐）

```js
response.setMessage('ok')
```



方式二：直接对 statusMessage 赋值设置响应的状态消息

```js
response.statusMessage = 'ok'
```



#### 设置响应头





#### 设置响应body





#### 发送响应

使用 send 方法发送响应，------



### 别名支持

同样考虑到部分开发者的使用习惯，同时支持以下别名，使用别名和参数名具有完全一致的效果，您无须考虑使用别名引起的兼容性问题。



|    参数名     |  别名   |
| :-----------: | :-----: |
|  statusCode   | header  |
| statusMessage | message, statusText |
|    setData    | setBody |
|     body      |  data  |
|     send      |  end   |



## 使用须知

### 阿里云





## 使用演示







## 版本历史

