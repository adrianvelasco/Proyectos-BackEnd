const { UserInputError } = require('apollo-server');
const { formatError } = require('../../helpers/general');

module.exports = {
	id: new UserInputError('Input Error.', formatError('ID invalido.','id')),
	exist: new UserInputError('Input Error.', formatError('El usuario no existe.','user')),
	password: new UserInputError('Input Error.', formatError('Contraseña Incorrecta.','password')),
	existUser: new UserInputError('Input Error.', formatError('El usuario ya existente.','phone')),
};