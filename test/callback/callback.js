'use strict'

function callback(error, result) {
    if(error){
        console.log('----  error start  ----')
        console.log(error)
        console.log('----  error end  ----')
    }else{
        console.log('----  result start  ----')
        console.log('isBase64Encoded:',result.isBase64Encoded)
        console.log('statusCode:',result.statusCode)
        console.log('headers:',result.headers)
        console.log('body:',result.body)
        console.log('----  result end  ----')
    }
}

module.exports = callback