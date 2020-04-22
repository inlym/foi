# apiio
Serverless服务处理API网关触发器的工具，可跨平台、跨框架使用，能够统一处理API事件，使代码一次编写，多平台复用




## 初始化

初始化获取 request 和 response 对象：

```js
const {request,response} = new Apiio(event,context,callback)
```



同时也支持以下别名方式（建议使用别名，更简短）：

```js
const {req,res} = new Apiio(event,context,callback)
```



## request

request 对象用于接收API网关的入参。包含以下参数：

|   参数名    | 数据类型 |      含义说明      |    示例    |
| :---------: | :------: | :----------------: | :--------: |
|   method    |  string  |      请求方法      |   'GET'    |
|   headers   |  object  |       请求头       |            |
|     url     |  string  |                    |            |
|    path     |  string  |                    | '/path/to' |
| pathParams  |  object  |                    |            |
|    query    |  object  |                    |            |
| querystring |  string  |                    |            |
|    body     |  string  |                    |            |
|     ip      |  string  | 请求客户端的IP地址 | '1.2.3.4'  |



以下参数不常用，但也提供了支持：

|  参数名  | 数据类型 | 含义说明 | 示例 |
| :------: | :------: | :------: | :--: |
| protocol |  string  |          |      |
| rawData  |  buffer  |          |      |
|          |          |          |      |



以下参数不建议使用，可用于调试：

|  参数名  | 数据类型 |                含义说明                 | 示例 |
| :------: | :------: | :-------------------------------------: | :--: |
| protocol |  object  | 由API网关传入，未做任何处理的原始请求头 |      |



### 使用方式

直接根据属性获取即可，例如使用 request.method 获取请求的方法。

```js
console.log(request.method)    // 'GET'
```





### 别名支持

考虑到部分开发者的使用习惯，同时支持以下别名，使用别名和参数名具有完全一致的效果，您无须考虑使用别名引起的兼容性问题。

|   参数名   |                         别名                         |
| :--------: | :--------------------------------------------------: |
|  headers   |                        header                        |
|    data    |                         body                         |
|  rawData   |                       rawBody                        |
|   query    | queries, param, params, queryParams, queryParameters |
|     ip     |                       clientIp                       |
|    path    |                       pathname                       |
| pathParams |                    pathParameters                    |



### 对 headers 的额外支持







## response

### 设置响应状态码

可以通过以下2种方式设置响应的状态码，如果您未指定状态码，将默认设定为 200 。



方式一：使用 setCode 方法设置响应的状态码（推荐）

```js
response.setCode(200)
```



方式二：直接对 statusCode 赋值设置响应的状态码

```js
response.statusCode = 200
```



### 设置响应状态消息

可以通过以下2种方式设置响应的状态消息，如果您未指定状态消息，将自动按照HTTP协议规范自动填充。



方式一：使用 setMessage 方法设置响应的状态消息（推荐）

```js
response.setMessage('ok')
```



方式二：直接对 statusMessage 赋值设置响应的状态消息

```js
response.statusMessage = 'ok'
```



### 设置响应头





### 设置响应body





### 发送响应

使用 send 方法发送响应，------



### 别名支持

同样考虑到部分开发者的使用习惯，同时支持以下别名，使用别名和参数名具有完全一致的效果，您无须考虑使用别名引起的兼容性问题。



|    参数名     |  别名   |
| :-----------: | :-----: |
|  statusCode   | header  |
| statusMessage | message |
|    setData    | setBody |
|     body      |  body   |
|     send      |  end   |





## 使用演示







## 版本历史

