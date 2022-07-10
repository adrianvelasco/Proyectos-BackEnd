module.exports = `
  type Worker{
    id: ID!
    firstName: String!
    lastName: String!
    phone: String!
    addressLine1: String
    addressLine2: String
    zipCode: String
    reference: String
  }
  input WorkerData {
    firstName: String!
    lastName: String!
    phone: String!
    addressLine1: String
    addressLine2: String
    zipCode: String
    reference: String
  }
`;