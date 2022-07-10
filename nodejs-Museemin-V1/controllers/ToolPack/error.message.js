const { UserInputError } = require('apollo-server');
const { formatError } = require('../../helpers/general');

module.exports = {
	id: new UserInputError('Input Error.', formatError('ID invalido.','id')),
	exist: new UserInputError('Input Error.', formatError('La Herramienta no existe.','id')),
	existToolpack: new UserInputError('Input Error.', formatError('El kit de herramientas no existe.','id')),
	existClasification: new UserInputError('Input Error.', formatError('La Clasifcación no existe.','id')),
};