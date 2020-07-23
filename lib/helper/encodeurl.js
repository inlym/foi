'use strict'

/**
 * From: encodeurl@1.0.2
 * Date: 2020-07-22
 */
module.exports = function encodeUrl(url) {
	const ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g
	const UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g
	const UNMATCHED_SURROGATE_PAIR_REPLACE = '$1\uFFFD$2'
	return String(url)
		.replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE)
		.replace(ENCODE_CHARS_REGEXP, encodeURI)
}