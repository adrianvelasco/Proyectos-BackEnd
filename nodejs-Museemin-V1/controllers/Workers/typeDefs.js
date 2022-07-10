module.exports = `
  type Query{
    workers: [Worker]
    worker(id: ID!): Worker!
  }
  type Mutation {
    createWorker(input: WorkerData!): Worker!
    updateWorker(id: ID!, input: WorkerData!): Worker!
    deleteWorker(id: ID): Worker!
  }
`;