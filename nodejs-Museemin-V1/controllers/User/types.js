module.exports = `
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    user: String!
    email: String
  }

  type Response {
    status: String!
  }

  type Token {
    token: String!
  }

  input UserData {
    firstName: String!
    lastName: String!
    user: String!
    password: String!
  }
  
  input UserAuth {
    user: String!
    password: String!
  }

`;