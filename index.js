'use strict';

const isPlainObject = require('is-plain-obj');
const arrify = require('arrify');

function minimistOptions(options) {
	if (!options) {
		options = {};
	}

	const result = {};

	Object.keys(options).forEach(key => {
		let value = options[key];

		// if short form is used
		// convert it to long form
		// e.g. { 'name': 'string' }
		if (typeof value === 'string') {
			value = {
				type: value
			};
		}

		if (isPlainObject(value)) {
			const props = value;

			if (props.type) {
				const type = props.type;

				if (type === 'string') {
					push(result, 'string', key);
				}

				if (type === 'boolean') {
					push(result, 'boolean', key);
				}
			}

			const aliases = arrify(props.aliases);

			aliases.forEach(alias => {
				insert(result, 'alias', alias, key);
			});

			if (props.default) {
				insert(result, 'default', key, props.default);
			}
		}
	});

	return result;
}

module.exports = minimistOptions;

function push(obj, prop, value) {
	if (!obj[prop]) {
		obj[prop] = [];
	}

	obj[prop].push(value);
}

function insert(obj, prop, key, value) {
	if (!obj[prop]) {
		obj[prop] = {};
	}

	obj[prop][key] = value;
}
