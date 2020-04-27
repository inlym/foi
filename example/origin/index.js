'use strict'

const fs = require('fs')
const data = fs.readFileSync('./event')
console.log(JSON.parse(data.toString()))