const event_obj = {
    "body": "aGVsbG8gd29ybGQ=",
    "headers": {
        "schema": "HTTP",
        "stage": "RELEASE",
        "requestId": "9B9218BE-D65B-4074-AA9C-CA6F8C09E7F5",
        "ip": "1.2.3.4",
        "host": "test.inlym.com"
    },
    "httpMethod": "GET",
    "isBase64Encoded": true,
    "path": "/test",
    "pathParameters": {
        "id": "10"
    },
    "queryParameters": {
        "name": "mark"
    }
}

module.exports = Buffer.from(JSON.stringify(event_obj))