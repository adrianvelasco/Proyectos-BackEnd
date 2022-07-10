const { User } = require('../../models');
const validator = require('./validator');
const MESSAGES = require('./error.message');
const { UserInputError } = require('apollo-server');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

dotenv.config({path: '.env'});

const createToken = (UserData, secret, expiresIn) => {
  const { id, firstName, lastName, user } = UserData;
  return jwt.sign({id, firstName, lastName, user}, secret, {expiresIn});
}


const resolvers = {
  Query: {
    getUserAuth: async(_, {  }, ctx) => {      
      return ctx.UserData;
    }
  },
  Mutation: {
    createUser: async (_, { input }, {}) => {
      try {
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });
        const usernameAvailability = await User.count({ where: { user: input.user } });
        if(usernameAvailability > 0) throw MESSAGES.existUser;
        await User.create({ ...input });
        return {status: "The user was created successfully."};
      } catch (e) {
        return e;
      }
    },
    authenticateUser: async (_, {input}, {}) => {
      try {
        const {user, password} = input;   
        const { isValid, fields, paths } = validator(input);
        if (!isValid) throw new UserInputError('Input Error', { fields, paths });     
        const usernameAvailability = await User.findOne({ where: { user } });
        if(!usernameAvailability) throw MESSAGES.exist    
        const suuccesPassword = await bcrypt.compare(password, usernameAvailability.password);
        if(!suuccesPassword) throw MESSAGES.password
        return{
          token: createToken(usernameAvailability, process.env.SECRET, '30day')
        }
      } catch (e) {
        console.log(e.message);
        return e;
      }
    }
  }
}

module.exports = resolvers;


