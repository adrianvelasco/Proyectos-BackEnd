const { 
  Tools, 
  Clasification, 
  ToolPack, 
  ToolPackDetails,
  sequelize: SequelizeModel,
  sequelize,
} = require('../../models');
const { UserInputError } = require('apollo-server');
const { objectFilter, orderFormat } = require('../../helpers/general');
const validator = require('./validator');
const MESSAGES = require('./error.message');

const resolvers = {
  Query: {
    tools: async (root,{}) => {
      try {        
        const dataTools = await Tools.findAll({ include: [{ model: Clasification }] });
        return dataTools;
      }catch (e){
        return e; 
      }
    },
    toolsPacks: async (root,{ limit = 25, offset = 0, order = ['id', 'DESC'] }) => {
      try {        
        return  await ToolPack.findAndCountAll({
          include: [
            {
              model: ToolPackDetails,
              include: {
                model:Tools,
                include: Clasification
              }
            }
          ],
          order: orderFormat(order),
          ...objectFilter({ offset: offset * (limit), limit: limit > 0 ? limit : null }),
        })
        .then(data => {
          return{
            count: data.count,
            rows: data.rows.map(el => {
              return{
                ...el.toJSON()
              };
            }),
          };
        });

      }catch (e){
        return e; 
      }
    },
    toolPack : async (_, { id }, {}) => {
      try{
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await ToolPack.count({ where: { id } });
        if(!exist) throw MESSAGES.existToolpack;
        return await ToolPack.findByPk(id, {
          include: [
            {
              model: ToolPackDetails,
              include: {
                model:Tools,
                include: Clasification
              }
            }
          ]
        });
      }catch (e) {
        return e;
      }
    },
    tool: async (_, { id }, {}) => {
      try {
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Tools.count({ where: { id } });
        if(!exist) throw MESSAGES.exist;
        return await Tools.findByPk(id, {
          include: [{ model : Clasification}]
        });
      } catch (e) {
        return e;
      }
    }
  },
  Mutation: {
    createTool: async (_, { input }, {}) => {
      try {
        const { clasificationId } = input; 
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });
        const existClasification = await Clasification.count({ where: {id: clasificationId}});
        if (!existClasification) throw MESSAGES.existClasification;
        const dataClasification = await Clasification.findByPk(clasificationId);
        const dataCreated = await Tools.create({ ...input });
        return { ...dataCreated.dataValues, Clasification: dataClasification.dataValues };
      } catch (e) {
        return e;
      }
    },
    updateTool: async (_, { id, input }, {}) => {
      try {
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const { clasificationId } = input; 
        const { isValid, fields, paths } = validator(input);
        const exist = await Tools.count({ where: { id } });
        if(!exist) throw MESSAGES.exist;
        const existClasification = await Clasification.count({ where: { id }});
        if(!existClasification) throw MESSAGES.existClasification;
        const dataClasification = await Clasification.findByPk(clasificationId);

        const dataUpdated = await Tools.update(input, {
          where: { id },
          returning: true,
          plain: true,
        });
        return {...dataUpdated[1].dataValues, Clasification: dataClasification.dataValues };
      }catch (e) {
        return e;
      }
    },
    deleteTool: async (_, { id }, {}) => {
      try {
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await Tools.count({ where: { id } });
        if(!exist) throw MESSAGES.exist;
        const dataDeleted = await Tools.destroy({ where: { id }, returning: true });
        const { clasificationId } = dataDeleted[0].dataValues;
        const dataClasification = await Clasification.findByPk(clasificationId);
        return {...dataDeleted[0].dataValues, Clasification: dataClasification.dataValues };
      } catch (e) {
        return e;toolPackId
      }
    },
    createToolPack: async (_, { input }, {}) => {
      try {
        return await SequelizeModel.transaction(async t => {
          let Details = [];
          let PacksTools = [];
          const {name, ToolPackDetails: ToolPackData } = input;
          const { dataValues } = await ToolPack.create({name});

          await Promise.all(
            ToolPackData.map(async el => {
              const { id } = dataValues;
              
              const exist = await Tools.count({ where: { id: el.toolId }, transaction: t });
              if(!exist) throw MESSAGES.exist;
              
              const dataTool = await Tools.findOne({
                where: { id: el.toolId },
                include: {
                  model: Clasification
                },
                transaction: t
              });
              const dataCreated = await ToolPackDetails.create({
                toolPackId : id,
                toolId: el.toolId,
                comentary: el.comentary
              }, { transaction: t });

              const toolsdata = { Tool: dataTool.dataValues };
              const returned = Object.assign(dataCreated.dataValues, toolsdata);
              
              PacksTools.push(toolsdata);
              Details.push(returned);
            })
          );
          return { ...dataValues, ToolPackDetails: Details };
        });
      } catch (e) {
        return e;
      }
    },
    updateToolPack: async (_, { id, input }, {}) => {
      try{
        return  await SequelizeModel.transaction(async t => {
          let Details = [];
          let PacksTools = [];
          if (isNaN(parseInt(id))) throw MESSAGES.id;
          const exist = await ToolPack.count({ where: { id } });
          if(!exist) throw MESSAGES.existToolpack;
          const {name, ToolPackDetails: ToolPackData } = input;

          const dataUpdated = await ToolPack.update(
            { name },
            { where: { id }, returning: true, plain: true }
          );          
          await Promise.all(
            ToolPackData.map(async el => {
              const id = dataUpdated[1].dataValues.id;
              
              const exist = await Tools.count(
                { where: { id: el.toolId }, transaction: t }
              );
              if(!exist) throw MESSAGES.exist;
              
              const dataTool = await Tools.findOne({
                where: { id: el.toolId },
                include: {
                  model: Clasification
                }
              });

              const dataUpdated2 = await ToolPackDetails.update({
                  toolPackId : id,
                  toolId: el.toolId,
                  comentary: el.comentary
                }, { where: { id }, returning: true, plain: true }
              ).then(tmp => tmp[1].dataValues);

              const toolsdata = { Tool: dataTool.dataValues };
              const returned = Object.assign(dataUpdated2, toolsdata);
              
              PacksTools.push(toolsdata);
              Details.push(returned);
            })
          );
          return { ...dataUpdated[1].dataValues, ToolPackDetails: Details };
        });    
      } catch (e) {
        return e;
      }
    },
    deleteToolPack: async (_,{ id }, {}) => {
      try {
        if (isNaN(parseInt(id))) throw MESSAGES.id;
        const exist = await ToolPack.count({ where: { id } });
        if(!exist) throw MESSAGES.existToolpack;
        const dataDeleted = await ToolPack.destroy({ where: { id }, returning: true });
        const documentDataDelete = await ToolPackDetails.destroy({ where : { id }, returning: true});
       
        return {...dataDeleted[0].dataValues, ToolPackDetails: documentDataDelete[0].dataValues };
      } catch (e) {
        return e;
      }
    }
  }
}

module.exports = resolvers;

// const { dataValues } = await ToolPack.create({name});
// await Promise.all(
//   ToolPackData.map(async el => {
//     const { commentary, toolId } = el;
//     const { id } = dataValues;
//     if (isNaN(parseInt(toolId))) throw MESSAGES.id;
//     const exist = await Tools.count({ where: { id : toolId} });
//     if(!exist) throw MESSAGES.exist;
//     const dataTool = await Tools.findByPk(toolId, {
//       include: [{ model : Clasification}]
//     });
//     const dataCreated = ToolPackDetails.create({toolPackId : id, toolId, commentary});
    
//     const detailsData = dataCreated.dataValues;
//     const toolsData = { Tool: dataTool.dataValues };

//     const returned = Object.assign(detailsData, toolsData);

//     Tools.push(toolsData);
//     Details.push(returned);
//   })
// );

// return {...dataValues,ToolPackDetails: Details};