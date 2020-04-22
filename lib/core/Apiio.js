'use strict'


function Apiio(event, context, callback) {
    this.event = event
    this.context = context
    this.callback = callback
    this.request = new Request(this)
    this.response = new Response(this)
}