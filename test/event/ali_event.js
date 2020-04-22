'use strict'

const origin = {
    "body": "ZnNkYXNkYWZzZGE=",
    "headers": {
        "X-Ca-Api-Gateway": "BDB46B3A-71A7-447B-B20B-28C594426407",
        "X-Forwarded-For": "1.2.3.4"
    },
    "httpMethod": "GET",
    "isBase64Encoded": true,
    "path": "/path/one/two",
    "pathParameters": {

    },
    "queryParameters": {
        "name": "mark",
        "age": 19
    }
}

const event = Buffer.from(JSON.stringify(origin))