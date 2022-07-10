module.exports = `
  type Query{
    clasifications:[Clasification]!
    clasification(id: ID!): Clasification!
  }
  type Mutation {
    createClasification(input: ClasificationData!): Clasification!
    updateClasification(id: ID!, input: ClasificationData!): Clasification!
    deleteClasification(id: ID): Clasification!
  }
`;