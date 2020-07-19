'use strict'


module.exports = {
	error(val) {
		if (typeof val === 'object') {
			val = JSON.stringify(val)
		}
		if (!this.slient) {
			console.error(val)
		}
	},

	warn(val) {
		if (typeof val === 'object') {
			val = JSON.stringify(val)
		}
		if (!this.slient) {
			console.warn(val)
		}
	},

	info(val) {
		if (typeof val === 'object') {
			val = JSON.stringify(val)
		}
		if (!this.slient) {
			console.info(val)
		}
	},

	log(val) {
		if (typeof val === 'object') {
			val = JSON.stringify(val)
		}
		if (!this.slient) {
			console.log(val)
		}
	},

	debug(val) {
		if (typeof val === 'object') {
			val = JSON.stringify(val)
		}
		if (!this.slient) {
			console.debug(val)
		}
	}
}