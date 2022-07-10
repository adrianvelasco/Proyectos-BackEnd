module.exports = `
  type Query{
    tools:[Tool]!
    toolsPacks(offset: Int, limit: Int): ToolsPackResponse!
    toolPack(id: ID!): ToolPack!
    tool(id: ID!): Tool!
  }
  type Mutation {
    createTool(input: ToolData!): Tool!
    updateTool(id: ID!, input: ToolData!): Tool!
    deleteTool(id: ID): Tool!
    createToolPack(input: ToolPackData!): ToolPack!
    updateToolPack(id: ID!, input: ToolPackData!): ToolPack!
    deleteToolPack(id: ID): ToolPack!
  }
`;