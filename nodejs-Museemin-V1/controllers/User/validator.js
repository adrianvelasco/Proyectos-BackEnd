'use strict';

const { checkEmptyOrRequired } = require('./../../helpers/general');

const Validator = input => {
	const fields = {
    firstName: { empty: false },
    lastName: { empty: false },
    user: { empty: false },
    password: { empty: false },
	};

	const response = checkEmptyOrRequired(fields, input);

  if(response.fields.length === 0) return { isValid: true };
  return response;

};

module.exports = Validator;