'use strict';

const { checkEmptyOrRequired } = require('./../../helpers/general');

const Validator = input => {
	const fields = {
   name : { empty: false }
	};

	const response = checkEmptyOrRequired(fields, input);

  if(response.fields.length === 0) return { isValid: true };
  return response;

};

module.exports = Validator;