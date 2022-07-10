const { Clasification } = require('../../models');
const { UserInputError } = require('apollo-server');
const { objectFilter } = require('../../helpers/general');
const validator = require('./validator');
const MESSAGES = require('./error.message');

const resolvers = {
  Query: {
    clasifications: async (root,{ limit = 25, offset = 0 }) => {
      try {        
        const dataClasifications = await Clasification.findAll({});
        return dataClasifications;
      }catch (e){
        return e; 
      }
    },
    clasification: async (_,{ id }, {}) => {
      try {
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Clasification.count  ({ where: { id } });
        if (!exist) throw MESSAGES.exist;
        return await Clasification.findByPk(id);
      } catch (e) {
        return e;
      }
    }
  },
  Mutation: {
    createClasification: async (_, { input }, {}) => {
      try {
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });
        const dataCreated = await Clasification.create({ ...input });
        return dataCreated.dataValues;
      } catch (e) {
        return e;
      }
    },
    updateClasification: async (_, { id, input }, {}) => {
      try {
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });
        if (input.phone && input.phone.length !== 10) throw MESSAGES.phone;
        if(isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Clasification.count({ where: { id }});
        if(!exist) throw MESSAGES.exist;
        const dataUpdated = await Clasification.update(input, {
          where: { id },
          returning: true,
          plain: true,
        });
        return dataUpdated[1].dataValues;
      } catch (e) {
        return e;
      }
    },
    deleteClasification: async (_, { id }, {}) => {
      try {
        console.log(id);
        if(isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Clasification.count({ where: { id : id }});
        if(!exist) throw MESSAGES.exist;
        const dataDeleted = await Clasification.destroy({ where: { id }, returning: true });
        return dataDeleted[0].dataValues;
      } catch (e) {
        return e;
      }
    }
  }
}

module.exports = resolvers;
