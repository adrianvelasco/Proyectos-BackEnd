const { UserInputError } = require('apollo-server');
const { formatError } = require('../../helpers/general');

module.exports = {
	id: new UserInputError('Input Error.', formatError('ID invalido.','id')),
	exist: new UserInputError('Input Error.', formatError('El trabajador no existe.','id')),
	existPhone: new UserInputError('Input Error.', formatError('Teléfono ya existente.','phone')),
	zipCode: new UserInputError('Input Error.', formatError('Codigo Postal invalido.','zipCode')),
  phone: new UserInputError('Input Error.', formatError('El teléfono debe de contener 10 digitos.','phone'))
};