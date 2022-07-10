'use strict';

const { checkEmptyOrRequired } = require('./../../helpers/general');

const Validator = input => {
	const fields = {
    firstName: { empty: false },
    lastName: { empty: false },
    phone: { empty: false },
    addressLine1: { empty: true },
    addressLine2: { empty: true },
    zipCode: { empty: true },
    reference: { empty: true }
	};

	const response = checkEmptyOrRequired(fields, input);

  if(response.fields.length === 0) return { isValid: true };
  return response;

};

module.exports = Validator;