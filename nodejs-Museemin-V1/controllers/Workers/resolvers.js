const { Worker } = require('../../models');
const { UserInputError } = require('apollo-server');
const { objectFilter } = require('../../helpers/general');
const validator = require('./validator');
const MESSAGES = require('./error.message');

const resolvers = {
  Query: {
    workers: async (root,{}) => {
      try {        
        const dataWorkers = await Worker.findAll({});
        return dataWorkers;
      }catch (e){
        return e; 
      }
    },
    worker: async (_,{ id }, {}) => {
      try {
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Worker.count  ({ where: { id } });
        if (!exist) throw MESSAGES.exist;
        return await Worker.findByPk(id);
      } catch (e) {
        return e;
      }
    }
  },
  Mutation: {
    createWorker: async (_, { input }, {}) => {
      try {
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });
        if (input.phone && input.phone.length !== 10) throw MESSAGES.phone;
        input.firstName = input.firstName.replace(/\s+/g, ' ').trim();
        input.lastName = input.lastName ? input.lastName.replace(/\s+/g, ' ').trim() : '';
        const dataCreated = await Worker.create({ ...input });
        return dataCreated.dataValues;
      } catch (e) {
        return e;
      }
    },
    updateWorker: async (_, { id, input }, {}) => {
      try {
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });
        if (input.phone && input.phone.length !== 10) throw MESSAGES.phone;
        if(isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Worker.count({ where: { id }});
        if(!exist) throw MESSAGES.exist;
        input.firstName = input.firstName.replace(/\s+/g, ' ').trim();
        input.lastName = input.lastName ? input.lastName.replace(/\s+/g, ' ').trim() : '';
        const dataUpdated = await Worker.update(input, {
          where: { id },
          returning: true,
          plain: true,
        });
        return dataUpdated[1].dataValues;
      } catch (e) {
        return e;
      }
    },
    deleteWorker: async (_, { id }, {}) => {
      try {
        if(isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Worker.count({ where: { id : id }});
        if(!exist) throw MESSAGES.exist;
        const dataDeleted = await Worker.destroy({ where: { id }, returning: true });
        return dataDeleted[0].dataValues;
      } catch (e) {
        return e;
      }
    }
  }
}

module.exports = resolvers;
