module.exports = `
  type ToolsResponse {
    count: Int
    rows: [Tool]
  }

  type ToolsPackResponse {
    count: Int
    rows: [ToolPack]
  }

  type ToolPack {
    id: ID!
    name: String!
    ToolPackDetails: [ToolPackDetails]!
  }

  type ToolPackDetails {
    id: ID!
    commentary: String
    toolId: ID!
    Tool: Tool!
  }

  type Tool{
    id: ID!
    name: String!
    description: String
    tradeMark: String!
    estatus: String!
    clasificationId: ID!
    Clasification: Clasification
  }
  
  input ToolPackData {
    name: String!
    ToolPackDetails: [ToolPackDetailsData]!
  }

  input ToolPackDetailsData {
    commentary: String
    toolId: ID!
  }

  input ToolData{
    name: String!
    description: String
    tradeMark: String!
    estatus: String!
    clasificationId: ID!
  }
`;