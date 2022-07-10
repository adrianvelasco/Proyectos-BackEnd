const { ApolloServer } = require('apollo-server');
const schema = require('./controllers');
const  jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const server = new ApolloServer({ 
  schema,
  context: async({req}) => {
    //obtener token del servidor
    const token = req.headers.authorization || '';
    
    if(token){
      try {
        const UserData = await jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
        
        return {
          UserData
        }
        
      } catch (e){
        console.log(e);
      }
    }
  }
});


server.listen(normalizePort('4000'));
function normalizePort(val) {
  const PORT = 4000;
  console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
