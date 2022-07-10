module.exports = `
  type Query{
    getUserAuth: User!
  }
  
  type Mutation {
    createUser(input: UserData!): Response!
    authenticateUser(input: UserAuth!): Token!
  }
`;